import styled from "styled-components";

export const PatientEvolu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .input {
    display: flex;
    background: transparent;
    outline: none;
    margin-top: 20px;
    padding-left: 20px;
    border-radius: 5px;
    border: 1px solid #000000;
  }
  .half-input {
    width: 249px;
    height: 50px;
    padding-left: 20px;
    margin-left: 20px;
    margin-right: 20px;
  }
  .row-column {
    display: flex;
    justify-content: flex-start;
    margin: 0px;
  }
  #select {
    display: flex;
    background: transparent;
    outline: none;
    margin-top: 20px;
    padding-left: 20px;
    border-radius: 5px;
    border: 1px solid #000000;
    color: #52575c;
  }

  .inputDesc {
    width: 540px;
    height: 220px;
    resize: vertical;
  }

  .check-button {
    margin-top: 20px;
    padding: 10px;
  }
`;
export const Patient = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  #input {
    display: flex;
    background: transparent;
    outline: none;
    margin-top: 20px;
    padding-left: 20px;
    border-radius: 5px;
    border: 1px solid #000000;
  }
  .grid {
    display: grid;
    grid-template-columns: 70% 30%;
    grid-template-rows: auto;
  }
  .inputName {
    width: 540px;
    height: 49px;
  }

  @media screen and (max-width: 800px) {
    #input {
      display: flex;
      flex-direction: column;
      width: 500px;
    }
    .first-input {
      width: 500px;
    }
    .row-column {
      display: flex;
      flex-direction: column;
      width: 500px;
    }
    .half-input {
      margin: 0px;
    }
    #select {
      width: 500px;
    }
    .grid {
      display: grid;
      grid-template-columns: 100%;
      grid-template-rows: auto;
    }
  }

  @media screen and (max-width: 600px) {
    #input {
      display: flex;
      flex-direction: column;
      width: 300px;
    }
    .first-input {
      width: 300px;
    }
    .row-column {
      display: flex;
      flex-direction: column;
      width: 300px;
    }
    .half-input {
      margin: 0px;
    }
    #select {
      width: 300px;
    }
  }
`;
export const ProfileText = styled.span`
  display: flex;
  margin-top: 10px;
  padding: 10px;
  margin-left: 17px;
  font-weight: bold;
`;
export const ProfilePhoto = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 30px;
  align-items: center;

  .imgProfile {
    width: 200px;
    height: 200px;
    border-radius: 100px;
    object-fit: cover;

    margin-bottom: 20px;
  }

  .docBox {
    display: flex;
    flex-direction: column;

    height: 400px;
    width: 200px;
    border: 1px solid black;
    border-radius: 5px;
  }

  .line {
    width: 100%;
    height: 1px;
    border-radius: 2px;
    background: black;
  }

  .docText {
    padding: 10px 0px;
  }

  .subBox {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 50px;
  }

  .FragmentsPDF {
    overflow: auto;
    ::-webkit-scrollbar {
      width: 6px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 2px;
      background-color: lightgray;
    }

    .fragmentPDF {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 7px;
      margin: 5px 0px;

      span {
        cursor: pointer;

        margin-left: 10px;

        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-thumb {
          border-radius: 2px;
          background-color: lightgray;
        }
      }
    }
  }

  @media screen and (max-width: 800px) {
    grid-row-start: 1;
  }
`;
export const Box = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 10px solid;
  border-image-slice: 1;
  border-width: 2px;
  border-image-source: linear-gradient(
    270deg,
    #00568c 2.68%,
    #0088b2 35.48%,
    #3dbb95 80.65%
  );
  height: 63px;
  width: 211px;
  padding: 10px;
  margin-top: 40px;
  cursor: pointer;
  input[type="file"] {
    display: none;
  }
`;
