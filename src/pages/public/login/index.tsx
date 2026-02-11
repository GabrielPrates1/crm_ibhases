import React from "react";
/*Important Imports.*/
import { HomeStyles } from "./styles";
import { Button } from "../../../styles/utils/button";

/*Matters not so important.*/
import { ReactComponent as LogoIbhases } from "../../../assets/logo.svg";
import useAuth from "../../../hooks/auth";

/*Login page component creation.*/
const Home: React.FC = () => {
  const { logIn } = useAuth();

  const [email, setEmail] = React.useState<string | undefined>(undefined);
  const [password, setPassword] = React.useState<string | undefined>(undefined);
  const [instance, setSaveInstance] = React.useState<boolean>(false);

  return (
    <HomeStyles>
      <div className="container">
        <LogoIbhases className="image" />
        <div className="formContainer">
          <div className="inputsContainer">
            <input
              className="input"
              name="e-mail"
              type="e-mail"
              autoComplete="on"
              placeholder="Digite o seu E-mail"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="input"
              name="password"
              type="password"
              autoComplete="on"
              placeholder="Digite a sua senha"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="checkboxContainer">
              <input
                type="checkbox"
                className="checkbox-round"
                onChange={(e) => setSaveInstance(e.target.checked)}
              />
              <label htmlFor="checkbox" className="checkboxTitulo">
                Lembrar conta
              </label>
            </div>
            <Button
              onClick={(e) =>
                logIn({
                  email: email!,
                  password: password!,
                  saveInstance: instance,
                })
              }
            >
              Entrar
            </Button>
          </div>
        </div>
      </div>
    </HomeStyles>
  );
};

export default Home;
