import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
	* {
		margin: 0px;
		padding: 0px;
		box-sizing: border-box;
	}

	body {
		font-family: 'comfortaa', sans-serif;
		color: black;
		background-color: #F6F8FB;
	}

	a{
		text-decoration: none;
		color: inherit;
	}
`;

export const ContainerPrivate = styled.div`
  display: grid;
  grid-template-columns: 25% 75%;
  grid-template-rows: auto;

  @media (max-width: 1550px) {
    display: grid;
    grid-template-columns: 20vw 80vw;
    grid-template-rows: auto;
  }

  @media screen and (max-width: 1300px) {
    display: flex;
    flex-direction: column;
  }
`;

export const ContainerBody = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 20px 30px;

  @media screen and (max-width: 1300px) {
    margin: 0px;
    height: 100%;
    width: 100%;
  }
`;
