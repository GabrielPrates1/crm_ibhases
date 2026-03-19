/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import * as S from "./styles";
import API from "../../../services/api";
import useAuth from "../../../hooks/auth";
import { useHistory, useParams } from "react-router-dom";
import NavigationHeader from "../../../components/navigationHeader";

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

      const formatDate = (dateStr?: string | null) => {
            if (!dateStr) return "-";
            return dateStr.slice(0, 10).split("-").reverse().join("/");
      };

      const NewRequest = async () => {
            const state: any = history?.location?.state?.["state"]?.patient;

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
            return history.push(`/evolution/relatory/show/${id}`, {
                  patientName: people.patient.name,
                  patientId: people.patient.id,
            });
      };

      useEffect(() => {
            if (!params.id) {
                  alert("Please inform a params");
                  history.goBack();
            }
            NewRequest();
      }, []);

      const patientName = people?.patient?.name || "Paciente";

      return (
            <S.ReportStyles>
                  {/* Navigation Header */}
                  <NavigationHeader
                        title="Relatório de Evoluções"
                        backPath="/patient/relatory"
                        breadcrumbs={[
                              { label: "Pacientes", path: "/patient/relatory" },
                              { label: patientName },
                        ]}
                  />

                  {/* Header with Filter */}
                  <S.Header>
                        <h3 style={{ margin: 0, color: "#666" }}>
                              Evoluções de:{" "}
                              <strong style={{ color: "#0088b2" }}>
                                    {patientName}
                              </strong>
                        </h3>
                        <S.Select>
                              <select
                                    id="select"
                                    className="input"
                                    onChange={({ target }) =>
                                          Filter(target.value)
                                    }
                                    defaultValue="*"
                              >
                                    <option value="*">Todos</option>
                                    <option value="ativo">Ativos</option>
                                    <option value="transferido">
                                          Transferidos
                                    </option>
                                    <option value="finalizado">
                                          Finalizados
                                    </option>
                              </select>
                              <S.Arrow direction="down" className="seta" />
                        </S.Select>
                  </S.Header>

                  {/* Table */}
                  <div className="ContainerTable">
                        {people && people.relatory.length >= 1 ? (
                              <S.Table>
                                    <thead>
                                          <tr>
                                                <th>Data</th>
                                                <th>Nome do Interno</th>
                                                <th>Usuário Responsável</th>
                                                <th>Status</th>
                                                <th className="IconTable">
                                                      Opções
                                                </th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          {(peopleFilter
                                                ? peopleFilter.relatory
                                                : people.relatory
                                          ).map((ItemBody, index) => {
                                                return (
                                                      <tr key={index}>
                                                            <td>
                                                                  {formatDate(
                                                                        ItemBody.created_at,
                                                                  )}
                                                            </td>
                                                            <td>
                                                                  {peopleFilter
                                                                        ? peopleFilter
                                                                                .patient
                                                                                .name
                                                                        : people
                                                                                .patient
                                                                                .name}
                                                            </td>
                                                            <td>
                                                                  {
                                                                        ItemBody.managers_name
                                                                  }
                                                            </td>
                                                            <td
                                                                  style={{
                                                                        textTransform:
                                                                              "capitalize",
                                                                  }}
                                                            >
                                                                  {
                                                                        ItemBody.status
                                                                  }
                                                            </td>
                                                            <td className="IconTable">
                                                                  <S.EyeIcon
                                                                        onClick={() =>
                                                                              showRelatory(
                                                                                    ItemBody.id,
                                                                              )
                                                                        }
                                                                  />
                                                            </td>
                                                      </tr>
                                                );
                                          })}
                                    </tbody>
                              </S.Table>
                        ) : (
                              <div
                                    style={{
                                          padding: "60px 40px",
                                          textAlign: "center",
                                          background: "#fff",
                                          borderRadius: "8px",
                                          marginTop: "20px",
                                    }}
                              >
                                    <h2
                                          style={{
                                                color: "#666",
                                                marginBottom: "20px",
                                          }}
                                    >
                                          {people === null
                                                ? "Carregando..."
                                                : "Não foram localizadas evoluções para este paciente"}
                                    </h2>
                                    {people !== null && (
                                          <div
                                                style={{
                                                      display: "flex",
                                                      gap: "16px",
                                                      justifyContent: "center",
                                                }}
                                          >
                                                <button
                                                      onClick={() =>
                                                            history.push(
                                                                  "/patient/relatory",
                                                            )
                                                      }
                                                      style={{
                                                            padding: "12px 24px",
                                                            background:
                                                                  "linear-gradient(135deg, #00568c 0%, #0088b2 50%, #3dbb95 100%)",
                                                            color: "white",
                                                            border: "none",
                                                            borderRadius: "8px",
                                                            cursor: "pointer",
                                                            fontSize: "14px",
                                                            fontWeight: "500",
                                                      }}
                                                >
                                                      Voltar para Pacientes
                                                </button>
                                                <button
                                                      onClick={() =>
                                                            NewRequest()
                                                      }
                                                      style={{
                                                            padding: "12px 24px",
                                                            background:
                                                                  "transparent",
                                                            border: "1px solid #ccc",
                                                            color: "#666",
                                                            borderRadius: "8px",
                                                            cursor: "pointer",
                                                            fontSize: "14px",
                                                      }}
                                                >
                                                      Tentar Novamente
                                                </button>
                                          </div>
                                    )}
                              </div>
                        )}
                  </div>
            </S.ReportStyles>
      );
};

export default EvolutionRelatory;
