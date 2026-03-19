import styled, { css } from "styled-components";

export const Container = styled.div`
      display: flex;
      flex-direction: column;
      min-height: 100%;
`;

export const LoadingContainer = styled.div`
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
      background: #fff;
      border-radius: 12px;
      margin-top: 20px;

      span {
            color: #666;
            font-size: 16px;
      }
`;

export const ContentGrid = styled.div`
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 24px;
      margin-top: 24px;

      @media screen and (max-width: 1024px) {
            grid-template-columns: 1fr;
      }
`;

export const MainColumn = styled.div`
      display: flex;
      flex-direction: column;
      gap: 20px;
`;

export const Sidebar = styled.div`
      display: flex;
      flex-direction: column;
      gap: 20px;

      @media screen and (max-width: 1024px) {
            order: -1;
      }
`;

export const Card = styled.div`
      background: #fff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

export const CardHeader = styled.div`
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid #f0f0f0;
`;

export const CardTitle = styled.h3`
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
`;

interface IStatusBadgeProps {
      status?: string;
}

const getStatusColor = (status?: string) => {
      switch (status?.toLowerCase()) {
            case "ativo":
                  return { bg: "#e8f5e9", color: "#2e7d32" };
            case "transferido":
                  return { bg: "#fff3e0", color: "#ef6c00" };
            case "finalizado":
                  return { bg: "#fce4ec", color: "#c62828" };
            default:
                  return { bg: "#f5f5f5", color: "#666" };
      }
};

export const StatusBadge = styled.span<IStatusBadgeProps>`
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: capitalize;
      ${({ status }) => {
            const colors = getStatusColor(status);
            return css`
                  background: ${colors.bg};
                  color: ${colors.color};
            `;
      }}
`;

export const TypeBadge = styled.span`
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      background: linear-gradient(135deg, #e3f2fd 0%, #e8f5e9 100%);
      color: #0088b2;
`;

export const InfoGrid = styled.div`
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;

      @media screen and (max-width: 600px) {
            grid-template-columns: 1fr;
      }
`;

interface IInfoItemProps {
      fullWidth?: boolean;
}

export const InfoItem = styled.div<IInfoItemProps>`
      display: flex;
      flex-direction: column;
      gap: 4px;

      ${({ fullWidth }) =>
            fullWidth &&
            css`
                  grid-column: 1 / -1;
            `}
`;

export const InfoLabel = styled.span`
      font-size: 12px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.5px;
`;

export const InfoValue = styled.span`
      font-size: 15px;
      color: #333;
      font-weight: 500;
`;

export const DescriptionSection = styled.div`
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
`;

export const DescriptionBox = styled.div`
      background: #f9fafb;
      border: 1px solid #e8e8e8;
      border-radius: 8px;
      padding: 16px;
      font-size: 14px;
      line-height: 1.6;
      color: #444;
      min-height: 120px;
      white-space: pre-wrap;
`;

export const ProfileSection = styled.div`
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
`;

export const ProfileImage = styled.img`
      width: 120px;
      height: 120px;
      border-radius: 60px;
      object-fit: cover;
      border: 4px solid #f0f0f0;
      margin-bottom: 16px;
`;

export const ProfilePlaceholder = styled.div`
      width: 120px;
      height: 120px;
      border-radius: 60px;
      background: linear-gradient(
            135deg,
            #00568c 0%,
            #0088b2 50%,
            #3dbb95 100%
      );
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      font-weight: 600;
      color: white;
      margin-bottom: 16px;
`;

export const ProfileName = styled.h3`
      margin: 0 0 4px 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
`;

export const ProfileSubtext = styled.span`
      font-size: 13px;
      color: #888;
`;

export const DocCount = styled.span`
      background: #0088b2;
      color: white;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
`;

export const DocumentsList = styled.div`
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 250px;
      overflow-y: auto;

      &::-webkit-scrollbar {
            width: 6px;
      }

      &::-webkit-scrollbar-thumb {
            border-radius: 3px;
            background-color: #ddd;
      }
`;

export const DocumentItem = styled.div`
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f9fafb;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
            background: #f0f4f8;
            transform: translateX(4px);
      }

      img {
            width: 24px;
            height: 24px;
      }

      span {
            font-size: 13px;
            color: #333;
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
      }
`;

export const EmptyDocs = styled.div`
      text-align: center;
      padding: 24px;
      color: #999;
      font-size: 13px;
`;

export const ActionsCard = styled.div`
      display: flex;
      flex-direction: column;
      gap: 12px;
`;

interface IActionButtonProps {
      primary?: boolean;
}

export const ActionButton = styled.button<IActionButtonProps>`
      padding: 14px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: none;

      ${({ primary }) =>
            primary
                  ? css`
                          background: linear-gradient(
                                135deg,
                                #00568c 0%,
                                #0088b2 50%,
                                #3dbb95 100%
                          );
                          color: white;

                          &:hover {
                                opacity: 0.9;
                                transform: translateY(-1px);
                          }
                    `
                  : css`
                          background: transparent;
                          border: 1px solid #ddd;
                          color: #666;

                          &:hover {
                                background: #f5f5f5;
                                border-color: #ccc;
                          }
                    `}
`;

// Mantém exports antigos para compatibilidade
export const PatientEvolu = styled.div``;
export const Patient = styled.div``;
export const ProfilePhoto = styled.div``;
export const Box = styled.label``;
