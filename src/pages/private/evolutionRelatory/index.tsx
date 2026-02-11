/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import * as S from "./styles";
import API from "../../../services/api";
import useAuth from "../../../hooks/auth";
import { useHistory, useParams } from "react-router-dom";

interface IRelatory {
  patient: { name: string; id: string };
  relatory: {
    id: string;
    managers_id: string;
    managers_name: string;
    status: string;
    created_at: string;
    joined_at: string;
  }[];
}

const EvolutionRelatory: React.FC = () => {
  const { userData } = useAuth();
  const history = useHistory();
  const params: { id?: string; name?: string } = useParams();
  const [people, setPeople] = useState<IRelatory | null>(null);
  const [peopleFilter, setPeopleFilter] = useState<IRelatory | null>(null);

  const Filter = (find: string) => {
    if (!people) return null;
    if (find === "*") {
      setPeopleFilter(null);
      return;
    }

    const data = people.relatory.filter((f): any => {
      return f.status!.includes(find);
    });

    setPeopleFilter({ ...people, relatory: data });
  };

  const NewRequest = async () => {
    console.log("enviando: ");

    const state: any = history?.location?.state?.["state"].patient;

    const {
      data: { patient, relatory },
    }: {
      data: IRelatory;
    } = await API.get("patient/get/evolution/all", {
      headers: {
        Authorization: userData!.token,
      },
      params: {
        id: params.id,
        name: state,
      },
    });

    setPeople({ patient, relatory });
  };

  const showRelatory = (id: string) => {
    if (!people) return null;
    return history.push(`/evolution/relatory/show/${id}`);
  };

  useEffect(() => {
    if (!params.id) {
      alert("Please inform a params");
      history.goBack();
    }
    NewRequest();
  }, []);

  return (
    <S.ReportStyles>
      {/* Header */}
      <S.Header>
        {/* Title */}
        <h2>Relatório Evoluções</h2>
        {/* Input Select w/Linear*/}
        <S.Select>
          <select
            id="select"
            className="input"
            onChange={({ target }) => Filter(target.value)}
            defaultValue="*"
          >
            <option value="*">Todos</option>
            <option value="ativo">Ativos</option>
            <option value="transferido">Transferidos</option>
            <option value="finalizado">Finalizados</option>
          </select>
          <S.Arrow direction="down" className="seta" />
        </S.Select>
      </S.Header>
      {/* Table */}
      {people && people.relatory.length >= 1 ? (
        <S.Table>
          {/* Title Table */}
          <thead>
            <th>Data</th>
            <th>Nome do Interno</th>
            <th>Usuário Responsável</th>
            <th>Status</th>
            <th className="IconTable">Opções</th>
          </thead>
          {/* Info Table */}
          <tbody>
            {(peopleFilter ? peopleFilter.relatory : people.relatory).map(
              (ItemBody, index) => {
                return (
                  <tr key={index}>
                    <td>
                      {ItemBody.created_at!.slice(0, 10)
                        .replaceAll("-", "/")
                        .split("")}
                    </td>
                    <td>
                      {peopleFilter
                        ? peopleFilter.patient.name
                        : people.patient.name}
                    </td>
                    <td>{ItemBody.managers_name}</td>
                    <td style={{ textTransform: "capitalize" }}>
                      {ItemBody.status}
                    </td>
                    <td className="IconTable">
                      <S.EyeIcon onClick={() => showRelatory(ItemBody.id)} />
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </S.Table>
      ) : (
        <h1>
          {people === null
            ? "Carregando..."
            : people.relatory.length === 0 &&
              "Não foram localizados os registros"}{" "}
        </h1>
      )}
    </S.ReportStyles>
  );
};

export default EvolutionRelatory;
