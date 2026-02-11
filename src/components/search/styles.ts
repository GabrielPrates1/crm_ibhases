import styled from "styled-components";

export const SearchStyles = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;

	background-color: #ffffff;
	width: 350px;
	height: 40px;
	border-radius: 40px;
	margin: 20px 0px;

	box-shadow: 0px 12px 26px rgba(16, 30, 115, 0.06);
	padding: 8px 10px;

	input {
		border: none;
		outline: none;
		width: 350px;
		font-size: 16px;
		padding-left: 10px;
	}
`;
