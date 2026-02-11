/* eslint-disable react-hooks/exhaustive-deps */
// imports
import React, { useEffect, useState } from "react";

import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Area } from "recharts";
import useAuth from "../../hooks/auth";
// import { data } from "../../mock/mockChart";
import API from "../../services/api";
import * as S from "./styles";

const Chart: React.FC = () => {
	const { userData } = useAuth();
	const [data, setData] = useState<any>();

	const callAPI = async () => {
		const request = await API.get("/stats/graph", {
			headers: {
				Authorization: userData!.token,
			},
		});
		setData(request.data.data);
	};

	useEffect(() => {
		callAPI();
	}, []);

	if (!data) {
		return <span>Loading graph...</span>;
	}
	// graphic.
	return (
		<S.ChartStyles>
			<ResponsiveContainer width="98%" height={500}>
				<AreaChart data={data}>
					<defs>
						<linearGradient id="color" x1="0" y1="100" x2="0" y2="1">
							<stop offset="0%" stopColor="#2451B7" stopOpacity={0.4} />
							<stop offset="75%" stopColor="#2451B7" stopOpacity={0.05} />
						</linearGradient>
					</defs>
					<Area dataKey="quantity" stroke="#0088B2" fill="url(#color)" type="monotone" strokeWidth={2} />
					<Area dataKey="active" stroke="#A020F0" fill="url(#color)" type="monotone" strokeWidth={2} />
					<Area dataKey="moved" stroke="#FFFF00" fill="url(#color)" type="monotone" strokeWidth={2} />
					<Area dataKey="finished" stroke="#ff0000" fill="url(#color)" type="monotone" strokeWidth={2} />
					<XAxis dataKey="monthName" />
					<YAxis />
					<CartesianGrid opacity={0.8} vertical={false} />
				</AreaChart>
			</ResponsiveContainer>
		</S.ChartStyles>
	);
};

export default Chart;
