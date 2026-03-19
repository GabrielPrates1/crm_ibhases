/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import * as S from "./styles";
import API from "../../../services/api";
import useAuth from "../../../hooks/auth";
import PDFIcon from "../../../assets/pdf.svg";
import IPatient from "../../../interfaces/IPatient";
import IAttachments from "../../../interfaces/IAttachments";
import { useHistory, useParams } from "react-router-dom";
import NavigationHeader from "../../../components/navigationHeader";
import moment from "moment";

const EvolutionRelatoryShow: React.FC = () => {
      const [patient, setPatient] = useState<IPatient | null>(null);
      const params: { id?: string } = useParams();
      const history = useHistory();
      const [attachments, setAttachments] = useState<IAttachments[]>([]);
      const { userData } = useAuth();

      // Pega info do paciente passada via history state
      const locationState: any = history.location.state || {};
      const patientName =
            locationState.patientName || patient?.name || "Paciente";
      const patientId = locationState.patientId || "";

      const getUser = async () => {
            if (!params.id) {
                  alert("Parâmetro não informado");
                  history.goBack();
                  return;
            }

            try {
                  const {
                        data: { patient: $patient },
                  }: { data: { patient: IPatient } } = await API.get(
                        "patient/get/evolution/id",
                        {
                              headers: { Authorization: userData!.token },
                              params: { id: params.id! },
                        },
                  );
                  setPatient($patient);
                  GetAttachments($patient.id!);
            } catch (error) {
                  console.error("Erro ao carregar evolução:", error);
            }
      };

      const GetAttachments = async (id: string) => {
            try {
                  const {
                        data: { attachments },
                  }: { data: { attachments: IAttachments[] } } = await API.get(
                        "patient/get/attachments",
                        {
                              headers: { Authorization: userData!.token },
                              params: { id },
                        },
                  );
                  setAttachments(attachments || []);
            } catch (error) {
                  console.error("Erro ao carregar anexos:", error);
            }
      };

      const DownloadPDF = async (k: number) => {
            try {
                  const {
                        data: { url },
                  }: { data: { url: string } } = await API.get(
                        "patient/get/attachment",
                        {
                              headers: { Authorization: userData!.token },
                              params: { id: attachments[k].id },
                        },
                  );
                  window.open(url, "_blank")?.focus();
            } catch (error) {
                  console.error("Erro ao baixar anexo:", error);
            }
      };

      const HowManyYears = (day: string) => {
            day = day.slice(0, 10);
            const now = moment(new Date());
            return Math.floor(moment.duration(now.diff(day)).asYears());
      };

      const formatDate = (dateStr?: string | null) => {
            if (!dateStr) return "-";
            return dateStr.slice(0, 10).split("-").reverse().join("/");
      };

      const getGenderLabel = (gender?: string) => {
            if (gender === "male") return "Masculino";
            if (gender === "female") return "Feminino";
            return "-";
      };

      const getStatusLabel = (status?: string) => {
            if (!status) return "-";
            return status.charAt(0).toUpperCase() + status.slice(1);
      };

      const getProgressTypeLabel = (type?: string) => {
            const types: Record<string, string> = {
                  psicologo: "Psicólogo",
                  monitoria: "Monitoria",
                  "assistente social": "Assistente Social",
            };
            return types[type || ""] || type || "-";
      };

      useEffect(() => {
            getUser();
      }, []);

      if (patient === null) {
            return (
                  <S.Container>
                        <NavigationHeader
                              title="Carregando..."
                              backPath="/patient/relatory"
                              breadcrumbs={[
                                    {
                                          label: "Pacientes",
                                          path: "/patient/relatory",
                                    },
                                    { label: "Carregando..." },
                              ]}
                        />
                        <S.LoadingContainer>
                              <span>Carregando evolução...</span>
                        </S.LoadingContainer>
                  </S.Container>
            );
      }

      return (
            <S.Container>
                  {/* Navigation */}
                  <NavigationHeader
                        title="Detalhes da Evolução"
                        backPath={
                              patientId
                                    ? `/evolution/relatory/${patientId}`
                                    : "/patient/relatory"
                        }
                        breadcrumbs={[
                              { label: "Pacientes", path: "/patient/relatory" },
                              {
                                    label: patientName,
                                    path: patientId
                                          ? `/evolution/relatory/${patientId}`
                                          : undefined,
                              },
                              { label: "Detalhes da Evolução" },
                        ]}
                  />

                  {/* Main Content */}
                  <S.ContentGrid>
                        {/* Coluna Principal */}
                        <S.MainColumn>
                              {/* Card: Informações do Paciente */}
                              <S.Card>
                                    <S.CardHeader>
                                          <S.CardTitle>
                                                Informações do Paciente
                                          </S.CardTitle>
                                          <S.StatusBadge
                                                status={
                                                      patient.status || "ativo"
                                                }
                                          >
                                                {getStatusLabel(patient.status)}
                                          </S.StatusBadge>
                                    </S.CardHeader>

                                    <S.InfoGrid>
                                          <S.InfoItem>
                                                <S.InfoLabel>
                                                      Nome Completo
                                                </S.InfoLabel>
                                                <S.InfoValue>
                                                      {patient.name || "-"}
                                                </S.InfoValue>
                                          </S.InfoItem>
                                          <S.InfoItem>
                                                <S.InfoLabel>
                                                      Local do Paciente
                                                </S.InfoLabel>
                                                <S.InfoValue>
                                                      {patient.patient_place ||
                                                            "-"}
                                                </S.InfoValue>
                                          </S.InfoItem>
                                          <S.InfoItem>
                                                <S.InfoLabel>CPF</S.InfoLabel>
                                                <S.InfoValue>
                                                      {patient.cpf || "-"}
                                                </S.InfoValue>
                                          </S.InfoItem>
                                          <S.InfoItem>
                                                <S.InfoLabel>RG</S.InfoLabel>
                                                <S.InfoValue>
                                                      {patient.rg || "-"}
                                                </S.InfoValue>
                                          </S.InfoItem>
                                          <S.InfoItem>
                                                <S.InfoLabel>
                                                      Gênero
                                                </S.InfoLabel>
                                                <S.InfoValue>
                                                      {getGenderLabel(
                                                            patient.gender,
                                                      )}
                                                </S.InfoValue>
                                          </S.InfoItem>
                                          <S.InfoItem>
                                                <S.InfoLabel>Idade</S.InfoLabel>
                                                <S.InfoValue>
                                                      {patient.birthday
                                                            ? `${HowManyYears(
                                                                    patient.birthday,
                                                              )} anos`
                                                            : "-"}
                                                </S.InfoValue>
                                          </S.InfoItem>
                                    </S.InfoGrid>
                              </S.Card>

                              {/* Card: Endereço */}
                              <S.Card>
                                    <S.CardHeader>
                                          <S.CardTitle>Endereço</S.CardTitle>
                                    </S.CardHeader>

                                    <S.InfoGrid>
                                          <S.InfoItem>
                                                <S.InfoLabel>CEP</S.InfoLabel>
                                                <S.InfoValue>
                                                      {patient.cep || "-"}
                                                </S.InfoValue>
                                          </S.InfoItem>
                                          <S.InfoItem>
                                                <S.InfoLabel>UF</S.InfoLabel>
                                                <S.InfoValue>
                                                      {patient.uf || "-"}
                                                </S.InfoValue>
                                          </S.InfoItem>
                                          <S.InfoItem>
                                                <S.InfoLabel>
                                                      Cidade
                                                </S.InfoLabel>
                                                <S.InfoValue>
                                                      {patient.city || "-"}
                                                </S.InfoValue>
                                          </S.InfoItem>
                                          <S.InfoItem>
                                                <S.InfoLabel>
                                                      Número
                                                </S.InfoLabel>
                                                <S.InfoValue>
                                                      {patient.number_house ||
                                                            "-"}
                                                </S.InfoValue>
                                          </S.InfoItem>
                                          <S.InfoItem fullWidth>
                                                <S.InfoLabel>
                                                      Logradouro
                                                </S.InfoLabel>
                                                <S.InfoValue>
                                                      {patient.street || "-"}
                                                </S.InfoValue>
                                          </S.InfoItem>
                                    </S.InfoGrid>
                              </S.Card>

                              {/* Card: Evolução */}
                              <S.Card>
                                    <S.CardHeader>
                                          <S.CardTitle>
                                                Detalhes da Evolução
                                          </S.CardTitle>
                                          <S.TypeBadge>
                                                {getProgressTypeLabel(
                                                      patient.progress_type,
                                                )}
                                          </S.TypeBadge>
                                    </S.CardHeader>

                                    <S.InfoGrid>
                                          <S.InfoItem>
                                                <S.InfoLabel>
                                                      Tipo de Evolução
                                                </S.InfoLabel>
                                                <S.InfoValue>
                                                      {getProgressTypeLabel(
                                                            patient.progress_type,
                                                      )}
                                                </S.InfoValue>
                                          </S.InfoItem>
                                          <S.InfoItem>
                                                <S.InfoLabel>
                                                      Data de Criação
                                                </S.InfoLabel>
                                                <S.InfoValue>
                                                      {formatDate(
                                                            patient.created_at,
                                                      )}
                                                </S.InfoValue>
                                          </S.InfoItem>
                                    </S.InfoGrid>

                                    <S.DescriptionSection>
                                          <S.InfoLabel>Descrição</S.InfoLabel>
                                          <S.DescriptionBox>
                                                {patient.description ||
                                                      "Sem descrição registrada."}
                                          </S.DescriptionBox>
                                    </S.DescriptionSection>
                              </S.Card>
                        </S.MainColumn>

                        {/* Sidebar */}
                        <S.Sidebar>
                              {/* Foto do Paciente */}
                              <S.Card>
                                    <S.ProfileSection>
                                          {patient.profile_photo ? (
                                                <S.ProfileImage
                                                      src={
                                                            patient.profile_photo
                                                      }
                                                      alt={patient.name}
                                                />
                                          ) : (
                                                <S.ProfilePlaceholder>
                                                      {patient.name
                                                            ?.charAt(0)
                                                            .toUpperCase() ||
                                                            "?"}
                                                </S.ProfilePlaceholder>
                                          )}
                                          <S.ProfileName>
                                                {patient.name}
                                          </S.ProfileName>
                                          <S.ProfileSubtext>
                                                {patient.patient_place ||
                                                      "Local não informado"}
                                          </S.ProfileSubtext>
                                    </S.ProfileSection>
                              </S.Card>

                              {/* Documentos */}
                              <S.Card>
                                    <S.CardHeader>
                                          <S.CardTitle>Documentos</S.CardTitle>
                                          <S.DocCount>
                                                {attachments.length}
                                          </S.DocCount>
                                    </S.CardHeader>

                                    <S.DocumentsList>
                                          {attachments.length > 0 ? (
                                                attachments.map(
                                                      (file, index) => (
                                                            <S.DocumentItem
                                                                  key={index}
                                                                  onClick={() =>
                                                                        DownloadPDF(
                                                                              index,
                                                                        )
                                                                  }
                                                            >
                                                                  <img
                                                                        src={
                                                                              PDFIcon
                                                                        }
                                                                        alt="PDF"
                                                                  />
                                                                  <span>
                                                                        {
                                                                              file.name
                                                                        }
                                                                  </span>
                                                            </S.DocumentItem>
                                                      ),
                                                )
                                          ) : (
                                                <S.EmptyDocs>
                                                      Nenhum documento anexado
                                                </S.EmptyDocs>
                                          )}
                                    </S.DocumentsList>
                              </S.Card>

                              {/* Ações */}
                              <S.ActionsCard>
                                    <S.ActionButton
                                          primary
                                          onClick={() =>
                                                history.push(
                                                      patientId
                                                            ? `/evolution/relatory/${patientId}`
                                                            : "/patient/relatory",
                                                )
                                          }
                                    >
                                          Ver Todas Evoluções
                                    </S.ActionButton>
                                    <S.ActionButton
                                          onClick={() =>
                                                history.push(
                                                      "/patient/relatory",
                                                )
                                          }
                                    >
                                          Voltar para Pacientes
                                    </S.ActionButton>
                              </S.ActionsCard>
                        </S.Sidebar>
                  </S.ContentGrid>
            </S.Container>
      );
};

export default EvolutionRelatoryShow;
