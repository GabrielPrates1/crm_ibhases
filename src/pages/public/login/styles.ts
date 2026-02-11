import styled from "styled-components";

export const HomeStyles = styled.div`
	background-color: #f6f8fb;

	.container {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		margin: auto;
	}

	.image {
		width: 200px;
		height: auto;

		margin-top: 8%;
	}

	.formContainer {
		display: flex;
	}

	.inputsContainer {
		margin-top: 50px;

		display: flex;
		flex-direction: column;
		align-items: left;
	}

	.input {
		padding: 18px 6px 18px 6px;
		min-width: 20vw;

		background: transparent;

		border: solid 1.9px #3dbb95;
		border-radius: 8px;
		outline: none;

		text-align: center;
		margin-bottom: 20px;
		::placeholder {
			color: #000000;
		}
	}

	.checkboxContainer {
		margin-bottom: 40px;

		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.checkbox-round {
		width: 1.3em;
		height: 1.3em;
		background-color: white;
		border-radius: 50%;
		vertical-align: middle;
		border: 1px solid #0088b2;
		appearance: none;
		-webkit-appearance: none;
		outline: none;
		cursor: pointer;
	}
	.checkbox-round:checked {
		background-color: #0088b2;
	}
	.checkboxTitulo {
		margin-left: 10px;
		cursor: pointer;
	}

	a {
		color: #fff;
	}
`;
