/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import API from "../../../services/api";
import { useHistory, useParams } from "react-router-dom";
import useAuth from "../../../hooks/auth";
import NavigationHeader from "../../../components/navigationHeader";
import IPatient from "../../../interfaces/IPatient";
import IAttachments from "../../../interfaces/IAttachments";
import { sucess, error, warning, info } from "../../../components/alert";
import * as S from "../../../styles/formStyles";

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
      const [isSubmitting, setIsSubmitting] = useState(false);

      const imageProfilePreviewRef = useRef<HTMLImageElement>(null);

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

      const updatePatient = async () => {
            if (!patient) return;

            setIsSubmitting(true);
            const form = new FormData();
            const invalidValues = [
                  "managers_id",
                  "managers_name",
                  "profile_photo",
                  "created_at",
                  "updated_at",
            ];

            Object.keys(patient).forEach((key) => {
                  if (!key || invalidValues.includes(key)) return;

                  const formattedKey = key
                        .split("_")
                        .map((word, index) =>
                              index === 0
                                    ? word.toLowerCase()
                                    : word.charAt(0).toUpperCase() +
                                      word.slice(1),
                        )
                        .join("");

                  if (patient[key]) {
                        form.append(formattedKey, patient[key]);
                  }
            });

            if (image) {
                  form.append("profilePhoto", image);
            }

            info("Salvando alterações...");

            try {
                  await API.post("patient/edit", form, {
                        headers: {
                              Authorization: userData!.token,
                              "Content-Type": "multipart/form-data",
                        },
                        params: { id: params.id },
                  });
                  sucess("Paciente atualizado com sucesso!");
            } catch {
                  error(
                        "Erro ao editar. Revise as informações e tente novamente.",
                  );
            } finally {
                  setIsSubmitting(false);
            }
      };

      const findUserByID = () => {
            API.get("patient/get/id", {
                  headers: { Authorization: userData!.token },
                  params: { id: params.id },
            })
                  .then(({ data }: { data: { patient: IPatient } }) => {
                        setPatient(data.patient);
                        if (data.patient.id) {
                              getAttachments(data.patient.id);
                        }
                  })
                  .catch(() => {
                        error("Erro ao buscar dados do paciente.");
                        history.push("/patient/relatory");
                  });
      };

      const uploadFile = ({ target }: IUpload) => {
            if (!patient || !target.files) return;

            const formData = new FormData();
            Array.from(target.files).forEach((file) =>
                  formData.append("patientPDF", file),
            );

            info("Enviando documento...");

            API.post("patient/upload/pdf", formData, {
                  headers: {
                        Authorization: userData!.token,
                        "Content-Type": "multipart/form-data",
                  },
                  params: { id: patient.id, name: patient.name },
            })
                  .then((e) => {
                        setAttachments((prev) => [
                              ...prev,
                              ...e.data.attachments,
                        ]);
                        sucess("Documento enviado com sucesso!");
                  })
                  .catch(() => {
                        warning(
                              "Erro ao enviar. Verifique se o arquivo está em .pdf",
                        );
                  });
      };

      const getAttachments = async (id: string) => {
            try {
                  const {
                        data: { attachments },
                  } = await API.get("patient/get/attachments", {
                        headers: { Authorization: userData!.token },
                        params: { id },
                  });
                  setAttachments(attachments);
            } catch {
                  console.warn("Attachments service unavailable");
                  setAttachments([]);
            }
      };

      const downloadPDF = async (index: number) => {
            try {
                  const {
                        data: { url },
                  } = await API.get("patient/get/attachment", {
                        headers: { Authorization: userData!.token },
                        params: { id: attachments[index].id },
                  });
                  window.open(url, "_blank")?.focus();
            } catch {
                  error("Não foi possível baixar o arquivo.");
            }
      };

      useEffect(() => {
            if (!params.id) return history.push("/patient/relatory");
            findUserByID();
      }, [params.id]);

      if (!patient) {
            return (
                  <S.Container>
                        <S.LoadingState>
                              <S.LoadingSpinner />
                              <span>Carregando dados do paciente...</span>
                        </S.LoadingState>
                  </S.Container>
            );
      }

      return (
            <S.Container>
                  <NavigationHeader
                        title={`Editar: ${patient.name}`}
                        backPath="/patient/relatory"
                        breadcrumbs={[
                              { label: "Pacientes", path: "/patient/relatory" },
                              { label: patient.name || "Edição" },
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
                                          <S.StatusBadge
                                                status={
                                                      patient.status || "ativo"
                                                }
                                          >
                                                {patient.status === "ativo" &&
                                                      "● Ativo"}
                                                {patient.status ===
                                                      "transferido" &&
                                                      "↗ Transferido"}
                                                {patient.status ===
                                                      "finalizado" &&
                                                      "✓ Finalizado"}
                                          </S.StatusBadge>
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
                                                            patient.birthday
                                                                  ? patient.birthday.split(
                                                                          "T",
                                                                    )[0]
                                                                  : ""
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
                                                            patient.joined_at
                                                                  ? patient.joined_at.split(
                                                                          "T",
                                                                    )[0]
                                                                  : ""
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
                                                src={
                                                      patient.profile_photo ||
                                                      ""
                                                }
                                                alt="Foto do paciente"
                                          />
                                    </S.ProfileImageWrapper>

                                    <S.UploadButton>
                                          Alterar Foto
                                          <input
                                                type="file"
                                                accept="image/*"
                                                onChange={
                                                      updateImageProfilePreview
                                                }
                                          />
                                    </S.UploadButton>
                              </S.ProfileCard>

                              {/* Documentos */}
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
                                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                            <polyline points="14 2 14 8 20 8" />
                                                      </svg>
                                                </S.CardIcon>
                                                Documentos
                                          </S.CardTitle>
                                          <S.Badge>
                                                {attachments.length}
                                          </S.Badge>
                                    </S.CardHeader>

                                    <S.DocumentsList>
                                          {attachments.length === 0 ? (
                                                <S.EmptyDocuments>
                                                      <span>
                                                            <svg
                                                                  width="32"
                                                                  height="32"
                                                                  viewBox="0 0 24 24"
                                                                  fill="none"
                                                                  stroke="currentColor"
                                                                  strokeWidth="1.5"
                                                            >
                                                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                                  <polyline points="14 2 14 8 20 8" />
                                                            </svg>
                                                      </span>
                                                      <p>
                                                            Nenhum documento
                                                            anexado
                                                      </p>
                                                </S.EmptyDocuments>
                                          ) : (
                                                attachments.map(
                                                      (attachment, index) => (
                                                            <S.DocumentItem
                                                                  key={index}
                                                                  onClick={() =>
                                                                        downloadPDF(
                                                                              index,
                                                                        )
                                                                  }
                                                            >
                                                                  <S.DocumentIcon>
                                                                        <svg
                                                                              width="20"
                                                                              height="20"
                                                                              viewBox="0 0 24 24"
                                                                              fill="none"
                                                                              stroke="currentColor"
                                                                              strokeWidth="2"
                                                                        >
                                                                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                                              <polyline points="14 2 14 8 20 8" />
                                                                        </svg>
                                                                  </S.DocumentIcon>
                                                                  <S.DocumentInfo>
                                                                        <S.DocumentName>
                                                                              {
                                                                                    attachment.name
                                                                              }
                                                                        </S.DocumentName>
                                                                        <S.DocumentMeta>
                                                                              Clique
                                                                              para
                                                                              baixar
                                                                        </S.DocumentMeta>
                                                                  </S.DocumentInfo>
                                                                  <S.DocumentAction>
                                                                        ↓
                                                                  </S.DocumentAction>
                                                            </S.DocumentItem>
                                                      ),
                                                )
                                          )}
                                    </S.DocumentsList>

                                    <S.UploadDocButton>
                                          <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) =>
                                                      uploadFile({
                                                            target: e.target,
                                                      })
                                                }
                                                multiple
                                          />
                                          + Adicionar PDF
                                    </S.UploadDocButton>
                              </S.Card>

                              {/* Ações */}
                              <S.Card>
                                    <S.ActionButtons>
                                          <S.SubmitButton
                                                onClick={updatePatient}
                                                disabled={isSubmitting}
                                          >
                                                {isSubmitting
                                                      ? "Salvando..."
                                                      : "✓ Salvar Alterações"}
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

                                          <S.SecondaryButton
                                                onClick={() =>
                                                      history.push(
                                                            `/evolution/relatory/${patient.id}`,
                                                      )
                                                }
                                                style={{ marginTop: 8 }}
                                          >
                                                Ver Evoluções →
                                          </S.SecondaryButton>
                                    </S.ActionButtons>
                              </S.Card>
                        </S.Sidebar>
                  </S.ContentGrid>
            </S.Container>
      );
};

export default PatientEdit;
