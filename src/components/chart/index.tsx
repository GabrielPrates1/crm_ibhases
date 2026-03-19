/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  Tooltip,
  Legend,
} from "recharts";
import useAuth from "../../hooks/auth";
import API from "../../services/api";
import * as S from "./styles";

interface ChartDataItem {
  monthName: string;
  quantity: number;
  active: number;
  moved: number;
  finished: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
  }>;
  label?: string;
}

const CHART_COLORS = {
  quantity: "#0088b2",
  active: "#10b981",
  moved: "#f59e0b",
  finished: "#8b5cf6",
};

const CHART_LABELS: Record<string, string> = {
  quantity: "Total",
  active: "Ativos",
  moved: "Transferidos",
  finished: "Finalizados",
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <S.CustomTooltipWrapper>
      <S.TooltipTitle>{label}</S.TooltipTitle>
      {payload.map((entry, index) => (
        <S.TooltipRow key={index}>
          <S.TooltipLabel color={entry.color}>
            {CHART_LABELS[entry.dataKey] || entry.dataKey}
          </S.TooltipLabel>
          <S.TooltipValue>{entry.value}</S.TooltipValue>
        </S.TooltipRow>
      ))}
    </S.CustomTooltipWrapper>
  );
};

const Chart: React.FC = () => {
  const { userData } = useAuth();
  const [data, setData] = useState<ChartDataItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await API.get("/stats/graph", {
        headers: { Authorization: userData!.token },
      });
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <S.LoadingState>
        <S.LoadingSpinner />
        Carregando dados...
      </S.LoadingState>
    );
  }

  if (!data || data.length === 0) {
    return (
      <S.EmptyState>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 3v18h18" />
          <path d="M7 16l4-4 4 4 5-6" />
        </svg>
        <p>Nenhum dado disponível para exibir</p>
      </S.EmptyState>
    );
  }

  return (
    <S.ChartStyles>
      <S.ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradientTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS.quantity} stopOpacity={0.3} />
                <stop offset="100%" stopColor={CHART_COLORS.quantity} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradientActive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS.active} stopOpacity={0.3} />
                <stop offset="100%" stopColor={CHART_COLORS.active} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradientMoved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS.moved} stopOpacity={0.3} />
                <stop offset="100%" stopColor={CHART_COLORS.moved} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradientFinished" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS.finished} stopOpacity={0.3} />
                <stop offset="100%" stopColor={CHART_COLORS.finished} stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="0"
              stroke="#f0f2f5"
              vertical={false}
            />

            <XAxis
              dataKey="monthName"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7c93", fontSize: 12 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7c93", fontSize: 12 }}
              dx={-10}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="top"
              height={40}
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => (
                <span style={{ color: "#1e3a5f", fontSize: 13, fontWeight: 500 }}>
                  {CHART_LABELS[value] || value}
                </span>
              )}
            />

            <Area
              type="monotone"
              dataKey="quantity"
              stroke={CHART_COLORS.quantity}
              strokeWidth={2.5}
              fill="url(#gradientTotal)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
            />
            <Area
              type="monotone"
              dataKey="active"
              stroke={CHART_COLORS.active}
              strokeWidth={2.5}
              fill="url(#gradientActive)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
            />
            <Area
              type="monotone"
              dataKey="moved"
              stroke={CHART_COLORS.moved}
              strokeWidth={2.5}
              fill="url(#gradientMoved)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
            />
            <Area
              type="monotone"
              dataKey="finished"
              stroke={CHART_COLORS.finished}
              strokeWidth={2.5}
              fill="url(#gradientFinished)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </S.ChartContainer>
    </S.ChartStyles>
  );
};

export default Chart;
