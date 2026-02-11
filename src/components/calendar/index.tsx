/*Important Imports.*/
import React from "react";
import Calendar from "react-calendar";
import { CalendarStyles, Modal, Container } from "./styles";
import "react-calendar/dist/Calendar.css";
import { useModalCalendarContext } from "../../context/ModalCalendar";
import { ReactComponent as Close } from "../../assets/icons/close.svg";
import { Button } from "../../styles/utils/button";
import ISearch from "../../interfaces/ISearch";
import { sucess, error, warning, info } from "../alert";

function ModalCalendar(): JSX.Element {
  const { state, updateStateFalse, callAPI } = useModalCalendarContext();
  const [searchData, setSearchData] = React.useState<ISearch>({});

  return (
    <Modal state={state}>
      <Container>
        {/*Icon Close */}
        <Close
          onClick={updateStateFalse}
          style={{
            cursor: "pointer",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
          }}
        />
        {/* Title */}
        <div className="title">
          <span> Filtrar Paciente</span>
        </div>
        <CalendarStyles>
          {/*Form */}
          <form>
            {/* Inputs */}
            <div className="ttl_2">
              <span> Qual é o nome do interno?</span>
              <div>
                <input
                  className="input"
                  placeholder="Insira o Nome do Interno"
                  value={searchData.name}
                  onChange={(e) =>
                    setSearchData({ ...searchData, name: e.target.value })
                  }
                />
                <div className="line" />
              </div>
            </div>
            <div className="ttl_2">
              <span> Qual é o nome do Usuário Responsável?</span>
              <div>
                <input
                  className="input"
                  placeholder="Insira o Nome do Usúario Responsável"
                  value={searchData.manager}
                  onChange={(e) =>
                    setSearchData({ ...searchData, manager: e.target.value })
                  }
                />
                <div className="line" />
              </div>
            </div>
            <div className="ttl_2">
              <span> Qual é o Status?</span>
              <fieldset
                onChange={(e: any) =>
                  setSearchData({ ...searchData, status: e.target.value! })
                }
                style={{ border: "none" }}
              >
                <div className="divStatus">
                  <input type="radio" id="ativo" name="status" value="ativo" />
                  <label htmlFor="ativo">Ativo</label>
                  <input
                    type="radio"
                    id="transferido"
                    name="status"
                    value="transferido"
                  />
                  <label htmlFor="transferido">Transferido</label>
                  <input
                    type="radio"
                    id="finalizado"
                    name="status"
                    value="finalizado"
                  />
                  <label htmlFor="finalizado">Finalizado</label>
                </div>
              </fieldset>
            </div>
          </form>
          <div className="modalCalendar">
            <span> Data de Criação</span>
            <Calendar
              onChange={(e: any) =>
                setSearchData({
                  ...searchData,
                  date: e.toISOString().slice(0, 10),
                })
              }
              minDate={new Date(2009, 12, 21)}
            />
          </div>
        </CalendarStyles>
        <div className="btn">
          <Button
            onClick={() => {
              callAPI(searchData);
            }}
          >
            Filtrar
          </Button>
        </div>
      </Container>
    </Modal>
  );
}

export default ModalCalendar;
