import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { ReactComponent as ArrowSVG } from "../../assets/icons/arrow.svg";

interface IBreadcrumbItem {
      label: string;
      path?: string;
}

interface INavigationHeaderProps {
      title: string;
      breadcrumbs?: IBreadcrumbItem[];
      showBackButton?: boolean;
      backPath?: string;
}

const Container = styled.div`
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 20px;
`;

const BreadcrumbRow = styled.div`
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
`;

const BreadcrumbItem = styled.span<{
      isClickable?: boolean;
      isActive?: boolean;
}>`
      font-size: 14px;
      color: ${({ isActive }) => (isActive ? "#333" : "#0088b2")};
      font-weight: ${({ isActive }) => (isActive ? "600" : "400")};
      cursor: ${({ isClickable }) => (isClickable ? "pointer" : "default")};
      transition: color 0.2s;

      &:hover {
            color: ${({ isClickable }) =>
                  isClickable ? "#00568c" : "inherit"};
            text-decoration: ${({ isClickable }) =>
                  isClickable ? "underline" : "none"};
      }
`;

const Separator = styled.span`
      color: #999;
      font-size: 12px;
`;

const HeaderRow = styled.div`
      display: flex;
      align-items: center;
      gap: 16px;
`;

const BackButton = styled.button`
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px 16px;
      background: linear-gradient(
            135deg,
            #00568c 0%,
            #0088b2 50%,
            #3dbb95 100%
      );
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;

      &:hover {
            opacity: 0.9;
            transform: translateX(-2px);
      }

      svg {
            width: 12px;
            height: 12px;
            transform: rotate(180deg);

            path {
                  fill: white;
            }
      }
`;

const Title = styled.h2`
      margin: 0;
      font-size: 24px;
      color: #333;
`;

const Arrow = styled(ArrowSVG)`
      width: 12px;
      height: 12px;
      transform: rotate(180deg);

      path {
            fill: white;
      }
`;

const NavigationHeader: React.FC<INavigationHeaderProps> = ({
      title,
      breadcrumbs = [],
      showBackButton = true,
      backPath,
}) => {
      const history = useHistory();

      const handleNavigate = (path?: string) => {
            if (path) {
                  history.push(path);
            }
      };

      const handleBack = () => {
            if (backPath) {
                  history.push(backPath);
            } else if (breadcrumbs.length > 1) {
                  // Navega para o penúltimo item do breadcrumb
                  const previousItem = breadcrumbs[breadcrumbs.length - 2];
                  if (previousItem.path) {
                        history.push(previousItem.path);
                  } else {
                        history.goBack();
                  }
            } else {
                  history.goBack();
            }
      };

      return (
            <Container>
                  {breadcrumbs.length > 0 && (
                        <BreadcrumbRow>
                              {breadcrumbs.map((item, index) => (
                                    <React.Fragment key={index}>
                                          <BreadcrumbItem
                                                isClickable={
                                                      !!item.path &&
                                                      index !==
                                                            breadcrumbs.length -
                                                                  1
                                                }
                                                isActive={
                                                      index ===
                                                      breadcrumbs.length - 1
                                                }
                                                onClick={() =>
                                                      item.path &&
                                                      index !==
                                                            breadcrumbs.length -
                                                                  1
                                                            ? handleNavigate(
                                                                    item.path,
                                                              )
                                                            : null
                                                }
                                          >
                                                {item.label}
                                          </BreadcrumbItem>
                                          {index < breadcrumbs.length - 1 && (
                                                <Separator>›</Separator>
                                          )}
                                    </React.Fragment>
                              ))}
                        </BreadcrumbRow>
                  )}
                  <HeaderRow>
                        {showBackButton && (
                              <BackButton onClick={handleBack}>
                                    <Arrow />
                                    Voltar
                              </BackButton>
                        )}
                        <Title>{title}</Title>
                  </HeaderRow>
            </Container>
      );
};

export default NavigationHeader;
