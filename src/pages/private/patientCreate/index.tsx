/* eslint-disable react-hooks/exhaustive-deps */

/* Import important dependencies */
import React, { createRef, useEffect, useState } from "react";
import FormData from "form-data";
import axios from "axios";
import API from "../../../services/api";
import useAuth from "../../../hooks/auth";
import IPatient from "../../../interfaces/IPatient";

/* Import components and styles */
import {
      PatientEvolu,
      Patient,
      ProfileText,
      ProfilePhoto,
      Image,
} from "./styles";
import { Button } from "../../../styles/utils/button";
import { sucess, error, warning, info } from "../../../components/alert";

/* Define the PatientCreate component */
const PatientCreate: React.FC = () => {
      const { userData } = useAuth();

      /* Initialize state for patient and image */
      const resetStatePerson: IPatient = {
            birthday: "",
            cep: "",
            city: "",
            cpf: "",
            created_at: "",
            gender: "male",
            id: "",
            managers_id: "",
            name: "",
            number_house: "",
            patient_place: "",
            profile_photo: "",
            rg: "",
            status: "",
            street: "",
            uf: "",
            updated_at: "",
            description: "",
            progress_type: "",
            joined_at: "",
            managers_name: "",
            mother_name: "",
            substances: "",
            criminal_record: "",
      };

      const [image, setImage] = useState<any>(undefined);
      const [patient, setPatient] = useState<IPatient>({ gender: "male" });

      /* Create refs for form inputs */
      const birthdayRef = createRef<HTMLInputElement>();
      const joinedAtRef = createRef<HTMLInputElement>();
      const imageProfilePreviewRef = createRef<HTMLImageElement>();

      /* Function to find and populate address data based on CEP */
      const findCEP = async () => {
            if (!patient.cep || patient.cep.length !== 8) return;

            try {
                  const { data } = await axios.get(
                        `https://viacep.com.br/ws/${patient.cep}/json/`,
                  );

                  setPatient((prevPatient) => ({
                        ...prevPatient,
                        uf: data.uf,
                        street: data.logradouro,
                        city: data.localidade,
                  }));
            } catch (error) {
                  warning("Erro ao buscar CEP.");
            }
      };

      /* Function to update the image preview */
      const updateImageProfilePreview = (
            e: React.ChangeEvent<HTMLInputElement>,
      ) => {
            const file = e.target.files?.[0];

            if (file) {
                  if (!file.name.match(/\.(jpg|jpeg|png|jfif)$/)) {
                        return warning(
                              "Tipo de imagem não suportada, tente enviar arquivos em: .png ou .jpg",
                        );
                  }

                  if (file.size > 2e6) {
                        return warning(
                              "Limite de upload atingido. Por gentileza, selecione uma foto abaixo de 2 MB",
                        );
                  }

                  imageProfilePreviewRef.current!.src =
                        URL.createObjectURL(file);
                  setImage(file);
            }
      };

      /* Function to set the default profile image */
      const setImageDefault = async () => {
            const url =
                  "https://i.postimg.cc/7ZyxCwf4/User-Profile-PNG-High-Quality-Image.png";
            const image = await fetch(url);
            const imageBlob = await image.blob();
            imageProfilePreviewRef.current!.src =
                  URL.createObjectURL(imageBlob);
            setImage(imageBlob);
      };

      /* Function to register a new patient */
      const registerNewPatient = () => {
            if (!patient.name) {
                  warning("Por gentileza, preencha o nome de usuário");
                  return;
            }

            const form = new FormData();

            /* Convert patient object keys to camelCase and append to FormData */
            Object.entries(patient).forEach(([key, value]) => {
                  if (value) {
                        const formattedKey = key
                              .split("_")
                              .map((word, index) =>
                                    index === 0
                                          ? word.toLowerCase()
                                          : word.charAt(0).toUpperCase() +
                                            word.slice(1),
                              )
                              .join("");

                        form.append(formattedKey, value);
                  }
            });

            /* Append the image to the FormData if it exists */
            if (image) {
                  form.append("profilePhoto", image);
            }

            info("Registrando");

            /* Post the form data to the API */
            API.post("patient/create", form, {
                  headers: {
                        Authorization: userData!.token,
                        "Content-Type": "multipart/form-data",
                  },
            })
                  .then(() => {
                        setPatient({ ...resetStatePerson });
                        sucess("Paciente Cadastrado com Sucesso");
                  })
                  .catch(() => {
                        error(
                              "Ops... Verifique novamente as informações, ou pressione F5 para atualizar suas credenciais",
                        );
                  });

            setImageDefault();
      };

      /* UseEffect to handle CEP changes */
      useEffect(() => {
            findCEP();
      }, [patient.cep]);

      /* UseEffect to set the default image on mount */
      useEffect(() => {
            setImageDefault();
      }, []);

      /* Render the PatientCreate component */
      return (
            <Patient>
                  <h2 style={{ marginTop: 15, marginBottom: 10 }}>
                        Cadastrar Novo Paciente
                  </h2>
                  <div className="grid">
                        <PatientEvolu>
                              {/* Inputs for patient details */}
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
                                    <option value="" disabled>
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

                              {/* Input for RG and CPF */}
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

                              {/* Input for gender and birthdate */}
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
                                          placeholder="Data De Nascimento"
                                          ref={birthdayRef}
                                          value={patient.birthday}
                                          onChange={(e) => {
                                                setPatient({
                                                      ...patient,
                                                      birthday: e.target.value,
                                                });
                                          }}
                                          max={new Date()
                                                .toISOString()
                                                .slice(0, 10)}
                                    />
                              </div>

                              {/* Input for CEP, UF, city, and house number */}
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
                                          value={
                                                patient.number_house &&
                                                Number.parseInt(
                                                      patient.number_house,
                                                )
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
                                    id="input"
                                    className="inputName"
                                    placeholder="Logradouro"
                                    value={patient.cep ? patient.street : ""}
                                    disabled
                              />

                              <input
                                    type="date"
                                    id="input"
                                    className="inputName"
                                    placeholder="Data De Entrada"
                                    ref={joinedAtRef}
                                    value={patient.joined_at}
                                    onChange={(e) => {
                                          setPatient({
                                                ...patient,
                                                joined_at: e.target.value,
                                          });
                                    }}
                                    max={new Date().toISOString().slice(0, 10)}
                              />

                              <input
                                    id="input"
                                    className="inputName"
                                    placeholder="Nome Da Mãe"
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
                                    placeholder="Substancias"
                                    value={patient.substances}
                                    onChange={(e) =>
                                          setPatient({
                                                ...patient,
                                                substances: e.target.value,
                                          })
                                    }
                              />

                              {/* Button to register new patient */}
                              <div className="check-button">
                                    <Button
                                          style={{ width: 300 }}
                                          onClick={registerNewPatient}
                                    >
                                          Cadastrar
                                    </Button>
                              </div>
                        </PatientEvolu>

                        {/* Image upload section */}
                        <ProfilePhoto>
                              <Image
                                    src=""
                                    alt={""}
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
                        </ProfilePhoto>
                  </div>
            </Patient>
      );
};

export default PatientCreate;
