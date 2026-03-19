import React, { useEffect, useState } from "react";
import * as S from "./styles";
import { usePatientFilter } from "../../../hooks/patientFilter";
import { useHistory } from "react-router-dom";
import moment from "moment";

const PatientRelatory: React.FC = () => {
      const history = useHistory();
      const {
            filters,
            pagination,
            isLoading,
            setFilter,
            clearFilters,
            setPage,
            fetchPatients,
            removePatient,
            getCurrentPageItems,
            getVisiblePages,
            patients,
      } = usePatientFilter();

      // Estado local para controle do modal de filtros avançados
      const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

      const HowManyDays = (day: string) => {
            day = day.slice(0, 10);
            const now = moment(new Date());
            return Math.floor(moment.duration(now.diff(day)).asDays());
      };

      const showHowManyDays = (date?: string | null) => {
            if (!date) {
                  return "Sem data de internação";
            }
            const days = HowManyDays(date);
            return days === 1 ? "1 Dia" : `${days} dias`;
      };

      const formatDate = (dateStr?: string | null) => {
            if (!dateStr) return "-";
            return dateStr.slice(0, 10).split("-").reverse().join("/");
      };

      const goToRelatory = (id: string, name: string) => {
            history.push(`/evolution/relatory/${id}`, {
                  state: { patient: name },
            });
      };

      const goToEditPatient = (id: string) => {
            history.push(`/patient/edit/${id}`);
      };

      const handleRemovePatient = async (id: string) => {
            if (window.confirm("Deseja realmente excluir este paciente?")) {
                  await removePatient(id);
            }
      };

      // Carrega pacientes ao montar (apenas se não tiver dados)
      useEffect(() => {
            if (patients.length === 0) {
                  fetchPatients();
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      const currentItems = getCurrentPageItems();
      const visiblePages = getVisiblePages();
      const hasActiveFilters =
            filters.status !== "*" ||
            filters.name !== "" ||
            filters.manager !== "" ||
            filters.dateStart !== "" ||
            filters.dateEnd !== "";

      return (
            <S.ReportStyles>
                  {/* Header */}
                  <S.Header>
                        <h2>Relatório dos Pacientes</h2>

                        <div
                              style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "16px",
                              }}
                        >
                              {/* Botão limpar filtros */}
                              {hasActiveFilters && (
                                    <button
                                          onClick={clearFilters}
                                          style={{
                                                background: "transparent",
                                                border: "1px solid #ccc",
                                                borderRadius: "8px",
                                                padding: "8px 16px",
                                                cursor: "pointer",
                                                fontSize: "14px",
                                          }}
                                    >
                                          Limpar Filtros
                                    </button>
                              )}

                              {/* Select de status */}
                              <S.Select>
                                    <select
                                          id="select"
                                          className="input"
                                          onChange={({ target }) =>
                                                setFilter(
                                                      "status",
                                                      target.value,
                                                )
                                          }
                                          value={filters.status || "*"}
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
                                    <S.Arrow
                                          direction="down"
                                          className="seta"
                                    />
                              </S.Select>
                        </div>
                  </S.Header>

                  {/* Filtros Avançados */}
                  <div style={{ marginTop: "16px" }}>
                        <button
                              onClick={() =>
                                    setShowAdvancedFilters(!showAdvancedFilters)
                              }
                              style={{
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#0088b2",
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                              }}
                        >
                              <S.Arrow
                                    direction={
                                          showAdvancedFilters ? "up" : "down"
                                    }
                                    size="10px"
                              />
                              Filtros Avançados
                        </button>

                        {showAdvancedFilters && (
                              <div
                                    style={{
                                          marginTop: "16px",
                                          padding: "16px",
                                          background: "#f9f9f9",
                                          borderRadius: "8px",
                                          display: "flex",
                                          gap: "16px",
                                          flexWrap: "wrap",
                                    }}
                              >
                                    {/* Nome do paciente */}
                                    <div
                                          style={{
                                                flex: "1",
                                                minWidth: "200px",
                                          }}
                                    >
                                          <label
                                                style={{
                                                      fontSize: "12px",
                                                      color: "#666",
                                                }}
                                          >
                                                Nome do Paciente
                                          </label>
                                          <input
                                                type="text"
                                                placeholder="Buscar por nome..."
                                                value={filters.name || ""}
                                                onChange={(e) =>
                                                      setFilter(
                                                            "name",
                                                            e.target.value,
                                                      )
                                                }
                                                style={{
                                                      width: "100%",
                                                      padding: "10px",
                                                      border: "1px solid #ddd",
                                                      borderRadius: "8px",
                                                      marginTop: "4px",
                                                }}
                                          />
                                    </div>

                                    {/* Nome do responsável */}
                                    <div
                                          style={{
                                                flex: "1",
                                                minWidth: "200px",
                                          }}
                                    >
                                          <label
                                                style={{
                                                      fontSize: "12px",
                                                      color: "#666",
                                                }}
                                          >
                                                Usuário Responsável
                                          </label>
                                          <input
                                                type="text"
                                                placeholder="Buscar por responsável..."
                                                value={filters.manager || ""}
                                                onChange={(e) =>
                                                      setFilter(
                                                            "manager",
                                                            e.target.value,
                                                      )
                                                }
                                                style={{
                                                      width: "100%",
                                                      padding: "10px",
                                                      border: "1px solid #ddd",
                                                      borderRadius: "8px",
                                                      marginTop: "4px",
                                                }}
                                          />
                                    </div>

                                    {/* Data início */}
                                    <div style={{ minWidth: "150px" }}>
                                          <label
                                                style={{
                                                      fontSize: "12px",
                                                      color: "#666",
                                                }}
                                          >
                                                Data Início
                                          </label>
                                          <input
                                                type="date"
                                                value={filters.dateStart || ""}
                                                onChange={(e) =>
                                                      setFilter(
                                                            "dateStart",
                                                            e.target.value,
                                                      )
                                                }
                                                style={{
                                                      width: "100%",
                                                      padding: "10px",
                                                      border: "1px solid #ddd",
                                                      borderRadius: "8px",
                                                      marginTop: "4px",
                                                }}
                                          />
                                    </div>

                                    {/* Data fim */}
                                    <div style={{ minWidth: "150px" }}>
                                          <label
                                                style={{
                                                      fontSize: "12px",
                                                      color: "#666",
                                                }}
                                          >
                                                Data Fim
                                          </label>
                                          <input
                                                type="date"
                                                value={filters.dateEnd || ""}
                                                onChange={(e) =>
                                                      setFilter(
                                                            "dateEnd",
                                                            e.target.value,
                                                      )
                                                }
                                                style={{
                                                      width: "100%",
                                                      padding: "10px",
                                                      border: "1px solid #ddd",
                                                      borderRadius: "8px",
                                                      marginTop: "4px",
                                                }}
                                          />
                                    </div>
                              </div>
                        )}
                  </div>

                  {/* Tabela */}
                  <div className="ContainerTable">
                        {isLoading ? (
                              <h1
                                    style={{
                                          padding: "40px",
                                          textAlign: "center",
                                    }}
                              >
                                    Carregando...
                              </h1>
                        ) : currentItems.length >= 1 ? (
                              <S.Table>
                                    <thead>
                                          <tr>
                                                <th>Criado em</th>
                                                <th>Internado à</th>
                                                <th>Nome do Interno</th>
                                                <th>Usuário Responsável</th>
                                                <th>Status</th>
                                                <th className="IconTable">
                                                      Ações
                                                </th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          {currentItems.map((item, index) => (
                                                <tr key={item.id || index}>
                                                      <td>
                                                            {formatDate(
                                                                  item.created_at,
                                                            )}
                                                      </td>
                                                      <td>
                                                            {showHowManyDays(
                                                                  item.joined_at,
                                                            )}
                                                      </td>
                                                      <td>{item.name}</td>
                                                      <td>
                                                            {item.managers_name}
                                                      </td>
                                                      <td
                                                            style={{
                                                                  textTransform:
                                                                        "capitalize",
                                                            }}
                                                      >
                                                            {item.status}
                                                      </td>
                                                      <td className="IconTable">
                                                            <S.EyeIcon
                                                                  onClick={() =>
                                                                        goToRelatory(
                                                                              item.id!,
                                                                              item.name!,
                                                                        )
                                                                  }
                                                            />
                                                            <S.EditIcon
                                                                  onClick={() =>
                                                                        goToEditPatient(
                                                                              item.id!,
                                                                        )
                                                                  }
                                                            />
                                                            <S.LixoIcon
                                                                  onClick={() =>
                                                                        handleRemovePatient(
                                                                              item.id!,
                                                                        )
                                                                  }
                                                            />
                                                      </td>
                                                </tr>
                                          ))}
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
                                          {patients.length === 0
                                                ? "Não foram localizados registros"
                                                : "Nenhum paciente encontrado com os filtros aplicados"}
                                    </h2>
                                    <div
                                          style={{
                                                display: "flex",
                                                gap: "16px",
                                                justifyContent: "center",
                                          }}
                                    >
                                          <button
                                                onClick={() =>
                                                      history.push("/")
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
                                                Voltar ao Dashboard
                                          </button>
                                          {hasActiveFilters && (
                                                <button
                                                      onClick={clearFilters}
                                                      style={{
                                                            padding: "12px 24px",
                                                            background:
                                                                  "transparent",
                                                            border: "1px solid #0088b2",
                                                            color: "#0088b2",
                                                            borderRadius: "8px",
                                                            cursor: "pointer",
                                                            fontSize: "14px",
                                                            fontWeight: "500",
                                                      }}
                                                >
                                                      Limpar Filtros
                                                </button>
                                          )}
                                          <button
                                                onClick={() => fetchPatients()}
                                                style={{
                                                      padding: "12px 24px",
                                                      background: "transparent",
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
                              </div>
                        )}

                        {/* Paginação */}
                        {pagination.totalPages > 1 && (
                              <S.Indexao>
                                    {/* Botão Anterior */}
                                    <S.IndexaoCard
                                          backgroundState="transparent"
                                          disable={pagination.currentPage <= 1}
                                          onClick={() =>
                                                setPage(
                                                      pagination.currentPage -
                                                            1,
                                                )
                                          }
                                    >
                                          <S.Arrow
                                                color="#52575c"
                                                size="12px"
                                                direction="left"
                                          />
                                    </S.IndexaoCard>

                                    {/* Páginas */}
                                    {visiblePages.map((pageNum, index) =>
                                          pageNum === "..." ? (
                                                <span
                                                      key={`ellipsis-${index}`}
                                                      style={{
                                                            padding: "0 8px",
                                                            color: "#666",
                                                            userSelect: "none",
                                                      }}
                                                >
                                                      ...
                                                </span>
                                          ) : (
                                                <S.IndexaoCard
                                                      key={pageNum}
                                                      onClick={() =>
                                                            setPage(
                                                                  pageNum as number,
                                                            )
                                                      }
                                                      backgroundState={
                                                            pagination.currentPage ===
                                                            pageNum
                                                                  ? "gradient"
                                                                  : "transparent"
                                                      }
                                                >
                                                      {pageNum}
                                                </S.IndexaoCard>
                                          ),
                                    )}

                                    {/* Botão Próximo */}
                                    <S.IndexaoCard
                                          backgroundState="transparent"
                                          onClick={() =>
                                                setPage(
                                                      pagination.currentPage +
                                                            1,
                                                )
                                          }
                                          disable={
                                                pagination.currentPage >=
                                                pagination.totalPages
                                          }
                                    >
                                          <S.Arrow
                                                color="#52575c"
                                                size="12px"
                                                direction="right"
                                          />
                                    </S.IndexaoCard>

                                    {/* Info de paginação */}
                                    <span
                                          style={{
                                                marginLeft: "16px",
                                                fontSize: "14px",
                                                color: "#666",
                                          }}
                                    >
                                          Página {pagination.currentPage} de{" "}
                                          {pagination.totalPages} (
                                          {pagination.totalItems} registros)
                                    </span>
                              </S.Indexao>
                        )}
                  </div>
            </S.ReportStyles>
      );
};

export default PatientRelatory;
