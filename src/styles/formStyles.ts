import styled, { css } from "styled-components";

export const Container = styled.div`
      display: flex;
      flex-direction: column;
      min-height: 100%;
`;

export const PageHeader = styled.div`
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
`;

export const PageTitle = styled.h1`
      font-size: 28px;
      font-weight: 700;
      color: #1a1a2e;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 12px;
`;

export const PageSubtitle = styled.p`
      color: #666;
      font-size: 14px;
      margin: 4px 0 0 0;
`;

export const ContentGrid = styled.div`
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 24px;

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
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

export const CardHeader = styled.div`
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #f5f5f5;
`;

export const CardTitle = styled.h3`
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #1a1a2e;
      display: flex;
      align-items: center;
      gap: 10px;
`;

export const CardIcon = styled.span`
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      background: linear-gradient(135deg, #e3f2fd 0%, #e8f5e9 100%);
`;

export const FormGrid = styled.div`
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;

      @media screen and (max-width: 600px) {
            grid-template-columns: 1fr;
      }
`;

interface IFormGroupProps {
      fullWidth?: boolean;
}

export const FormGroup = styled.div<IFormGroupProps>`
      display: flex;
      flex-direction: column;
      gap: 6px;

      ${({ fullWidth }) =>
            fullWidth &&
            css`
                  grid-column: 1 / -1;
            `}
`;

export const Label = styled.label`
      font-size: 13px;
      font-weight: 500;
      color: #555;
      text-transform: uppercase;
      letter-spacing: 0.5px;
`;

export const Input = styled.input`
      padding: 14px 16px;
      border: 2px solid #e8e8e8;
      border-radius: 10px;
      font-size: 15px;
      color: #333;
      background: #fafafa;
      transition: all 0.2s;
      outline: none;

      &:focus {
            border-color: #0088b2;
            background: #fff;
            box-shadow: 0 0 0 4px rgba(0, 136, 178, 0.1);
      }

      &:disabled {
            background: #f0f0f0;
            color: #888;
            cursor: not-allowed;
      }

      &::placeholder {
            color: #aaa;
      }
`;

export const Select = styled.select`
      padding: 14px 16px;
      border: 2px solid #e8e8e8;
      border-radius: 10px;
      font-size: 15px;
      color: #333;
      background: #fafafa;
      transition: all 0.2s;
      outline: none;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 16px center;
      padding-right: 40px;

      &:focus {
            border-color: #0088b2;
            background-color: #fff;
            box-shadow: 0 0 0 4px rgba(0, 136, 178, 0.1);
      }
`;

export const TextArea = styled.textarea`
      padding: 14px 16px;
      border: 2px solid #e8e8e8;
      border-radius: 10px;
      font-size: 15px;
      color: #333;
      background: #fafafa;
      transition: all 0.2s;
      outline: none;
      resize: vertical;
      min-height: 120px;
      font-family: inherit;

      &:focus {
            border-color: #0088b2;
            background: #fff;
            box-shadow: 0 0 0 4px rgba(0, 136, 178, 0.1);
      }

      &::placeholder {
            color: #aaa;
      }
`;

export const ProfileCard = styled.div`
      background: #fff;
      border-radius: 16px;
      padding: 32px 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
`;

export const ProfileImageWrapper = styled.div`
      position: relative;
      margin-bottom: 16px;
`;

export const ProfileImage = styled.img`
      width: 150px;
      height: 150px;
      border-radius: 75px;
      object-fit: cover;
      border: 4px solid #f0f0f0;
`;

export const ProfileImagePlaceholder = styled.div`
      width: 150px;
      height: 150px;
      border-radius: 75px;
      background: linear-gradient(
            135deg,
            #00568c 0%,
            #0088b2 50%,
            #3dbb95 100%
      );
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 56px;
      font-weight: 600;
      color: white;
`;

export const UploadButton = styled.label`
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: linear-gradient(
            135deg,
            #00568c 0%,
            #0088b2 50%,
            #3dbb95 100%
      );
      color: white;
      border-radius: 25px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 8px;

      &:hover {
            opacity: 0.9;
            transform: translateY(-1px);
      }

      input {
            display: none;
      }
`;

export const StatusBadge = styled.span<{ status?: string }>`
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      ${({ status }) => {
            switch (status?.toLowerCase()) {
                  case "ativo":
                        return css`
                              background: #e8f5e9;
                              color: #2e7d32;
                        `;
                  case "transferido":
                        return css`
                              background: #fff3e0;
                              color: #ef6c00;
                        `;
                  case "finalizado":
                        return css`
                              background: #fce4ec;
                              color: #c62828;
                        `;
                  default:
                        return css`
                              background: #f5f5f5;
                              color: #666;
                        `;
            }
      }}
`;

export const SubmitButton = styled.button`
      width: 100%;
      padding: 16px 24px;
      background: linear-gradient(
            135deg,
            #00568c 0%,
            #0088b2 50%,
            #3dbb95 100%
      );
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;

      &:hover {
            opacity: 0.95;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 136, 178, 0.3);
      }

      &:active {
            transform: translateY(0);
      }
`;

export const SecondaryButton = styled.button`
      width: 100%;
      padding: 14px 24px;
      background: transparent;
      color: #666;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
            background: #f5f5f5;
            border-color: #ccc;
      }
`;

export const DocumentsCard = styled.div`
      background: #fff;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

export const DocumentsList = styled.div`
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 200px;
      overflow-y: auto;
      margin-top: 16px;

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

export const EmptyState = styled.div`
      text-align: center;
      padding: 24px;
      color: #999;
      font-size: 13px;
`;

export const UploadDocButton = styled.label`
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 12px;
      border: 2px dashed #d0d0d0;
      border-radius: 10px;
      color: #666;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 12px;

      &:hover {
            border-color: #0088b2;
            color: #0088b2;
            background: rgba(0, 136, 178, 0.05);
      }

      input {
            display: none;
      }
`;

export const RequiredMark = styled.span`
      color: #e53935;
      margin-left: 2px;
`;

export const HelpText = styled.span`
      font-size: 11px;
      color: #999;
      margin-top: 4px;
`;

export const ActionButtons = styled.div`
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 8px;
`;

export const Badge = styled.span`
      background: #e3f2fd;
      color: #1976d2;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
`;

export const LoadingState = styled.div`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      gap: 16px;
      color: #666;
      font-size: 15px;
`;

export const LoadingSpinner = styled.div`
      width: 40px;
      height: 40px;
      border: 3px solid #f0f0f0;
      border-top-color: #0088b2;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;

      @keyframes spin {
            to {
                  transform: rotate(360deg);
            }
      }
`;

export const DocumentIcon = styled.div`
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
`;

export const DocumentInfo = styled.div`
      flex: 1;
      min-width: 0;
`;

export const DocumentName = styled.span`
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
`;

export const DocumentMeta = styled.span`
      font-size: 11px;
      color: #999;
`;

export const DocumentAction = styled.span`
      color: #0088b2;
      font-size: 14px;
      font-weight: 600;
`;

export const EmptyDocuments = styled.div`
      text-align: center;
      padding: 24px 16px;
      color: #aaa;

      span {
            font-size: 32px;
            display: block;
            margin-bottom: 8px;
      }

      p {
            margin: 0;
            font-size: 13px;
      }
`;
