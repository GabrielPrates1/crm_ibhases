import styled, { keyframes } from "styled-components";

interface IActive {
	active: boolean;
}

interface ITextCardProps {
	customColor?: string;
}

const animation = {
	open() {
		return keyframes`
			from {
				position:absolute;
				left: -120%;
			}
  			to {

				position:absolute;
				left: 0px;
			  }
		`;
	},
	close() {
		return keyframes`
			from {
				position:absolute;
				left: 0px;
			}
  			to {

				position:absolute;
				left: -120%;
			  }
		`;
	},
};

export const Container = styled.div`
	position: fixed;
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	padding: 20px;
	background-color: #ffff;
	box-shadow: 0px 12px 30px rgba(16, 30, 115, 0.06);

	height: 100vh;

	.ibhasesLogo {
		object-fit: cover;
		width: 150px;
		margin: 20px;
	}

	@media (max-width: 1550px) {
		width: 20%;
		background-color: #ffff;
	}

	@media (max-width: 1300px) {
		display: none;
		background-color: #ffff;
	}
`;

export const ContainerMobile = styled.div<IActive>`
	position: fixed;
	display: flex;
	flex-direction: column;
	top: 120px;
	left: 0px;
	height: 100vh;
	width: 30%;

	background: #fff;

	overflow: scroll;
	z-index: 999;
	animation: ${({ active }) => (active ? animation.open : animation.close)} 1s ease-in-out forwards;

	@media (max-width: 550px) {
		width: 40%;
	}
`;

export const ContainerTextCard = styled.div<ITextCardProps>`
	display: flex;
	align-items: center;
	color: ${({ customColor }) => (customColor ? customColor : "#52575c")};
	cursor: pointer;

	margin: 40px 20px;

	svg path {
		fill: ${({ customColor }) => (customColor ? customColor : "#52575c")};
	}

	span {
		font-size: 18px;
		font-weight: 700;
		margin-left: 16px;
		white-space: nowrap;
	}

	@media (max-width: 700px) {
		margin: 15px 10px;
	}
`;

export const Hamburger = styled.div<IActive>`
	position: relative;
	display: none;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 40px;
	width: 40px;
	cursor: pointer;

	span {
		position: relative;
		height: 2px;
		width: 100%;
		content: "";
		border-radius: 2px;
		background: white;
		transition: 500ms ease-in-out;
		transform: rotate(${({ active }) => (active ? "45deg" : "0deg")});
	}
	span:before,
	span:after {
		position: absolute;
		height: 2px;
		width: 100%;
		content: "";
		border-radius: 2px;
		background: white;
		transition: 500ms ease-in-out;
	}

	span:before {
		top: ${({ active }) => (active ? "0px" : "10px")};
		transform: rotate(${({ active }) => (active ? "90deg" : "0deg")});
	}
	span:after {
		top: ${({ active }) => (active ? "0px" : "-10px")};
		transform: rotate(${({ active }) => (active ? "90deg" : "0deg")});
	}

	@media (max-width: 1300px) {
		display: flex;
	}
`;
