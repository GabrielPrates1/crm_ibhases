import styled from "styled-components";

export const Select = styled.select`
	-webkit-appearance: none;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	margin: 21px;
	padding: 16px 16px;
	width: 265px;
	height: 50px;
	color: #000000;
	background: transparent;
	border: 1.5px solid ;
	outline: none;
	border-radius: 5px;
	option {
		background: #ffffff;    
		:first-child {
			color: #52575c;
		}
	}
`;
