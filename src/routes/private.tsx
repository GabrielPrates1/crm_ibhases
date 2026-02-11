import React from "react";
import { Switch, Route } from "react-router-dom";
// import Dashboard from "../private/pages/dashboard";
// import NewPatient from "../private/pages/newPatient";
// import Reports from "../private/pages/reports";
// import PatientEvolution from "../private/pages/private/patientEvolution";
import Dashboard from "../pages/private/dashboard";
import Managers from "../pages/private/managers";
import PatientCreate from "../pages/private/patientCreate";
import PatientEdit from "../pages/private/patientEdit";
import PatientRelatory from "../pages/private/patientRelatory";
import PatientEvolution from "../pages/private/patientEvolution";
import EvolutionRelatory from "../pages/private/evolutionRelatory";
import EvolutionRelatoryShow from "../pages/private/evolutionRelatoryShow";

import Sidebar from "../components/sidebar";
import ModalCalendar from "../components/calendar";
import useWindowDimensions from "../hooks/dimensions";
import { ModalCalendarProvider } from "../context/ModalCalendar";
import { ContainerPrivate, ContainerBody } from "../styles/global";

const Private = (): JSX.Element => {
      const { width } = useWindowDimensions();

      return (
            <ModalCalendarProvider>
                  <ContainerPrivate>
                        <div style={{ position: "relative" }}>
                              <Sidebar />
                        </div>
                        <ContainerBody>
                              {/* <Hamburger /> */}

                              {width < 1300 && (
                                    <div>
                                          <div
                                                style={{
                                                      position: "fixed",
                                                      display: "flex",
                                                      alignItems: "center",
                                                      justifyContent:
                                                            "space-around",
                                                      background: "#272727",
                                                      width: "100%",
                                                      paddingTop: 20,
                                                      paddingBottom: 20,
                                                      marginBottom: 20,
                                                }}
                                          >
                                                <Sidebar mobile={true} />
                                                <h1
                                                      style={{
                                                            color: "white",
                                                            display: "flex",
                                                            alignItems:
                                                                  "center",
                                                            justifyContent:
                                                                  "center",
                                                      }}
                                                >
                                                      Ibhases
                                                </h1>
                                          </div>
                                          <div
                                                style={{
                                                      height: 130,
                                                      width: "100%",
                                                }}
                                          />
                                    </div>
                              )}

                              {/* @ts-ignore */}
                              <Switch>
                                    {/* @ts-ignore */}
                                    <Route
                                          component={Dashboard}
                                          path="/"
                                          exact
                                    />
                                    {/* @ts-ignore */}
                                    <Route
                                          component={PatientCreate}
                                          path="/patient/create"
                                          exact
                                    />
                                    {/* @ts-ignore */}
                                    <Route
                                          component={PatientRelatory}
                                          path="/patient/relatory"
                                          exact
                                    />
                                    {/* @ts-ignore */}
                                    <Route
                                          component={PatientEdit}
                                          path="/patient/edit/:id"
                                          exact
                                    />
                                    {/* @ts-ignore */}
                                    <Route
                                          component={PatientEvolution}
                                          path="/patient/evolution/create"
                                          exact
                                    />

                                    {/* @ts-ignore */}
                                    <Route
                                          component={EvolutionRelatory}
                                          path="/evolution/relatory/:id"
                                          exact
                                    />
                                    {/* @ts-ignore */}
                                    <Route
                                          component={EvolutionRelatoryShow}
                                          path="/evolution/relatory/show/:id"
                                          exact
                                    />
                                    {/* @ts-ignore */}
                                    <Route
                                          component={Managers}
                                          path="/managers"
                                          exact
                                    />
                              </Switch>
                        </ContainerBody>
                        {/* Modals */}
                        <ModalCalendar />
                  </ContainerPrivate>
            </ModalCalendarProvider>
      );
};

export default Private;
