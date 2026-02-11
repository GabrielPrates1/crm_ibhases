/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import useAuth from "../hooks/auth";
import Login from "../pages/public/login";

const Public = (): JSX.Element => {
      const { middlewareAuthInstance } = useAuth();

      React.useEffect(() => {
            middlewareAuthInstance();
      }, []);

      return (
            // @ts-ignore
            <Switch>
                  {/* @ts-ignore */}
                  <Route component={Login} path="/" exact />
                  {/* @ts-ignore */}
                  <Redirect to="/" exact />
            </Switch>
      );
};

export default Public;
