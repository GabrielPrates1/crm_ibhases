import styled from "styled-components";
interface IModal {
  state: boolean;
}
export const Modal = styled.div<IModal>`
  position: absolute;
  display: ${({ state }) => (state ? "flex" : "none")};
  align-items: center;
  justify-content: center;

  background: #00000080;
  height: 100%;
  width: 100%;
`;
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 13px;
  box-shadow: 2px 1px 1px gray;
  background: white;
  padding: 20px;

  width: 60%;

  .btn {
    display: flex;
    justify-content: center;
    align-items: center;

    margin-top: 50px;

    button {
      width: 300px;
    }
  }

  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 25px;
  }
`;
export const CalendarStyles = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  min-height: 43vh;

  border-radius: 13px;
  background: white;

  .input {
    border: none;
    outline: none;
  }
  .ttl_2 {
    margin-top: 50px;
    font-family: Poppins;
    font-style: normal;
    font-size: 20px;
    width: 95%;
    color: #272831;
  }
  .divStatus {
    display: flex;
    width: 90%;
    justify-content: space-around;
  }
  .line {
    width: 70%;
    height: 2px;
    border-radius: 2px;
    background: #e2e4e5;
  }
  .modalCalendar {
    margin-right: 0px;
    margin-top: 60px;
  }

  .checked {
    margin-right: 10px;
  }

  .leftText {
    font-size: 18px;
    cursor: pointer;
  }
  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
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

    margin-right: 5px;
  }
  .checkbox-round:checked {
    background-color: #0088b2;
  }
`;
