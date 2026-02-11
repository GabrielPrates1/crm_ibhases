import styled, { css } from "styled-components";
import { ReactComponent as ArrowSVG } from "../../../assets/icons/arrow.svg";
import { ReactComponent as EditIconSVG } from "../../../assets/icons/editIcon.svg";
import { ReactComponent as LixoIconSVG } from "../../../assets/icons/lixoIcon.svg";
import { ReactComponent as PlusSVG } from "../../../assets/icons/plus.svg";
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
export const Users = styled.div``;

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

export const Text = styled.text`
	font-size: 22px;
	color: #ffffff;
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
	background: linear-gradient(
		360deg,
		#00568c 1.33%,
		#0088b2 35.02%,
		#3dbb95 81.44%
	);
	color: #fff;
`;
export const Arrow = styled(ArrowSVG)<IArrowProps>`
	* {
		position: static !important ;
	}

	width: ${({ size }) => size || "20px"};
	transition: ease-in-out 300ms;
	cursor: pointer;
	transform: rotate(${({ direction }) => direction && setDirection(direction)});
	path {
		fill: ${({ color }) => color || "#000000"};
	}
`;

export const Table = styled.table`
	width: 100%;
	border-radius: 8px;
	background-color: #ffffff;
	border-collapse: collapse;
	margin-top: 30px;
	select {
		display: flex;
		background: transparent;
		outline: none;
		padding-left: 10px;
		border-radius: 5px;
		border: 1px solid #000000;
		color: #52575c;
		width: 100px;
		cursor: pointer;
	}
	.slct {
		width: 150px;
		height: 30px;
	}
	thead {
		background: #e8e8e880;
	}

	table,
	th,
	td {
		text-align: left;
		padding: 19px 25px;
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

		* {
			cursor: pointer;
		}
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
	.line {
		width: 40%;
		height: 2px;
		border-radius: 2px;
		background: #e2e4e5;
	}
	.input {
		border: none;

		width: 80%;
		outline: none;
	}
`;
export const TextFilter = styled.div`
	border: none;
`;

export const EditIcon = styled(EditIconSVG)`
	cursor: pointer;
	width: 18px;
`;

export const LixoIcon = styled(LixoIconSVG)`
	cursor: pointer;
	width: 18px;
	margin-left: 17px;
`;

export const Plus = styled(PlusSVG)`
	margin-right: 10px;
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
					background: ffffff;
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
