import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

export const DashboardStyles = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: linear-gradient(135deg, #f8fafb 0%, #f0f4f8 100%);
  margin: -24px;
  padding: 32px;

  @media (max-width: 768px) {
    padding: 16px;
    margin: -16px;
  }
`;

export const WelcomeSection = styled.div`
  margin-bottom: 32px;
  animation: ${fadeIn} 0.4s ease-out;
`;

export const WelcomeTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #1e3a5f;
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
`;

export const WelcomeSubtitle = styled.p`
  color: #6b7c93;
  font-size: 15px;
  margin: 0;
  font-weight: 400;
`;

export const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 28px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

interface ICardProps {
  accentColor?: string;
  delay?: number;
}

export const Card = styled.div<ICardProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.25s ease;
  animation: ${fadeIn} 0.4s ease-out backwards;
  animation-delay: ${(props) => (props.delay || 0) * 0.08}s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }
`;

export const CardIconWrapper = styled.div<{ color?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  background: ${(props) => props.color ? `${props.color}10` : "#e8f4f8"};

  svg {
    width: 24px;
    height: 24px;
    color: ${(props) => props.color || "#0088b2"};
  }
`;

export const CardLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #6b7c93;
  margin-bottom: 8px;
`;

export const CardValue = styled.span`
  font-size: 32px;
  font-weight: 700;
  color: #1e3a5f;
  line-height: 1;
  letter-spacing: -1px;
`;

export const CardTrend = styled.span<{ positive?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-top: 12px;
  color: ${({ positive }) => (positive ? "#059669" : "#6b7c93")};
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const SideContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Panel = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.04);
  animation: ${fadeIn} 0.4s ease-out backwards;
  animation-delay: 0.3s;
`;

export const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const PanelTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1e3a5f;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    width: 20px;
    height: 20px;
    color: #0088b2;
  }
`;

export const ChartTabs = styled.div`
  display: flex;
  gap: 4px;
  background: #f5f7f9;
  padding: 4px;
  border-radius: 10px;
`;

export const ChartTab = styled.button<{ active?: boolean }>`
  padding: 8px 14px;
  border: none;
  background: ${({ active }) => (active ? "#ffffff" : "transparent")};
  color: ${({ active }) => (active ? "#1e3a5f" : "#6b7c93")};
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${({ active }) => (active ? "0 1px 3px rgba(0,0,0,0.08)" : "none")};

  &:hover {
    color: #1e3a5f;
  }
`;

export const QuickActionsPanel = styled(Panel)`
  animation-delay: 0.35s;
`;

export const ActionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ActionButton = styled.button<{ variant?: "primary" | "secondary" }>`
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 14px 16px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  background: ${({ variant }) =>
    variant === "primary"
      ? "linear-gradient(135deg, #0088b2 0%, #00a3d9 100%)"
      : "#f8fafb"};
  color: ${({ variant }) => (variant === "primary" ? "#ffffff" : "#1e3a5f")};
  border: ${({ variant }) =>
    variant === "primary" ? "none" : "1px solid #e8ecf0"};

  &:hover {
    transform: translateX(4px);
    box-shadow: ${({ variant }) =>
      variant === "primary"
        ? "0 4px 16px rgba(0, 136, 178, 0.25)"
        : "0 2px 8px rgba(0, 0, 0, 0.06)"};
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

export const ActionText = styled.div`
  flex: 1;
`;

export const ActionArrow = styled.span`
  opacity: 0.5;
  font-size: 16px;
`;

export const StatsPanel = styled(Panel)`
  background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%);
  color: #ffffff;
  animation-delay: 0.4s;
`;

export const StatsPanelTitle = styled.h3`
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 20px 0;
  opacity: 0.85;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 18px;
    height: 18px;
    opacity: 0.7;
  }
`;

export const DonutWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
`;

export const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
`;

export const LegendDot = styled.span<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => props.color};
`;

export const EmptyStats = styled.div`
  text-align: center;
  padding: 32px 16px;
  opacity: 0.7;
  font-size: 14px;
`;

export const LoadingCard = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  height: 120px;
  border-radius: 16px;
`;
