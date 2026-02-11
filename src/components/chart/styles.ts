import styled from "styled-components";

export const ChartStyles = styled.div`
	* {
		position: static !important ;
	}

	.tooltip {
		background-image: linear-gradient(180deg, #00568c 30%, #0088b2 60%, #3dbb95 10%);
		color: black;
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		font-size: 12px;
		line-height: 16px;
		letter-spacing: 0.1px;

		background-color: #fff;
		border-radius: 4px;

		width: 32px;
		height: 32px;

		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;

		box-shadow: 0px 0px 8px rgba(16, 30, 115, 0.12);
	}
`;
