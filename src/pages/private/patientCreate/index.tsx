/* eslint-disable react-hooks/exhaustive-deps */
import React, { createRef, useEffect, useState } from "react";
import axios from "axios";
import Joi from "joi";
import API from "../../../services/api";
import useAuth from "../../../hooks/auth";
import IPatient from "../../../interfaces/IPatient";
import { useHistory } from "react-router-dom";
import NavigationHeader from "../../../components/navigationHeader";
import { sucess, error, warning, info } from "../../../components/alert";
import * as S from "../../../styles/formStyles";

const patientSchema = Joi.object({
      patientPlace: Joi.string().allow(""),
      name: Joi.string().required(),
      cpf: Joi.string().allow(""),
      rg: Joi.string().allow(""),
      gender: Joi.string().lowercase().valid("male", "female").default("male"),
      uf: Joi.string().allow(""),
      cep: Joi.string().allow(""),
      street: Joi.string().allow(""),
      city: Joi.string().allow(""),
      numberHouse: Joi.string().allow(""),
      birthday: Joi.string().allow(""),
      joinedAt: Joi.string().allow(""),
      motherName: Joi.string().allow(""),
      criminalRecord: Joi.string().allow(""),
      substances: Joi.string().allow(""),
});

const PatientCreate: React.FC = () => {
      const { userData } = useAuth();
      const history = useHistory();

      const resetStatePerson: IPatient = {
            birthday: "",
            cep: "",
            city: "",
            cpf: "",
            gender: "male",
            name: "",
            number_house: "",
            patient_place: "",
            rg: "",
            status: "ativo",
            street: "",
            uf: "",
            joined_at: "",
            mother_name: "",
            substances: "",
            criminal_record: "",
      };

      const [image, setImage] = useState<any>(undefined);
      const [patient, setPatient] = useState<IPatient>({ ...resetStatePerson });
      const [isSubmitting, setIsSubmitting] = useState(false);

      const imageProfilePreviewRef = createRef<HTMLImageElement>();

      const findCEP = async () => {
            if (!patient.cep || patient.cep.length !== 8) return;

            try {
                  const { data } = await axios.get(
                        `https://viacep.com.br/ws/${patient.cep}/json/`,
                  );
                  setPatient((prev) => ({
                        ...prev,
                        uf: data.uf,
                        street: data.logradouro,
                        city: data.localidade,
                  }));
            } catch {
                  warning("Erro ao buscar CEP.");
            }
      };

      const updateImageProfilePreview = (
            e: React.ChangeEvent<HTMLInputElement>,
      ) => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (!file.name.match(/\.(jpg|jpeg|png|jfif)$/)) {
                  return warning(
                        "Tipo de imagem não suportado. Use: .png ou .jpg",
                  );
            }

            if (file.size > 2e6) {
                  return warning("Limite de 2MB excedido.");
            }

            if (imageProfilePreviewRef.current) {
                  imageProfilePreviewRef.current.src =
                        URL.createObjectURL(file);
            }
            setImage(file);
      };

      const setImageDefault = async () => {
            const url =
                  "https://i.postimg.cc/7ZyxCwf4/User-Profile-PNG-High-Quality-Image.png";
            try {
                  const response = await fetch(url);
                  const imageBlob = await response.blob();
                  if (imageProfilePreviewRef.current) {
                        imageProfilePreviewRef.current.src =
                              URL.createObjectURL(imageBlob);
                  }
                  setImage(imageBlob);
            } catch {
                  console.warn("Could not load default image");
            }
      };

      const registerNewPatient = async () => {
            // Build camelCase payload (only schema-allowed fields, excluding status)
            const excluded = ["status"];
            const payload: Record<string, string> = {};

            Object.entries(patient).forEach(([key, value]) => {
                  if (!value || excluded.includes(key)) return;
                  const camelKey = key
                        .split("_")
                        .map((word, i) =>
                              i === 0
                                    ? word.toLowerCase()
                                    : word.charAt(0).toUpperCase() +
                                      word.slice(1),
                        )
                        .join("");
                  payload[camelKey] = value;
            });

            // Validate with Joi before sending
            const { error: validationError } = patientSchema.validate(payload, {
                  abortEarly: false,
            });

            if (validationError) {
                  const messages = validationError.details
                        .map((d) => d.message)
                        .join("\n");
                  warning(messages);
                  return;
            }

            setIsSubmitting(true);
            const form = new FormData();
            Object.entries(payload).forEach(([key, value]) =>
                  form.append(key, value),
            );

            if (image) {
                  form.append("profilePhoto", image);
            }

            info("Registrando paciente...");

            try {
                  await API.post("patient/create", form, {
                        headers: {
                              Authorization: userData!.token,
                              "Content-Type": "multipart/form-data",
                        },
                  });
                  sucess("Paciente cadastrado com sucesso!");
                  setPatient({ ...resetStatePerson });
                  setImageDefault();
            } catch {
                  error(
                        "Erro ao cadastrar. Verifique as informações e tente novamente.",
                  );
            } finally {
                  setIsSubmitting(false);
            }
      };

      useEffect(() => {
            findCEP();
      }, [patient.cep]);

      useEffect(() => {
            setImageDefault();
      }, []);

      return (
            <S.Container>
                  <NavigationHeader
                        title="Novo Acolhido"
                        backPath="/patient/relatory"
                        breadcrumbs={[
                              { label: "Paciente", path: "/patient/relatory" },
                              { label: "Cadastrar Novo" },
                        ]}
                  />

                  <S.ContentGrid>
                        <S.MainColumn>
                              {/* Informações Básicas */}
                              <S.Card>
                                    <S.CardHeader>
                                          <S.CardTitle>
                                                <S.CardIcon>
                                                      <svg
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                      >
                                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                            <circle
                                                                  cx="12"
                                                                  cy="7"
                                                                  r="4"
                                                            />
                                                      </svg>
                                                </S.CardIcon>
                                                Informações Pessoais
                                          </S.CardTitle>
                                    </S.CardHeader>

                                    <S.FormGrid>
                                          <S.FormGroup fullWidth>
                                                <S.Label>
                                                      Nome Completo{" "}
                                                      <S.RequiredMark>
                                                            *
                                                      </S.RequiredMark>
                                                </S.Label>
                                                <S.Input
                                                      placeholder="Digite o nome completo"
                                                      value={patient.name || ""}
                                                      onChange={(e) =>
                                                            setPatient({
                                                                  ...patient,
                                                                  name: e.target
                                                                        .value,
                                                            })
                                                      }
                                                />
                                          </S.FormGroup>

                                          <S.FormGroup>
                                                <S.Label>
                                                      Local do Paciente
                                                </S.Label>
                                                <S.Select
                                                      value={
                                                            patient.patient_place ||
                                                            ""
                                                      }
                                                      onChange={(e) =>
                                                            setPatient({
                                                                  ...patient,
                                                                  patient_place:
                                                                        e.target
                                                                              .value,
                                                            })
                                                      }
                                                >
                                                      <option value="">
                                                            Selecione...
                                                      </option>
                                                      <option value="Casa de Apoio">
                                                            Casa de Apoio
                                                      </option>
                                                      <option value="Comunidade Terapêutica">
                                                            Comunidade
                                                            Terapêutica
                                                      </option>
                                                </S.Select>
                                          </S.FormGroup>

                                          <S.FormGroup>
                                                <S.Label>Status</S.Label>
                                                <S.Select
                                                      value={
                                                            patient.status ||
                                                            "ativo"
                                                      }
                                                      onChange={(e) =>
                                                            setPatient({
                                                                  ...patient,
                                                                  status: e
                                                                        .target
                                                                        .value,
                                                            })
                                                      }
                                                >
                                                      <option value="ativo">
                                                            Ativo
                                                      </option>
                                                      <option value="transferido">
                                                            Transferido
                                                      </option>
                                                      <option value="finalizado">
                                                            Finalizado
                                                      </option>
                                                </S.Select>
                                          </S.FormGroup>

                                          <S.FormGroup>
                                                <S.Label>CPF</S.Label>
                                                <S.Input
                                                      placeholder="00000000000"
                                                      maxLength={11}
                                                      value={patient.cpf || ""}
                                                      onChange={(e) =>
                                                            setPatient({
                                                                  ...patient,
                                                                  cpf: e.target
                                                                        .value,
                                                            })
                                                      }
                                                />
                                          </S.FormGroup>

                                          <S.FormGroup>
                                                <S.Label>RG</S.Label>
                                                <S.Input
                                                      placeholder="000000000"
                                                      maxLength={10}
                                                      value={patient.rg || ""}
                                                      onChange={(e) =>
                                                            setPatient({
                                                                  ...patient,
                                                                  rg: e.target
                                                                        .value,
                                                            })
                                                      }
                                                />
                                          </S.FormGroup>

                                          <S.FormGroup>
                                                <S.Label>Gênero</S.Label>
                                                <S.Select
                                                      value={
                                                            patient.gender ||
                                                            "male"
                                                      }
                                                      onChange={(e) =>
                                                            setPatient({
                                                                  ...patient,
                                                                  gender: e
                                                                        .target
                                                                        .value,
                                                            })
                                                      }
                                                >
                                                      <option value="male">
                                                            Masculino
                                                      </option>
                                                      <option value="female">
                                                            Feminino
                                                      </option>
                                                </S.Select>
                                          </S.FormGroup>

                                          <S.FormGroup>
                                                <S.Label>
                                                      Data de Nascimento
                                                </S.Label>
                                                <S.Input
                                                      type="date"
                                                      value={
                                                            patient.birthday ||
                                                            ""
                                                      }
                                                      onChange={(e) =>
                                                            setPatient({
                                                                  ...patient,
                                                                  birthday: e
                                                                        .target
                                                                        .value,
                                                            })
                                                      }
                                                      max={new Date()
                                                            .toISOString()
                                                            .slice(0, 10)}
                                                />
                                          </S.FormGroup>

                                          <S.FormGroup>
                                                <S.Label>Nome da Mãe</S.Label>
                                                <S.Input
                                                      placeholder="Nome completo da mãe"
                                                      value={
                                                            patient.mother_name ||
                                                            ""
                                                      }
                                                      onChange={(e) =>
                                                            setPatient({
                                                                  ...patient,
                                                                  mother_name:
                                                                        e.target
                                                                              .value,
                                                            })
                                                      }
                                                />
                                          </S.FormGroup>

                                          <S.FormGroup>
                                                <S.Label>
                                                      Data de Entrada
                                                </S.Label>
                                                <S.Input
                                                      type="date"
                                                      value={
                                                            patient.joined_at ||
                                                            ""
                                                      }
                                                      onChange={(e) =>
                                                            setPatient({
                                                                  ...patient,
                                                                  joined_at:
                                                                        e.target
                                                                              .value,
                                                            })
                                                      }
                                                      max={new Date()
                                                            .toISOString()
                                                            .slice(0, 10)}
                                                />
                                          </S.FormGroup>
                                    </S.FormGrid>
                              </S.Card>

                              {/* Endereço */}
                              <S.Card>
                                    <S.CardHeader>
                                          <S.CardTitle>
                                                <S.CardIcon>
                                                      <svg
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                      >
                                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                            <circle
                                                                  cx="12"
                                                                  cy="10"
                                                                  r="3"
                                                            />
                                                      </svg>
                                                </S.CardIcon>
                                                Endereço
                                          </S.CardTitle>
                                    </S.CardHeader>

                                    <S.FormGrid>
                                          <S.FormGroup>
                                                <S.Label>CEP</S.Label>
                                                <S.Input
                                                      placeholder="00000000"
                                                      maxLength={8}
                                                      value={patient.cep || ""}
                                                      onChange={(e) =>
                                                            setPatient({
                                                                  ...patient,
                                                                  cep: e.target
                                                                        .value,
                                                            })
                                                      }
                                                />
                                                <S.HelpText>
                                                      Digite o CEP para
                                                      preenchimento automático
                                                </S.HelpText>
                                          </S.FormGroup>

                                          <S.FormGroup>
                                                <S.Label>UF</S.Label>
                                                <S.Input
                                                      placeholder="UF"
                                                      disabled
                                                      value={patient.uf || ""}
                                                />
                                          </S.FormGroup>

                                          <S.FormGroup>
                                                <S.Label>Cidade</S.Label>
                                                <S.Input
                                                      placeholder="Cidade"
                                                      disabled
                                                      value={patient.city || ""}
                                                />
                                          </S.FormGroup>

                                          <S.FormGroup>
                                                <S.Label>Número</S.Label>
                                                <S.Input
                                                      placeholder="Nº"
                                                      value={
                                                            patient.number_house ||
                                                            ""
                                                      }
                                                      onChange={(e) =>
                                                            setPatient({
                                                                  ...patient,
                                                                  number_house:
                                                                        e.target
                                                                              .value,
                                                            })
                                                      }
                                                />
                                          </S.FormGroup>

                                          <S.FormGroup fullWidth>
                                                <S.Label>Logradouro</S.Label>
                                                <S.Input
                                                      placeholder="Rua, Avenida..."
                                                      disabled
                                                      value={
                                                            patient.street || ""
                                                      }
                                                />
                                          </S.FormGroup>
                                    </S.FormGrid>
                              </S.Card>

                              {/* Informações Adicionais */}
                              <S.Card>
                                    <S.CardHeader>
                                          <S.CardTitle>
                                                <S.CardIcon>
                                                      <svg
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                      >
                                                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                                            <rect
                                                                  x="8"
                                                                  y="2"
                                                                  width="8"
                                                                  height="4"
                                                                  rx="1"
                                                            />
                                                      </svg>
                                                </S.CardIcon>
                                                Informações Adicionais
                                          </S.CardTitle>
                                    </S.CardHeader>

                                    <S.FormGrid>
                                          <S.FormGroup fullWidth>
                                                <S.Label>
                                                      Substâncias Utilizadas
                                                </S.Label>
                                                <S.Input
                                                      placeholder="Descreva as substâncias..."
                                                      value={
                                                            patient.substances ||
                                                            ""
                                                      }
                                                      onChange={(e) =>
                                                            setPatient({
                                                                  ...patient,
                                                                  substances:
                                                                        e.target
                                                                              .value,
                                                            })
                                                      }
                                                />
                                          </S.FormGroup>

                                          <S.FormGroup fullWidth>
                                                <S.Label>
                                                      Antecedentes Criminais
                                                </S.Label>
                                                <S.Input
                                                      placeholder="Descreva se houver..."
                                                      value={
                                                            patient.criminal_record ||
                                                            ""
                                                      }
                                                      onChange={(e) =>
                                                            setPatient({
                                                                  ...patient,
                                                                  criminal_record:
                                                                        e.target
                                                                              .value,
                                                            })
                                                      }
                                                />
                                          </S.FormGroup>
                                    </S.FormGrid>
                              </S.Card>
                        </S.MainColumn>

                        <S.Sidebar>
                              {/* Foto do Paciente */}
                              <S.ProfileCard>
                                    <S.ProfileImageWrapper>
                                          <S.ProfileImage
                                                ref={imageProfilePreviewRef}
                                                src=""
                                                alt="Foto do paciente"
                                          />
                                    </S.ProfileImageWrapper>

                                    <S.UploadButton>
                                          Inserir Foto
                                          <input
                                                type="file"
                                                accept="image/*"
                                                onChange={
                                                      updateImageProfilePreview
                                                }
                                          />
                                    </S.UploadButton>
                                    <S.HelpText style={{ marginTop: 8 }}>
                                          Formatos: JPG, PNG (máx. 2MB)
                                    </S.HelpText>
                              </S.ProfileCard>

                              {/* Ações */}
                              <S.Card>
                                    <S.ActionButtons>
                                          <S.SubmitButton
                                                onClick={registerNewPatient}
                                                disabled={isSubmitting}
                                          >
                                                {isSubmitting
                                                      ? "Cadastrando..."
                                                      : "✓ Cadastrar Paciente"}
                                          </S.SubmitButton>

                                          <S.SecondaryButton
                                                onClick={() =>
                                                      history.push(
                                                            "/patient/relatory",
                                                      )
                                                }
                                          >
                                                Cancelar
                                          </S.SecondaryButton>
                                    </S.ActionButtons>
                              </S.Card>

                              {/* Dicas */}
                              <S.Card>
                                    <S.CardTitle
                                          style={{
                                                fontSize: 14,
                                                marginBottom: 12,
                                          }}
                                    >
                                          Dicas
                                    </S.CardTitle>
                                    <p
                                          style={{
                                                fontSize: 13,
                                                color: "#666",
                                                lineHeight: 1.6,
                                                margin: 0,
                                          }}
                                    >
                                          • Campos com{" "}
                                          <S.RequiredMark>*</S.RequiredMark> são
                                          obrigatórios
                                          <br />
                                          • O CEP preenche endereço
                                          automaticamente
                                          <br />• Foto deve ter no máximo 2MB
                                    </p>
                              </S.Card>
                        </S.Sidebar>
                  </S.ContentGrid>
            </S.Container>
      );
};

export default PatientCreate;
