import styled from "styled-components";

export const DashboardStyles = styled.div`
	display: flex;
	flex-direction: column;
`;
export const Cards = styled.div`
	display: flex;
	flex-direction: row;
	margin-bottom: 50px;
	margin-top: 20px;

	@media screen and (max-width: 800px) {
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
	}
`;
export const Card = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	width: 270px;
	height: 88px;
	padding: 20px;
	margin-right: 40px;
	background: #ffffff;
	box-shadow: 0px 12px 26px rgba(16, 30, 115, 0.06);
	border-radius: 8px;
	.infoCard {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 80%;
	}

	.title {
		font-style: normal;
		font-weight: bold;
		font-size: 14px;
		margin: 7px 0px;
	}

	.value {
		font-weight: normal;
		font-size: 18px;
		color: #000000;
	}

	.Line {
		width: 30px;
		height: 4px;
		border-radius: 4px;
	}

	@media screen and (max-width: 800px) {
		margin: 0px 10px 30px 10px;
	}
`;
export const Relatory = styled.div`
	background-color: #ffffff;
	box-shadow: 0px 12px 26px rgba(16, 30, 115, 0.06);
	border-radius: 8px;
	padding: 40px 0px;

	width: 100%;

	.title {
		font-size: 20px;
		font-weight: 700;
		margin: 0px 24px;
	}
`;
