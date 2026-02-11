/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { DashboardStyles, Cards, Card, Relatory } from "./styles";
import Chart from "../../../components/chart";
import API from "../../../services/api";
import useAuth from "../../../hooks/auth";
interface IRequestData {
	patients: number;
	active: number;
	moved: number;
	finished: number;
}
interface IDataCard {
	count: number;
	color: string;
	text: string;
}

const Dashboard: React.FC = () => {
	const { userData } = useAuth();
	const [cardData, setCardData] = React.useState<IDataCard[]>();

	const CardStats = async () => {
		const { data }: { data: IRequestData } = await API.get("stats/home", {
			headers: {
				Authorization: userData!.token,
			},
		});

		setCardData([
			{
				color: "#0088B2",
				text: "Pacientes Total",
				count: data.patients,
			},
			{
				color: "#A020F0",
				text: "Pacientes Ativos",
				count: data.active,
			},
			{
				color: "#FFFF00",
				text: "Pacientes Transferidos",
				count: data.moved,
			},
			{
				color: "#ff0000",
				text: "Pacientes Finalizados",
				count: data.finished,
			},
		]);
	};

	useEffect(() => {
		CardStats();
	}, []);

	return (
		<DashboardStyles>
			<Cards>
				{cardData &&
					cardData.map((F, K) => {
						return (
							<Card key={K}>
								<div className="Line" style={{ background: F.color }} />
								<div className="infoCard">
									<span className="title">{F.text}</span>
									<span className="value">{F.count}</span>
								</div>
							</Card>
						);
					})}
			</Cards>
			<Relatory>
				<span className="title">Relatório Geral</span>
				<Chart />
			</Relatory>
		</DashboardStyles>
	);
};

export default Dashboard;
