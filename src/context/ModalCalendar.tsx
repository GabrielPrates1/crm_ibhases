/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import useAuth from "../hooks/auth";
import IModalCalendar from "../interfaces/IModalCalendar";
import IPatient from "../interfaces/IPatient";
import { warning, info } from "../components/alert";

import API from "../services/api";

const ModalCalendarContext = React.createContext({} as IModalCalendar);

export const ModalCalendarProvider = ({ children }: { children: any }) => {
  const { userData } = useAuth();
  const [state, setState] = React.useState<boolean>(false);
  const [responseAPI, setResponseAPI] = React.useState<IPatient[]>();

  const updateStateTrue = React.useCallback(() => {
    setState(true);
  }, []);

  const updateStateFalse = React.useCallback(() => {
    setState(false);
  }, []);

  const callAPI = async (requestData: any) => {
    Object.keys(requestData).forEach((k) => {
      if (requestData[k] === "" || undefined || null) {
        delete requestData[k];
      }
    });

    if (Object.keys(requestData).length !== 0) {
      const { data }: { data: { message: string; patients: IPatient[] } } =
        await API.get("/filter/patient/calendar", {
          headers: { Authorization: userData!.token },
          params: requestData,
        });

      if (data.patients === null || data.patients.length < 1) {
        return warning(
          "Paciente não encontrado, tente alterar os parametros de busca."
        );
      }

      setResponseAPI(data.patients);
      setState(false);
    } else {
      return info("Selecione algum parâmetro para consulta.");
    }
  };

  return (
    <ModalCalendarContext.Provider
      value={{ state, updateStateTrue, updateStateFalse, callAPI, responseAPI }}
    >
      {children}
    </ModalCalendarContext.Provider>
  );
};

export const useModalCalendarContext = () => {
  return React.useContext(ModalCalendarContext);
};
