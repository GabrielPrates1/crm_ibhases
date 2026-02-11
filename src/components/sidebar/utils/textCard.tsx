import React from "react";
import { ContainerTextCard } from "../styles";
import { useHistory } from "react-router-dom";

interface ITextCard {
      link?: string;
      text: string;
      Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
      color?: string;
      onClick?: any;
}

export const TextCard = ({ Icon, text, link, color, onClick }: ITextCard) => {
      const history = useHistory();

      const navigate = () => {
            return link && history.push(link);
      };

      return (
            <ContainerTextCard
                  onClick={() =>
                        onClick ? onClick() && navigate() : navigate()
                  }
                  customColor={color}
            >
                  <Icon width={24} />
                  <span>{text}</span>
            </ContainerTextCard>
      );
};
