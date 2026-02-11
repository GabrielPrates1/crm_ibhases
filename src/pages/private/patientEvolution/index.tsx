/* eslint-disable react-hooks/exhaustive-deps */
/*Import important.*/
import React, { useEffect, useState, useMemo } from "react";
import FormData from "form-data";
import { filter as lodashFilter } from "lodash";
/*Relative imports like components and style.*/
import { PatientEvolu, Patient, ProfilePhoto, Box } from "./styles";
import { Button } from "../../../styles/utils/button";
/*Image Imports*/
import API from "../../../services/api";
import useAuth from "../../../hooks/auth";

import PDFIcon from "../../../assets/pdf.svg";

import IPatient from "../../../interfaces/IPatient";
import IAttachments from "../../../interfaces/IAttachments";
import IPatientEvolution from "../../../interfaces/IPatientEvolution";
import Search from "../../../components/search";
import { sucess, error, warning } from "../../../components/alert";
/*Creation of the PatientEvolution page component.*/

interface IUpload {
      target: HTMLInputElement;
}

const PatientEvolution: React.FC = () => {
      const [loading, setLoading] = useState<boolean>(true);
      const [search, setSearch] = useState<string>("");
      const [patient, setPatient] = useState<IPatient>({});
      const [allPatients, setAllPatients] = useState<IPatient[]>([]);
      const [attachments, setAttachments] = useState<IAttachments[] | []>([]);
      const [patientEvolution, setPatientEvolution] =
            useState<IPatientEvolution>({});
      const { userData } = useAuth();

      const resetPatient = {
            description: "",
            progressType: "",
            status: patient.status || "",
      };

      var foto = patient!.profile_photo;
      if (!foto) {
            foto =
                  "https://i.postimg.cc/7ZyxCwf4/User-Profile-PNG-High-Quality-Image.png";
      }

      // Fetch all patients once on mount
      const getAllPatients = async () => {
            try {
                  const response = await API.get("patient/get/all", {
                        headers: {
                              Authorization: userData!.token,
                        },
                  });

                  setAllPatients(response.data.patients || []);
            } catch (err) {
                  console.warn("Failed to load patients list");
                  setAllPatients([]);
            }
      };

      // Real-time local filter with lodash - case insensitive search
      const filteredPatients = useMemo(() => {
            if (!search || search.length < 2) return [];
            const formattedQuery = search.toLowerCase().trim();

            return lodashFilter(allPatients, (patient) => {
                  return (
                        patient.name?.toLowerCase().includes(formattedQuery) ||
                        patient.cpf?.includes(search) ||
                        patient.rg?.includes(search) ||
                        patient.mother_name
                              ?.toLowerCase()
                              .includes(formattedQuery)
                  );
            });
      }, [search, allPatients]);

      // Load all patients on component mount
      useEffect(() => {
            getAllPatients();
      }, []);

      const getUser = async (id: string) => {
            try {
                  const {
                        data: { patient: $patient },
                  }: {
                        data: {
                              patient: IPatient;
                        };
                  } = await API.get("patient/get/id", {
                        headers: {
                              Authorization: userData!.token,
                        },
                        params: {
                              id: id,
                        },
                  });
                  setPatient($patient);
                  setPatientEvolution({ status: $patient.status });
                  setLoading(false);
            } catch (err) {
                  error(
                        "Ocorreu um problema ao buscar informações do Usuário, tente novamente.",
                  );
            }
      };

      const GetAttachments = async () => {
            if (!patient) return null;
            try {
                  const {
                        data: { attachments },
                  }: { data: { attachments: IAttachments[] } } = await API.get(
                        "patient/get/attachments",
                        {
                              headers: {
                                    Authorization: userData!.token,
                              },
                              params: {
                                    id: patient!.id,
                              },
                        },
                  );

                  return setAttachments(attachments);
            } catch (err) {
                  // S3 not configured in development - fallback to empty attachments
                  console.warn(
                        "Attachments service unavailable, continuing without attachments",
                  );
                  setAttachments([]);
                  return null;
            }
      };

      const DownloadPDF = async (k: number) => {
            try {
                  const {
                        data: { url },
                  }: { data: { url: string } } = await API.get(
                        "patient/get/attachment",
                        {
                              headers: {
                                    Authorization: userData!.token,
                              },
                              params: {
                                    id: attachments[k].id,
                              },
                        },
                  );

                  return window.open(url, "_blank")?.focus();
            } catch (err) {
                  console.warn(
                        "Failed to download attachment - S3 service unavailable",
                  );
                  warning(
                        "Não foi possível baixar o arquivo. Serviço de armazenamento indisponível.",
                  );
                  return null;
            }
      };

      const createEvolution = async () => {
            console.log("alo " + JSON.stringify(patientEvolution));

            const data = new FormData();

            if (!patientEvolution || !patient) return null;

            if (!patientEvolution.progressType) {
                  return warning("Por favor, selecione o 'Tipo de Evolução' ");
            }

            Object.keys(patientEvolution).forEach((n, k) => {
                  if (patientEvolution[n]) {
                        data.append(n, patientEvolution[n]);
                  }
            });

            API.post("patient/evolution/create", data, {
                  headers: {
                        Authorization: userData!.token,
                  },
                  params: {
                        id: patient.id,
                        name: patient.name,
                  },
            })
                  .then((r) => {
                        setPatientEvolution(resetPatient);
                        sucess("Evolução Criada com Sucesso");
                  })
                  .catch((e) =>
                        error(
                              "Erro ao atualizar evolução, verifique os campos obrigatórios",
                        ),
                  );
      };

      const uploadFile = async ({ target }: IUpload) => {
            if (!patient || !target || !target.files) return null;
            const formData = new FormData();

            for (let i = 0; i < target.files.length; i++) {
                  formData.append("patientPDF", target.files[i]);
            }
            try {
                  const { data } = await API.post(
                        "patient/upload/pdf",
                        formData,
                        {
                              headers: {
                                    Authorization: userData!.token,
                                    "Content-Type": "multipart/form-data",
                              },
                              params: {
                                    id: patient.id,
                                    name: patient.name,
                              },
                        },
                  );

                  setAttachments((f) => {
                        return [...f, ...data.attachments];
                  });
                  sucess("Documento Arquivado com Sucesso");
            } catch (err) {
                  error(
                        "Ops... Houve algum erro com o seu documento, por gentileza, verifique se o formato do arquivo é .pdf e tente novamente",
                  );
            }
      };

      useEffect(() => {
            GetAttachments();
      }, [patient]);

      return (
            <Patient>
                  {/* Title */}

                  <h2 style={{ marginTop: 15, marginBottom: 10 }}>
                        Cadastrar Nova Evolução
                  </h2>
                  {/* Grid */}
                  {loading ? (
                        <div
                              style={{
                                    display: "flex",
                                    flexDirection: "column",
                              }}
                        >
                              <Search
                                    onChange={(e) =>
                                          setSearch(e.currentTarget.value)
                                    }
                                    value={search}
                                    placeholder="Buscar paciente pelo nome"
                              />

                              {search &&
                                    filteredPatients &&
                                    filteredPatients.map((patient, k) => {
                                          return (
                                                <div
                                                      key={k}
                                                      style={{
                                                            display: "flex",
                                                            alignItems:
                                                                  "center",
                                                            marginBottom: 12,
                                                      }}
                                                >
                                                      <div
                                                            style={{
                                                                  display: "flex",
                                                                  alignItems:
                                                                        "center",
                                                                  cursor: "pointer",
                                                            }}
                                                            onClick={() =>
                                                                  getUser(
                                                                        patient.id!,
                                                                  )
                                                            }
                                                      >
                                                            <img
                                                                  style={{
                                                                        width: 48,
                                                                        height: 48,
                                                                        objectFit:
                                                                              "cover",
                                                                        marginRight: 12,
                                                                  }}
                                                                  src={foto}
                                                                  alt=""
                                                            />
                                                            <span>
                                                                  {patient.name}
                                                            </span>
                                                      </div>
                                                </div>
                                          );
                                    })}
                        </div>
                  ) : (
                        <div className="grid" id="grid">
                              <PatientEvolu>
                                    {/*Inputs */}

                                    <select
                                          id="select"
                                          className="inputName"
                                          value={patient!.patient_place}
                                          disabled
                                    >
                                          <option value="" disabled selected>
                                                Local do Paciente
                                          </option>
                                          <option value="Casa de Apoio">
                                                Casa de Apoio
                                          </option>
                                          <option value="Comunidade Terapêutica">
                                                Comunidade Terapêutica
                                          </option>
                                    </select>

                                    <input
                                          id="input"
                                          className="inputName"
                                          placeholder="Nome Completo"
                                          value={patient!.name}
                                          disabled
                                    />

                                    <div className="row-column">
                                          <select
                                                id="select"
                                                className="half-input"
                                                value={
                                                      patientEvolution &&
                                                      patientEvolution.progressType
                                                            ? patientEvolution.progressType
                                                            : ""
                                                }
                                                onChange={(e) =>
                                                      setPatientEvolution({
                                                            ...patientEvolution,
                                                            progressType:
                                                                  e.target
                                                                        .value,
                                                      })
                                                }
                                          >
                                                <option
                                                      value=""
                                                      disabled
                                                      selected
                                                >
                                                      Tipo de Evolução
                                                </option>
                                                <option value="psicologo">
                                                      Psicólogo
                                                </option>
                                                <option value="monitoria">
                                                      Monitoria
                                                </option>
                                                <option value="assistente social">
                                                      Assistente Social
                                                </option>
                                          </select>

                                          <select
                                                id="select"
                                                className="half-input"
                                                value={patient!.status}
                                                onChange={(e) => {
                                                      setPatientEvolution(
                                                            (f) => {
                                                                  return {
                                                                        ...f,
                                                                        status: e
                                                                              .target
                                                                              .value,
                                                                  };
                                                            },
                                                      );

                                                      setPatient((f) => {
                                                            return {
                                                                  ...f,
                                                                  status: e
                                                                        .target
                                                                        .value,
                                                            };
                                                      });
                                                }}
                                          >
                                                <option
                                                      value=""
                                                      disabled
                                                      selected
                                                >
                                                      Status
                                                </option>
                                                <option value="ativo">
                                                      Ativo
                                                </option>
                                                <option value="transferido">
                                                      Transferido
                                                </option>
                                                <option value="finalizado">
                                                      Finalizado
                                                </option>
                                          </select>
                                    </div>
                                    <textarea
                                          id="input"
                                          className="inputDesc"
                                          placeholder="Descrição"
                                          style={{
                                                padding: 10,
                                                resize: "none",
                                          }}
                                          value={
                                                patientEvolution &&
                                                patientEvolution.description
                                                      ? patientEvolution.description
                                                      : ""
                                          }
                                          onChange={(e) =>
                                                setPatientEvolution({
                                                      ...patientEvolution,
                                                      description:
                                                            e.target.value,
                                                })
                                          }
                                    />
                                    <div className="check-button">
                                          <Button
                                                style={{ width: 300 }}
                                                onClick={createEvolution}
                                          >
                                                Nova Evolução
                                          </Button>
                                    </div>
                              </PatientEvolu>
                              <ProfilePhoto>
                                    <div>
                                          {/* <Profile /> */}
                                          <img
                                                className="imgProfile"
                                                src={foto}
                                                alt="..."
                                          />
                                    </div>
                                    <div className="docBox">
                                          <div className="subBox">
                                                <span className="docText">
                                                      {" "}
                                                      Documentos{" "}
                                                </span>
                                                <div className="line" />
                                          </div>
                                          <div className="FragmentsPDF">
                                                {attachments &&
                                                      attachments.map(
                                                            (f, k) => {
                                                                  return (
                                                                        <div
                                                                              className="fragmentPDF"
                                                                              key={
                                                                                    k
                                                                              }
                                                                              onClick={() =>
                                                                                    DownloadPDF(
                                                                                          k,
                                                                                    )
                                                                              }
                                                                              style={{
                                                                                    cursor: "pointer",
                                                                              }}
                                                                        >
                                                                              <img
                                                                                    src={
                                                                                          PDFIcon
                                                                                    }
                                                                                    alt=""
                                                                              />
                                                                              <span>
                                                                                    {
                                                                                          f.name
                                                                                    }
                                                                              </span>
                                                                        </div>
                                                                  );
                                                            },
                                                      )}
                                          </div>
                                    </div>
                                    <input
                                          type="file"
                                          id="fileUpload"
                                          accept=".pdf"
                                          onChange={(e) => {
                                                uploadFile({
                                                      target: e.target,
                                                });
                                          }}
                                          multiple={true}
                                          style={{ display: "none" }}
                                    />
                                    <Box htmlFor="fileUpload">
                                          Inserir Documento
                                    </Box>
                              </ProfilePhoto>
                        </div>
                  )}
            </Patient>
      );
};

export default PatientEvolution;
