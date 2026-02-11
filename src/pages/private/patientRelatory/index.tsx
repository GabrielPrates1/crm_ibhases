/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import * as S from "./styles";
import { useModalCalendarContext } from "../../../context/ModalCalendar";
import API from "../../../services/api";
import useAuth from "../../../hooks/auth";
import { useHistory } from "react-router-dom";
import IPatient from "../../../interfaces/IPatient";
import moment from "moment";
import { sucess, error, warning, info } from "../../../components/alert";

interface IPersons {
  id: string;
  managers_id: string;
  managers_name: string;
  created_at: string;
  name: string;
  status: string;
  joined_at: string;
}

const PatientRelatory: React.FC = () => {
  const { updateStateTrue, responseAPI: FilterByModal } =
    useModalCalendarContext();
  const { userData } = useAuth();
  const history = useHistory();

  const [page, setPage] = useState<number>(1);
  const [limitPage, setLimitPage] = useState<number>(0);
  const [people, setPeople] = useState<IPatient[] | null>(null);
  const [peopleFilter, setPeopleFilter] = useState<IPatient[] | null>(null);

  const HowManyDays = (day: string) => {
    day = day.slice(0, 10);
    const now = moment(new Date());
    return Math.floor(moment.duration(now.diff(day)).asDays());
  };

  const showHowManyDays = (date?: string | null) => {
    if (!date) {
      return "Adicione a data em que o pacitente iniciou o tratamento.";
    }

    const day = HowManyDays(date);
    return day === 1 ? "1 Dia" : `${day} dias`;
  };

  const Filter = (find: string) => {
    if (!people) return null;
    if (find === "*") {
      setPeopleFilter(null);
      return setLimitPage(Math.ceil(people.length / 10));
    }

    const data = people.filter((f): any => {
      return f.status!.includes(find);
    });

    setPeopleFilter(data);
    return setLimitPage(Math.ceil(data.length / 10));
  };

  const removePatient = (id: string) => {
    if (!people) return null;

    API.delete("master/patient/delete", {
      headers: {
        Authorization: userData!.token,
      },
      data: {
        id: id,
      },
    })
      .then((e) => {
        setPeople((F) => {
          if (F === null || undefined) return null;

          F.filter((patient, k) => {
            if (patient.id!.includes(id)) {
              F.splice(k, 1);
            }

            return patient;
          });
          return [...F];
        });

        setLimitPage(Math.ceil(people.length / 10));
        sucess("Paciente Deletado com Sucesso!");
      })
      .catch((e) => {
        if (e.request.status === 401) {
          return warning("O usuário está sem permissão.");
        }
        return error("Não foi possível deletar o paciente, tente novamente.");
      });
  };

  const NewRequest = async () => {
    const {
      data: { patients },
    }: { data: { patients: IPersons[] } } = await API.get("patient/get/all", {
      headers: {
        Authorization: userData!.token,
      },
    });

    setLimitPage(Math.ceil(patients.length / 10));
    setPeople(patients);
  };

  const setCurrent = ({ index }: { index: number }) => {
    if (index <= 0 || index > limitPage || index === page) return null;

    return setPage(index);
  };

  const goToRelatory = (id: string, name: string) => {
    console.log("goToRelatory");
    if (!people) return null;

    return history.push(`/evolution/relatory/${id}`, {
      state: {
        patient: name,
      },
    });
  };

  const goToEditPatient = (id: string) => {
    if (!people) return null;
    return history.push(`/patient/edit/${id}`);
  };

  useEffect(() => {
    if (FilterByModal) {
      setPeopleFilter(FilterByModal);
      return setLimitPage(Math.ceil(FilterByModal.length / 10));
    }
  }, [FilterByModal]);

  useEffect(() => {
    NewRequest();
  }, []);

  return (
    <S.ReportStyles>
      {/* Header */}
      <S.Header>
        {/* Title */}
        <h2>Relatório dos Pacientes</h2>

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
      <div className="ContainerTable">
        {people && people.length >= 1 ? (
          <S.Table>
            {/* Title Table */}
            <thead>
              <th>Criado em</th>
              <th>Internado à</th>
              <th>Nome do Interno</th>
              <th>Usuário Responsável</th>
              <th>Status</th>
              <th className="IconTable">
                <button className="buttonModal" onClick={updateStateTrue}>
                  <S.CalendarIcon />
                  <S.TextFilter> Filtrar </S.TextFilter>
                </button>
              </th>
            </thead>
            {/* Info Table */}
            <tbody>
              {people && peopleFilter
                ? peopleFilter
                    .slice(
                      Number.parseInt(page.toString() + "0") - 10,
                      Number.parseInt(page.toString() + "0")
                    )
                    .map((ItemBody, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            {ItemBody.created_at!.slice(0, 10)
                              .replaceAll("-", "/")
                              .split("")}
                          </td>
                          <td>{showHowManyDays(ItemBody.joined_at)}</td>
                          <td>{ItemBody.name}</td>
                          <td>{ItemBody.managers_name}</td>
                          <td style={{ textTransform: "capitalize" }}>
                            {ItemBody.status}
                          </td>
                          <td className="IconTable">
                            <S.EyeIcon
                              onClick={() =>
                                goToRelatory(ItemBody.id!, ItemBody.name!)
                              }
                            />
                            <S.EditIcon
                              onClick={() => goToEditPatient(ItemBody.id!)}
                            />
                            <S.LixoIcon
                              onClick={() => removePatient(ItemBody.id!)}
                            />
                          </td>
                        </tr>
                      );
                    })
                : people
                    .slice(
                      Number.parseInt(page.toString() + "0") - 10,
                      Number.parseInt(page.toString() + "0")
                    )
                    .map((ItemBody, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            {ItemBody.created_at!.slice(0, 10)
                              .replaceAll("-", "/")
                              .split("")}
                          </td>
                          <td>{showHowManyDays(ItemBody.joined_at)}</td>
                          <td>{ItemBody.name}</td>
                          <td>{ItemBody.managers_name}</td>
                          <td style={{ textTransform: "capitalize" }}>
                            {ItemBody.status}
                          </td>
                          <td className="IconTable">
                            <S.EyeIcon
                              onClick={() =>
                                goToRelatory(ItemBody.id!, ItemBody.name!)
                              }
                            />
                            <S.EditIcon
                              onClick={() => goToEditPatient(ItemBody.id!)}
                            />
                            <S.LixoIcon
                              onClick={() => removePatient(ItemBody.id!)}
                            />
                          </td>
                        </tr>
                      );
                    })}
            </tbody>
          </S.Table>
        ) : (
          <h1>
            {people === null
              ? "Carregando..."
              : people.length === 0 &&
                "Não foram localizados os registros"}{" "}
          </h1>
        )}
        {people && (
          <S.Indexao>
            {/* Next Page or Back Page */}
            <S.IndexaoCard
              backgroundState={"transparent"}
              disable={page - 1 <= 0 ? true : false}
              onClick={() => setCurrent({ index: page - 1 })}
            >
              <S.Arrow color="#52575c" size="12px" direction="left" />
            </S.IndexaoCard>

            {[...Array(limitPage).fill("").keys()].map((i) => {
              return (
                <S.IndexaoCard
                  key={i}
                  onClick={() => setCurrent({ index: i + 1 })}
                  backgroundState={page === i + 1 ? "gradient" : "transparent"}
                >
                  {i + 1}
                </S.IndexaoCard>
              );
            })}

            <S.IndexaoCard
              backgroundState={"transparent"}
              onClick={() => setCurrent({ index: page + 1 })}
              disable={page + 1 > limitPage ? true : false}
            >
              <S.Arrow color="#52575c" size="12px" direction="right" />
            </S.IndexaoCard>
          </S.Indexao>
        )}
      </div>
    </S.ReportStyles>
  );
};

export default PatientRelatory;
