/*Importes de coisas importantes como lib e arquivos principais.*/
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { GlobalStyles } from "./styles/global";

import { Private, Public } from "./routes";
import useAuth from "./hooks/auth";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import Modal from "react-modal";

Modal.setAppElement("#root");

/*Criação do componente principal da aplicação.*/
const App: React.FC = () => {
      const { auth } = useAuth();

      return (
            <>
                  {/* @ts-ignore */}
                  <BrowserRouter>
                        {/* @ts-ignore */}
                        <GlobalStyles />
                        {auth ? <Private /> : <Public />}
                        <ToastContainer
                              position="top-center"
                              autoClose={5000}
                              hideProgressBar={false}
                              newestOnTop={false}
                              closeOnClick
                              rtl={false}
                              pauseOnFocusLoss
                              draggable
                              pauseOnHover
                              theme="colored"
                        />
                  </BrowserRouter>
            </>
      );
};

export default App;
