/* eslint-disable react-hooks/exhaustive-deps */
/*Import important.*/
import React, { useEffect, useState } from "react";
/*Relative imports like components and style.*/
import { PatientEvolu, Patient, ProfilePhoto } from "./styles";
/*Image Imports*/
import API from "../../../services/api";
import useAuth from "../../../hooks/auth";

import PDFIcon from "../../../assets/pdf.svg";

import IPatient from "../../../interfaces/IPatient";
import IAttachments from "../../../interfaces/IAttachments";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../../../styles/utils/button";
import moment from "moment";
/*Creation of the PatientEvolution page component.*/

const EvolutionRelatoryShow: React.FC = () => {
  const [patient, setPatient] = useState<IPatient | null>(null);
  const params: { id?: string } = useParams();
  const history = useHistory();
  const [attachments, setAttachments] = useState<IAttachments[] | []>([]);
  const { userData } = useAuth();

  const getUser = async () => {
    if (!params.id) {
      alert("Please inform a params");
      history.goBack();
    }

    try {
      const {
        data: { patient: $patient },
      }: {
        data: {
          patient: IPatient;
        };
      } = await API.get("patient/get/evolution/id", {
        headers: {
          Authorization: userData!.token,
        },
        params: {
          id: params.id!,
        },
      });
      setPatient($patient);
      GetAttachments($patient.id!);
    } catch (error) {
      alert("Error");
    }
  };

  const GetAttachments = async (id: string) => {
    const {
      data: { attachments },
    }: { data: { attachments: IAttachments[] } } = await API.get(
      "patient/get/attachments",
      {
        headers: {
          Authorization: userData!.token,
        },
        params: {
          id: id,
        },
      }
    );

    return setAttachments(attachments);
  };

  const DownloadPDF = async (k: number) => {
    const {
      data: { url },
    }: { data: { url: string } } = await API.get("patient/get/attachment", {
      headers: {
        Authorization: userData!.token,
      },
      params: {
        id: attachments[k].id,
      },
    });

    return window.open(url, "_blank")?.focus();
  };

  const HowManyYears = (day: string) => {
    day = day.slice(0, 10);
    const now = moment(new Date());
    return Math.floor(moment.duration(now.diff(day)).asYears());
  };

  useEffect(() => {
    if (!params.id) {
      alert("Please inform a params");
      history.goBack();
    }

    getUser();
  }, []);

  if (patient === null) {
    return (
      <Patient>
        <h2>Relatório Evolução</h2>
        <span>Carregando...</span>
      </Patient>
    );
  }
  return (
    <Patient>
      {/* Title */}

      <h2>Relatório Evolução</h2>
      {/* Grid */}

      {!patient ? (
        <span>
          Relatório não localizado, porfavor tente novamente, caso o erro
          persistir entre em contato com o time de desenvolvimento
        </span>
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
              <option value="Casa de Apoio">Casa de Apoio</option>
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

            {/*INPUT RG/CPF */}
            <div className="row-column">
              <input
                id="input"
                className="half-input"
                placeholder="RG"
                maxLength={9}
                value={patient!.rg}
                disabled
              />

              <input
                id="input"
                className="half-input"
                placeholder="CPF"
                maxLength={9}
                value={patient!.cpf}
                disabled
              />
            </div>

            <div className="row-column">
              <select
                id="select"
                className="half-input"
                value={patient!.gender}
                disabled
              >
                <option value="" disabled selected>
                  Gênero
                </option>
                <option value="female">Feminino </option>
                <option value="male">Masculino</option>
              </select>

              <input
                id="input"
                className="half-input"
                placeholder="Idade"
                maxLength={9}
                value={patient.birthday ? HowManyYears(patient.birthday) : ""}
                disabled
              />
            </div>
            <div className="row-column">
              <input
                id="input"
                className="half-input"
                placeholder="CEP"
                maxLength={9}
                value={patient!.cep}
                disabled
              />
              <input
                id="input"
                className="half-input"
                placeholder="UF"
                maxLength={9}
                value={patient!.uf}
                disabled
              />
            </div>
            <div className="row-column">
              <input
                id="input"
                className="half-input"
                placeholder="Cidade"
                maxLength={9}
                value={patient!.city}
                disabled
              />
              <input
                type={"number"}
                id="input"
                className="half-input"
                placeholder="Nº"
                maxLength={9}
                value={patient!.number_house}
                disabled
              />
            </div>
            <input
              id="input"
              className="inputName"
              placeholder="Logradouro"
              value={patient!.street}
              disabled
            />

            <div className="row-column">
              <select
                id="select"
                className="half-input"
                value={patient!.progress_type}
                disabled
              >
                <option value="" disabled selected>
                  Tipo de Evolução
                </option>
                <option value="psicologo">Psicólogo</option>
                <option value="monitoria">Monitoria</option>
                <option value="assistente social">Assistente Social</option>
              </select>

              <select
                id="select"
                className="half-input"
                value={patient!.status}
                disabled
              >
                <option value="" disabled selected>
                  Status
                </option>
                <option value="ativo">Ativo</option>
                <option value="transferido">Transferido</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>
            <textarea
              id="input"
              className="inputDesc"
              placeholder="Descrição"
              style={{ padding: 10, resize: "vertical" }}
              value={patient.description}
              disabled
            />

            <div className="check-button">
              <Button style={{ width: 300 }} onClick={() => history.goBack()}>
                Voltar
              </Button>
            </div>
          </PatientEvolu>
          <ProfilePhoto>
            <div>
              {/* <Profile /> */}
              <img
                className="imgProfile"
                src={patient!.profile_photo}
                alt="..."
              />
            </div>
            <div className="docBox">
              <div className="subBox">
                <span className="docText"> Documentos </span>
                <div className="line" />
              </div>
              <div className="FragmentsPDF">
                {attachments &&
                  attachments.map((f, k) => {
                    return (
                      <div
                        className="fragmentPDF"
                        key={k}
                        onClick={() => DownloadPDF(k)}
                        style={{ cursor: "pointer" }}
                      >
                        <img src={PDFIcon} alt="" />
                        <span>{f.name}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </ProfilePhoto>
        </div>
      )}
    </Patient>
  );
};

export default EvolutionRelatoryShow;
