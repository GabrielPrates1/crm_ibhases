import styled from "styled-components";

export const Input = styled.input`
  -webkit-appearance: none;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin: 21px;
  padding: 6px 8px;
  width: 265px;
  height: 50px;
  color: #000000;
  background: transparent;
  outline: none;
  border-radius: 5px;
  border: 1px solid #000000;
  ::placeholder {
    color: #52575c;
  }
`;
