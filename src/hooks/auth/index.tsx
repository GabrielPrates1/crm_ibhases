/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useState, useContext, createContext } from "react";
import API from "../../services/api";

import { sucess, error, warning, info } from "../../components/alert";

interface ISignIn {
      email?: string;
      password?: string;
      saveInstance: boolean;
}
interface IUserData {
      email?: string;
      token: string;
      user_rank: string;
}

interface AuthContext {
      auth: boolean;
      logIn: ({
            email,
            password,
            saveInstance,
      }: ISignIn) => Promise<void | null>;
      logOut: () => void;
      middlewareAuthInstance: () => Promise<null | undefined>;
      userData?: IUserData | null;
}

const Auth = createContext({} as AuthContext);

export const AuthProvider: React.FC = ({ children }) => {
      const [auth, setAuth] = useState<boolean>(false);
      const [userData, setUserData] = useState<IUserData | null>();

      const logIn = async ({ email, password, saveInstance }: ISignIn) => {
            info("Aguarde um momento... 📋");
            if (!(email || password)) {
                  if (!email && !password)
                        return warning("Por favor, preencha os campos 📋");
                  if (!email) warning("Por favor, preencha o campo do email📧");
                  return warning("Por favor, preencha a senha🔑");
            }

            const request = await API.post("auth/signin", {
                  email: email,
                  password: password,
            }).catch(() => {
                  return error(
                        "Ops... Email ou Senha invalidos, tente novamente.",
                  );
            });

            if (!request) return null;

            if (saveInstance) {
                  const validaAt = new Date();
                  validaAt.setHours(validaAt.getHours() + 24);

                  localStorage.setItem(
                        "@ibhassessaveinstance",
                        JSON.stringify({
                              token: request.data.token,
                              user_rank: request.data.user_rank,
                              validAt: validaAt,
                        }),
                  );
            }

            setUserData({
                  email: email!,
                  token: `bearer ${request.data.token}`,
                  user_rank: request.data.user_rank,
            });
            setAuth(true);
      };

      const logOut = async () => {
            localStorage.removeItem("@ibhassessaveinstance");
            setUserData(null);
            setAuth(false);

            await API.post(
                  "auth/logout",
                  {},
                  {
                        headers: {
                              Authorization: userData!.token,
                        },
                  },
            );
      };

      const middlewareAuthInstance = async () => {
            const instanceSave = localStorage.getItem("@ibhassessaveinstance");
            if (instanceSave === null) return null;

            const getObjectFromInstaceLocalStorage = JSON.parse(instanceSave);

            if (
                  new Date() >
                  new Date(getObjectFromInstaceLocalStorage.validAt)
            ) {
                  await logOut();
                  return;
            }

            setUserData({
                  token: `bearer ${getObjectFromInstaceLocalStorage.token}`,
                  user_rank: getObjectFromInstaceLocalStorage.user_rank,
            });

            setAuth(true);
      };

      return (
            <Auth.Provider
                  value={{
                        auth,
                        logIn,
                        logOut,
                        middlewareAuthInstance,
                        userData,
                  }}
            >
                  {children}
            </Auth.Provider>
      );
};

const useAuth = () => {
      return useContext(Auth);
};

export default useAuth;
