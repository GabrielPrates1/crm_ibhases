/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import * as S from "./styles";
import Chart from "../../../components/chart";
import API from "../../../services/api";
import useAuth from "../../../hooks/auth";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface IRequestData {
      patients: number;
      active: number;
      moved: number;
      finished: number;
}

// Ícones SVG inline para evitar problemas com emojis
const Icons = {
      users: (
            <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
            >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
      ),
      heart: (
            <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
            >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
      ),
      transfer: (
            <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
            >
                  <path d="M18 8L22 12L18 16" />
                  <path d="M2 12H22" />
            </svg>
      ),
      check: (
            <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
            >
                  <polyline points="20 6 9 17 4 12" />
            </svg>
      ),
      plus: (
            <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
            >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
      ),
      list: (
            <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
            >
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
      ),
      clipboard: (
            <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
            >
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
      ),
      settings: (
            <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
            >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
      ),
      chart: (
            <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
            >
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
      ),
};

const COLORS = {
      total: "#0088b2",
      active: "#10b981",
      moved: "#f59e0b",
      finished: "#8b5cf6",
};

const Dashboard: React.FC = () => {
      const { userData } = useAuth();
      const history = useHistory();
      const [stats, setStats] = useState<IRequestData | null>(null);
      const [loading, setLoading] = useState(true);

      const getGreeting = () => {
            const hour = new Date().getHours();
            if (hour < 12) return "Bom dia";
            if (hour < 18) return "Boa tarde";
            return "Boa noite";
      };

      const fetchStats = async () => {
            try {
                  const { data }: { data: IRequestData } = await API.get(
                        "stats/home",
                        {
                              headers: { Authorization: userData!.token },
                        },
                  );
                  setStats(data);
            } catch (e) {
                  console.error("Error fetching stats:", e);
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            fetchStats();
      }, []);

      const pieData = stats
            ? [
                    {
                          name: "Ativos",
                          value: stats.active,
                          color: COLORS.active,
                    },
                    {
                          name: "Transferidos",
                          value: stats.moved,
                          color: COLORS.moved,
                    },
                    {
                          name: "Finalizados",
                          value: stats.finished,
                          color: COLORS.finished,
                    },
              ]
            : [];

      const totalPie = pieData.reduce((sum, item) => sum + item.value, 0);

      const getPercent = (value: number) =>
            stats?.patients ? Math.round((value / stats.patients) * 100) : 0;

      return (
            <S.DashboardStyles>
                  <S.WelcomeSection>
                        <S.WelcomeTitle>{getGreeting()}</S.WelcomeTitle>
                        <S.WelcomeSubtitle>
                              Painel de gestão de pacientes - Comunidade
                              Terapeutica
                        </S.WelcomeSubtitle>
                  </S.WelcomeSection>

                  <S.Cards>
                        <S.Card delay={0}>
                              <S.CardIconWrapper color={COLORS.total}>
                                    {Icons.users}
                              </S.CardIconWrapper>
                              <S.CardLabel>Total de Pacientes</S.CardLabel>
                              <S.CardValue>
                                    {loading ? "—" : stats?.patients || 0}
                              </S.CardValue>
                              <S.CardTrend>Registro geral</S.CardTrend>
                        </S.Card>

                        <S.Card delay={1}>
                              <S.CardIconWrapper color={COLORS.active}>
                                    {Icons.heart}
                              </S.CardIconWrapper>
                              <S.CardLabel>Pacientes Ativos</S.CardLabel>
                              <S.CardValue>
                                    {loading ? "—" : stats?.active || 0}
                              </S.CardValue>
                              <S.CardTrend positive>
                                    {getPercent(stats?.active || 0)}% do total
                              </S.CardTrend>
                        </S.Card>

                        <S.Card delay={2}>
                              <S.CardIconWrapper color={COLORS.moved}>
                                    {Icons.transfer}
                              </S.CardIconWrapper>
                              <S.CardLabel>Transferidos</S.CardLabel>
                              <S.CardValue>
                                    {loading ? "—" : stats?.moved || 0}
                              </S.CardValue>
                              <S.CardTrend>
                                    {getPercent(stats?.moved || 0)}% do total
                              </S.CardTrend>
                        </S.Card>

                        <S.Card delay={3}>
                              <S.CardIconWrapper color={COLORS.finished}>
                                    {Icons.check}
                              </S.CardIconWrapper>
                              <S.CardLabel>Finalizados</S.CardLabel>
                              <S.CardValue>
                                    {loading ? "—" : stats?.finished || 0}
                              </S.CardValue>
                              <S.CardTrend>
                                    {getPercent(stats?.finished || 0)}% do total
                              </S.CardTrend>
                        </S.Card>
                  </S.Cards>

                  <S.ContentGrid>
                        <S.MainContent>
                              <S.Panel>
                                    <S.PanelHeader>
                                          <S.PanelTitle>
                                                {Icons.chart}
                                                Evolucao Mensal
                                          </S.PanelTitle>
                                          <S.ChartTabs>
                                                <S.ChartTab active>
                                                      Mensal
                                                </S.ChartTab>
                                                <S.ChartTab>Anual</S.ChartTab>
                                          </S.ChartTabs>
                                    </S.PanelHeader>
                                    <Chart />
                              </S.Panel>
                        </S.MainContent>

                        <S.SideContent>
                              <S.QuickActionsPanel>
                                    <S.PanelTitle style={{ marginBottom: 16 }}>
                                          Acoes Rapidas
                                    </S.PanelTitle>

                                    <S.ActionsList>
                                          <S.ActionButton
                                                variant="primary"
                                                onClick={() =>
                                                      history.push(
                                                            "/patient/create",
                                                      )
                                                }
                                          >
                                                {Icons.plus}
                                                <S.ActionText>
                                                      Cadastrar Paciente
                                                </S.ActionText>
                                                <S.ActionArrow>→</S.ActionArrow>
                                          </S.ActionButton>

                                          <S.ActionButton
                                                onClick={() =>
                                                      history.push(
                                                            "/patient/relatory",
                                                      )
                                                }
                                          >
                                                {Icons.list}
                                                <S.ActionText>
                                                      Lista de Pacientes
                                                </S.ActionText>
                                                <S.ActionArrow>→</S.ActionArrow>
                                          </S.ActionButton>

                                          <S.ActionButton
                                                onClick={() =>
                                                      history.push(
                                                            "/evolution/relatory",
                                                      )
                                                }
                                          >
                                                {Icons.clipboard}
                                                <S.ActionText>
                                                      Evolucoes
                                                </S.ActionText>
                                                <S.ActionArrow>→</S.ActionArrow>
                                          </S.ActionButton>

                                          <S.ActionButton
                                                onClick={() =>
                                                      history.push("/managers")
                                                }
                                          >
                                                {Icons.settings}
                                                <S.ActionText>
                                                      Gerenciar Usuarios
                                                </S.ActionText>
                                                <S.ActionArrow>→</S.ActionArrow>
                                          </S.ActionButton>
                                    </S.ActionsList>
                              </S.QuickActionsPanel>

                              <S.StatsPanel>
                                    <S.StatsPanelTitle>
                                          {Icons.chart}
                                          Distribuicao por Status
                                    </S.StatsPanelTitle>

                                    {totalPie > 0 ? (
                                          <>
                                                <S.DonutWrapper>
                                                      <ResponsiveContainer
                                                            width={160}
                                                            height={160}
                                                      >
                                                            <PieChart>
                                                                  <Pie
                                                                        data={
                                                                              pieData
                                                                        }
                                                                        cx="50%"
                                                                        cy="50%"
                                                                        innerRadius={
                                                                              50
                                                                        }
                                                                        outerRadius={
                                                                              70
                                                                        }
                                                                        paddingAngle={
                                                                              4
                                                                        }
                                                                        dataKey="value"
                                                                        strokeWidth={
                                                                              0
                                                                        }
                                                                  >
                                                                        {pieData.map(
                                                                              (
                                                                                    entry,
                                                                                    index,
                                                                              ) => (
                                                                                    <Cell
                                                                                          key={
                                                                                                index
                                                                                          }
                                                                                          fill={
                                                                                                entry.color
                                                                                          }
                                                                                    />
                                                                              ),
                                                                        )}
                                                                  </Pie>
                                                                  <Tooltip
                                                                        contentStyle={{
                                                                              background:
                                                                                    "#fff",
                                                                              border: "1px solid #e8ecf0",
                                                                              borderRadius: 8,
                                                                              fontSize: 13,
                                                                        }}
                                                                        formatter={(
                                                                              value: number,
                                                                              name: string,
                                                                        ) => [
                                                                              `${value} (${Math.round(
                                                                                    (value /
                                                                                          totalPie) *
                                                                                          100,
                                                                              )}%)`,
                                                                              name,
                                                                        ]}
                                                                  />
                                                            </PieChart>
                                                      </ResponsiveContainer>
                                                </S.DonutWrapper>

                                                <S.Legend>
                                                      {pieData.map(
                                                            (item, index) => (
                                                                  <S.LegendItem
                                                                        key={
                                                                              index
                                                                        }
                                                                  >
                                                                        <S.LegendDot
                                                                              color={
                                                                                    item.color
                                                                              }
                                                                        />
                                                                        {
                                                                              item.name
                                                                        }
                                                                        :{" "}
                                                                        {
                                                                              item.value
                                                                        }
                                                                  </S.LegendItem>
                                                            ),
                                                      )}
                                                </S.Legend>
                                          </>
                                    ) : (
                                          <S.EmptyStats>
                                                Nenhum dado para exibir
                                          </S.EmptyStats>
                                    )}
                              </S.StatsPanel>
                        </S.SideContent>
                  </S.ContentGrid>
            </S.DashboardStyles>
      );
};

export default Dashboard;
