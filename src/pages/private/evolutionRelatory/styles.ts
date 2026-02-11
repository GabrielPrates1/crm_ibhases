import styled, { css } from "styled-components";
import { ReactComponent as EditIconSVG } from "../../../assets/icons/editIcon.svg";
import { ReactComponent as LixoIconSVG } from "../../../assets/icons/lixoIcon.svg";
import { ReactComponent as CalendarIconSVG } from "../../../assets/icons/calendar.svg";
import { ReactComponent as ArrowSVG } from "../../../assets/icons/arrow.svg";
import { ReactComponent as EyeIconSVG } from "../../../assets/eye.svg";
interface IArrowProps {
  color?: string;
  size?: string;
  direction?: "up" | "down" | "left" | "right" | string;
}

interface IPropsIndex {
  disable?: boolean;
  backgroundState: "gradient" | "transparent";
}

const setDirection = (direction: string) => {
  switch (direction) {
    case "up": {
      return "-90deg";
    }
    case "down": {
      return "90deg";
    }
    case "left": {
      return "-180deg";
    }
    case "right": {
      return "0deg";
    }
    default: {
      return "0deg";
    }
  }
};

export const ReportStyles = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

export const Select = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 270px;
  height: 47px;
  padding: 2px;
  border-radius: 22px;
  cursor: pointer;

  background-image: linear-gradient(white, white),
    radial-gradient(circle at top left, #00568c, #0088b2, #3dbb95);
  background-origin: border-box;
  background-clip: content-box, border-box;

  select {
    -webkit-appearance: none !important;
    -webkit-border-radius: 0px;
    background-color: #fafafa;
    background-position: 100% center;
    background-repeat: no-repeat;
    border: 1px solid #cccccc;
    padding: 0.5rem;
    font-size: 0.875rem;
    color: rgba(0, 0, 0, 0.75);
    line-height: normal;
    border-radius: 0;
    height: 2.3125rem;
    text-align: center;
    width: 100%;
    border: none;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    font-size: 16px;
  }
  .input {
    color: #0088b2;
  }

  .seta {
    transform: translateX(-50px) rotate(90deg);
  }
`;

export const Table = styled.table`
  width: 100%;
  border-radius: 8px;
  background-color: #ffffff;
  border-collapse: collapse;
  margin-top: 30px;

  thead {
    background: #e8e8e880;
  }

  table,
  th,
  td {
    text-align: left;
    padding: 18px 25px;
  }

  td {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    color: #52575c;
  }

  tr {
    border-bottom: 1px #e8e8e8 solid;
  }

  .IconTable {
    display: flex;
    align-items: center;
  }

  .buttonModal {
    background: transparent;
    border: none;
    cursor: pointer;

    width: auto;
    height: auto;

    display: flex;
    align-items: center;
  }

  @media screen and (max-width: 800px) {
    thead {
      width: 300px;
    }

    table,
    th,
    td {
      width: 300px;
    }
    tr {
      width: 500px;
    }
  }
  @media screen and (max-width: 600px) {
    thead {
      width: 300px;
    }

    table,
    th,
    td {
      width: 300px;
    }
    tr {
      width: 300px;
    }
  }
`;

export const TextFilter = styled.text`
  border: none;
  font-weight: bold;
`;

export const CalendarIcon = styled(CalendarIconSVG)`
  margin-right: 20px;
`;

export const EditIcon = styled(EditIconSVG)`
  cursor: pointer;
  width: 18px;
`;
export const EyeIcon = styled(EyeIconSVG)`
  cursor: pointer;
  width: 27px;
  margin-right: 17px;
`;
export const LixoIcon = styled(LixoIconSVG)`
  cursor: pointer;
  width: 18px;
  margin-left: 17px;
`;

export const Indexao = styled.div`
  width: 100%;
  height: auto;

  margin: 20px 0px;

  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const IndexaoCard = styled.div<IPropsIndex>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 38px;
  height: 38px;

  margin: 0px 5px;

  ${({ backgroundState }) => {
    return backgroundState === "gradient"
      ? css`
          background: linear-gradient(
            360deg,
            #00568c 1.33%,
            #0088b2 35.02%,
            #3dbb95 81.44%
          );
          color: #fff;
        `
      : css`
          background: transparent;
          color: #000;
          border: 1.78384px solid #e8e8e8;
        `;
  }}
  ${({ disable }) => {
    return (
      disable &&
      css`
        opacity: 0.6;
      `
    );
  }}

	border-radius: 7px;

  font-size: 17px;
  cursor: pointer;
`;

export const Arrow = styled(ArrowSVG)<IArrowProps>`
  width: ${({ size }) => size || "15px"};
  transition: ease-in-out 300ms;

  cursor: pointer;

  transform: rotate(${({ direction }) => direction && setDirection(direction)});

  path {
    fill: ${({ color }) => color || "#0088B2"};
  }
`;
