import styled from "styled-components";

export const ChartStyles = styled.div`
  width: 100%;
  
  .recharts-cartesian-grid-horizontal line {
    stroke: #e8ecf0;
    stroke-dasharray: none;
  }
  
  .recharts-cartesian-axis-tick-value {
    fill: #6b7c93;
    font-size: 12px;
    font-weight: 500;
  }
  
  .recharts-legend-item-text {
    color: #1e3a5f !important;
    font-size: 13px;
    font-weight: 500;
  }
`;

export const ChartContainer = styled.div`
  width: 100%;
  height: 320px;
  
  @media (max-width: 768px) {
    height: 260px;
  }
`;

export const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 320px;
  color: #6b7c93;
  font-size: 14px;
  gap: 12px;
`;

export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #e8ecf0;
  border-top-color: #0088b2;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const CustomTooltipWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #e8ecf0;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-width: 180px;
`;

export const TooltipTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1e3a5f;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f2f5;
`;

export const TooltipRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
`;

export const TooltipLabel = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7c93;

  &::before {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 3px;
    background: ${props => props.color};
  }
`;

export const TooltipValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1e3a5f;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 320px;
  color: #6b7c93;
  
  svg {
    width: 48px;
    height: 48px;
    margin-bottom: 16px;
    opacity: 0.4;
  }
  
  p {
    margin: 0;
    font-size: 14px;
  }
`;
