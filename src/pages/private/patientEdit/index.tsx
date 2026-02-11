/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import {
      PatientEvolu,
      Patient,
      ProfileText,
      ProfilePhoto,
      Image,
      Box,
} from "./styles";
import { Button } from "../../../styles/utils/button";
import API from "../../../services/api";
import { useHistory, useParams } from "react-router-dom";
import useAuth from "../../../hooks/auth";
import PDFIcon from "../../../assets/pdf.svg";

import IPatient from "../../../interfaces/IPatient";
import IAttachments from "../../../interfaces/IAttachments";
import { sucess, error, warning, info } from "../../../components/alert";

interface IUpload {
      target: HTMLInputElement;
}

const PatientEdit: React.FC = () => {
      const params: { id?: string } = useParams();
      const history = useHistory();
      const { userData } = useAuth();

      const [patient, setPatient] = useState<IPatient | null>(null);
      const [attachments, setAttachments] = useState<IAttachments[]>([]);
      const [image, setImage] = useState<File | undefined>(undefined);

      const imageProfilePreviewRef = useRef<HTMLImageElement>(null);
      const birthdayRef = useRef<HTMLInputElement>(null);
      const joinedAtRef = useRef<HTMLInputElement>(null);

      // Função para atualizar a visualização da imagem
      const updateImageProfilePreview = (
            e: React.ChangeEvent<HTMLInputElement>,
      ) => {
            const file = e.target.files ? e.target.files[0] : null;

            if (!file) return;

            if (!file.name.match(/\.(jpg|jpeg|png|jfif)$/)) {
                  return warning(
                        "Tipo de imagem não suportado, envie arquivos em: .png ou .jpg.",
                  );
            }

            if (file.size > 2e6) {
                  return warning(
                        "Limite de upload atingido. Selecione uma foto abaixo de 2 MB.",
                  );
            }

            if (imageProfilePreviewRef.current) {
                  imageProfilePreviewRef.current.src =
                        URL.createObjectURL(file);
            }

            setImage(file);
      };

      // Função para atualizar os dados do paciente
      const updatePatient = () => {
            if (!patient) return;

            const form = new FormData();
            const invalidValues = [
                  "managers_id",
                  "managers_name",
                  "profile_photo",
                  "created_at",
                  "updated_at",
            ];

            Object.keys(patient).forEach((key) => {
                  if (
                        key === "" ||
                        key === null ||
                        !key ||
                        invalidValues.includes(key)
                  )
                        return;

                  const formattedKey = key
                        .split("_")
                        .map((word, index) => {
                              if (index === 0) return word.toLowerCase();
                              return (
                                    word.charAt(0).toUpperCase() + word.slice(1)
                              );
                        })
                        .join("");

                  if (patient[key]) {
                        form.append(formattedKey, patient[key]);
                  }
            });

            if (image) {
                  form.append("profilePhoto", image);
            }

            info("Editando... Aguarde um momento");

            API.post("patient/edit", form, {
                  headers: {
                        Authorization: userData!.token,
                        "Content-Type": "multipart/form-data",
                  },
                  params: {
                        id: params.id,
                  },
            })
                  .then(() => sucess("Editado com sucesso!"))
                  .catch((e) => {
                        console.error(e);
                        error(
                              "Erro ao editar. Revise as informações e tente novamente.",
                        );
                  });
      };

      // Função para buscar os dados do paciente
      const findUserByID = () => {
            API.get("patient/get/id", {
                  headers: {
                        Authorization: userData!.token,
                  },
                  params: {
                        id: params.id,
                  },
            })
                  .then(({ data }: { data: { patient: IPatient } }) => {
                        setPatient(data.patient);
                        if (data.patient.id) {
                              getAttachments(data.patient.id);
                        }
                  })
                  .catch((e) => {
                        error(
                              "Erro ao buscar dados do paciente. Tente novamente.",
                        );
                        console.log(e);
                        history.push("/");
                  });
      };

      // Função para fazer o upload de arquivos PDF
      const uploadFile = ({ target }: IUpload) => {
            if (!patient || !target.files) return;

            const formData = new FormData();
            Array.from(target.files).forEach((file) =>
                  formData.append("patientPDF", file),
            );

            API.post("patient/upload/pdf", formData, {
                  headers: {
                        Authorization: userData!.token,
                        "Content-Type": "multipart/form-data",
                  },
                  params: {
                        id: patient.id,
                        name: patient.name,
                  },
            })
                  .then((e) => {
                        setAttachments((prev) => [
                              ...prev,
                              ...e.data.attachments,
                        ]);
                        sucess("Arquivo enviado com sucesso.");
                  })
                  .catch(() => {
                        warning(
                              "Erro ao enviar o arquivo. Verifique se o arquivo está em .pdf.",
                        );
                  });
      };

      // Função para obter os anexos do paciente
      const getAttachments = async (id: string) => {
            try {
                  const {
                        data: { attachments },
                  } = await API.get("patient/get/attachments", {
                        headers: {
                              Authorization: userData!.token,
                        },
                        params: {
                              id: id,
                        },
                  });
                  setAttachments(attachments);
            } catch (err) {
                  // S3 not configured in development - fallback to empty attachments
                  console.warn(
                        "Attachments service unavailable, continuing without attachments",
                  );
                  setAttachments([]);
            }
      };

      // Função para baixar arquivos PDF
      const downloadPDF = async (index: number) => {
            try {
                  const {
                        data: { url },
                  } = await API.get("patient/get/attachment", {
                        headers: {
                              Authorization: userData!.token,
                        },
                        params: {
                              id: attachments[index].id,
                        },
                  });

                  window.open(url, "_blank")!.focus();
            } catch (err) {
                  console.warn(
                        "Failed to download attachment - S3 service unavailable",
                  );
                  error(
                        "Não foi possível baixar o arquivo. Serviço de armazenamento indisponível.",
                  );
            }
      };

      useEffect(() => {
            if (!params.id) return history.push("/");
            findUserByID();
      }, [params.id]);

      if (!patient) {
            return <h1>Loading...</h1>;
      }

      return (
            <Patient>
                  <h2>Edição de Pacientes</h2>
                  <div className="grid">
                        <PatientEvolu>
                              {/* Inputs */}
                              <select
                                    id="select"
                                    className="inputName"
                                    value={patient.patient_place}
                                    onChange={(e) =>
                                          setPatient({
                                                ...patient,
                                                patient_place: e.target.value,
                                          })
                                    }
                              >
                                    <option value="*" disabled>
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
                                    value={patient.name}
                                    onChange={(e) =>
                                          setPatient({
                                                ...patient,
                                                name: e.target.value,
                                          })
                                    }
                              />

                              {/* RG/CPF */}
                              <div className="row-column">
                                    <input
                                          id="input"
                                          className="half-input"
                                          placeholder="RG"
                                          maxLength={10}
                                          value={patient.rg}
                                          onChange={(e) =>
                                                setPatient({
                                                      ...patient,
                                                      rg: e.target.value,
                                                })
                                          }
                                    />
                                    <input
                                          id="input"
                                          className="half-input"
                                          placeholder="CPF"
                                          maxLength={11}
                                          value={patient.cpf}
                                          onChange={(e) =>
                                                setPatient({
                                                      ...patient,
                                                      cpf: e.target.value,
                                                })
                                          }
                                    />
                              </div>

                              {/* Gender/CEP */}
                              <div className="row-column">
                                    <select
                                          id="select"
                                          className="half-input"
                                          value={patient.gender}
                                          onChange={(e) =>
                                                setPatient({
                                                      ...patient,
                                                      gender: e.target.value,
                                                })
                                          }
                                    >
                                          <option value="" disabled>
                                                Gênero
                                          </option>
                                          <option value="female">
                                                Feminino
                                          </option>
                                          <option value="male">
                                                Masculino
                                          </option>
                                    </select>
                                    <input
                                          type="date"
                                          id="input"
                                          className="half-input"
                                          placeholder="Data de Nascimento"
                                          ref={birthdayRef}
                                          value={
                                                patient.birthday
                                                      ? patient.birthday.split(
                                                              "T",
                                                        )[0]
                                                      : ""
                                          }
                                          onChange={(e) =>
                                                setPatient({
                                                      ...patient,
                                                      birthday: e.target.value,
                                                })
                                          }
                                          max={new Date()
                                                .toISOString()
                                                .slice(0, 10)}
                                    />
                              </div>

                              <div className="row-column">
                                    <input
                                          id="input"
                                          className="half-input"
                                          placeholder="CEP"
                                          maxLength={8}
                                          value={patient.cep}
                                          onChange={(e) =>
                                                setPatient({
                                                      ...patient,
                                                      cep: e.target.value,
                                                })
                                          }
                                    />
                                    <input
                                          id="input"
                                          className="half-input"
                                          placeholder="UF"
                                          maxLength={2}
                                          disabled
                                          value={patient.cep ? patient.uf : ""}
                                    />
                              </div>

                              <div className="row-column">
                                    <input
                                          id="input"
                                          className="half-input"
                                          placeholder="Cidade"
                                          disabled
                                          value={
                                                patient.cep ? patient.city : ""
                                          }
                                    />
                                    <input
                                          id="input"
                                          className="half-input"
                                          placeholder="Nº"
                                          maxLength={5}
                                          value={
                                                patient.cep
                                                      ? patient.number_house
                                                      : ""
                                          }
                                          onChange={(e) =>
                                                setPatient({
                                                      ...patient,
                                                      number_house:
                                                            e.target.value,
                                                })
                                          }
                                    />
                              </div>

                              <input
                                    style={{ color: "#000000" }}
                                    id="input"
                                    className="inputName"
                                    placeholder="Logradouro"
                                    disabled
                                    value={patient.cep ? patient.street : ""}
                              />

                              <input
                                    type="date"
                                    id="input"
                                    className="inputName"
                                    placeholder="Data de Entrada"
                                    ref={joinedAtRef}
                                    value={
                                          patient.joined_at
                                                ? patient.joined_at.split(
                                                        "T",
                                                  )[0]
                                                : ""
                                    }
                                    onChange={(e) =>
                                          setPatient({
                                                ...patient,
                                                joined_at: e.target.value,
                                          })
                                    }
                                    max={new Date().toISOString().slice(0, 10)}
                              />

                              <input
                                    id="input"
                                    className="inputName"
                                    placeholder="Nome da Mãe"
                                    value={patient.mother_name}
                                    onChange={(e) =>
                                          setPatient({
                                                ...patient,
                                                mother_name: e.target.value,
                                          })
                                    }
                              />
                              <input
                                    id="input"
                                    className="inputName"
                                    placeholder="Antecedentes Policiais"
                                    value={patient.criminal_record}
                                    onChange={(e) =>
                                          setPatient({
                                                ...patient,
                                                criminal_record: e.target.value,
                                          })
                                    }
                              />
                              <input
                                    id="input"
                                    className="inputName"
                                    placeholder="Substâncias"
                                    value={patient.substances}
                                    onChange={(e) =>
                                          setPatient({
                                                ...patient,
                                                substances: e.target.value,
                                          })
                                    }
                              />

                              {/* Botão */}
                              <div className="check-button">
                                    <Button
                                          style={{ width: 300 }}
                                          onClick={updatePatient}
                                    >
                                          Atualizar
                                    </Button>
                              </div>
                        </PatientEvolu>

                        {/* Inserir Imagem */}
                        <ProfilePhoto>
                              <Image
                                    src={patient.profile_photo}
                                    alt=""
                                    ref={imageProfilePreviewRef}
                              />
                              <input
                                    id="imageFile"
                                    type="file"
                                    onChange={updateImageProfilePreview}
                                    style={{ display: "none" }}
                              />
                              <ProfileText htmlFor="imageFile">
                                    Inserir Imagem
                              </ProfileText>

                              <div className="docBox">
                                    <div className="subBox">
                                          <span className="docText">
                                                {" "}
                                                Documentos{" "}
                                          </span>
                                          <div className="line" />
                                    </div>
                                    <div className="FragmentsPDF">
                                          {attachments.map(
                                                (attachment, index) => (
                                                      <div
                                                            className="fragmentPDF"
                                                            key={index}
                                                            onClick={() =>
                                                                  downloadPDF(
                                                                        index,
                                                                  )
                                                            }
                                                            style={{
                                                                  cursor: "pointer",
                                                            }}
                                                      >
                                                            <img
                                                                  src={PDFIcon}
                                                                  alt=""
                                                            />
                                                            <span>
                                                                  {
                                                                        attachment.name
                                                                  }
                                                            </span>
                                                      </div>
                                                ),
                                          )}
                                    </div>
                              </div>

                              <input
                                    type="file"
                                    id="fileUpload"
                                    accept=".pdf"
                                    onChange={(e) =>
                                          uploadFile({ target: e.target })
                                    }
                                    multiple
                                    style={{ display: "none" }}
                              />
                              <Box htmlFor="fileUpload">Inserir Documento</Box>
                        </ProfilePhoto>
                  </div>
            </Patient>
      );
};

export default PatientEdit;
