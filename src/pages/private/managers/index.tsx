/* eslint-disable react-hooks/exhaustive-deps */
/*Import important.*/
import React, { useEffect, useState } from "react";
/*Relative imports like components and style.*/
import * as S from "./styles";
import { ReactComponent as EyeClose } from "../../../assets/icons/eyeclose.svg";
import { ReactComponent as Save } from "../../../assets/save.svg";
import useAuth from "../../../hooks/auth";
import API from "../../../services/api";

interface IPersons {
	id?: string;
	email: string;
	name: string;
	password: string;
	rank: string;
}

const Managers: React.FC = () => {
	const { userData } = useAuth();

	const [createNewUser, setCreateNewUser] = useState<boolean>(false);
	const [NewEmail, setNewUserEmail] = useState<string | undefined>();
	const [newUserName, setNewUserName] = useState<string | undefined>();
	const [NewUserPassword, setNewUserPassword] = useState<string | undefined>();
	const [NewUserRank, setNewUserRank] = useState<string>("operador");

	const [page, setPage] = useState<number>(1);
	const [limitPage, setLimitPage] = useState<number>(0);
	const [people, setPeople] = useState<Array<IPersons> | null>(null);
	const [managerEdition, setManagerEdition] = useState<IPersons | null>(null);

	const removeManager = (id: string) => {
		if (!people) return null;

		API.delete("master/managers/delete", {
			headers: {
				Authorization: userData!.token,
			},
			data: {
				id: id,
			},
		})
			.then((e) => {
				setPeople((F) => {
					if (F === null || undefined) return null;

					F.forEach((patient, k) => {
						if (patient.id!.includes(id)) {
							F.splice(k, 1);
						}
					});

					return [...F];
				});
				setLimitPage(Math.ceil(people!.length / 10));
				alert("SUCESS MANAGER DELETED");
			})
			.catch((e) => {
				if (e.request.status === 401)
					return alert(
						"ERROR MANAGER NOT DELETED, YOU DON'T HAVE PERMISSION TO DELETE YOU!"
					);
				console.log(e);
				return alert("ERROR MANAGER NOT DELETED, TRY AGAIN!");
			});
	};

	const registerNewUser = async () => {
		if (!NewEmail || !newUserName || !NewUserRank || !NewUserPassword)
			return null;
		const findPosibleUser = people!.filter((f) => {
			return f.email.includes(NewEmail.trim().toLowerCase());
		});

		if (findPosibleUser.length > 0) return alert("User already exits");

		try {
			const {
				data: { manager },
			}: { data: { manager: IPersons } } = await API.post(
				"master/managers/create",
				{
					email: NewEmail.toLowerCase().trim(),
					name: newUserName,
					password: NewUserPassword,
					rank: NewUserRank,
				},
				{
					headers: {
						Authorization: userData!.token,
					},
				}
			);
			setNewUserEmail("");
			setNewUserName("");
			setNewUserPassword("");
			setPeople((F) => {
				if (F === null || undefined) return null;

				return [...F, manager];
			});
			setLimitPage(Math.ceil(people!.length / 10));
		} catch (error) {
			alert("Error Try Again");
		}
	};

	const NewRequest = async () => {
		const {
			data: { managers },
		}: {
			data: {
				managers: IPersons[];
			};
		} = await API.get("master/managers/get/all", {
			headers: {
				Authorization: userData!.token,
			},
		});

		setLimitPage(Math.ceil(managers.length / 10));
		setPeople(managers);
	};

	const setCurrent = ({ index }: { index: number }) => {
		if (index <= 0 || index > limitPage || index === page) return null;

		return setPage(index);
	};

	const updateManager = async (id: string) => {
		alert("Editando");

		await API.put("master/managers/edit", managerEdition, {
			headers: {
				Authorization: userData!.token,
			},
		});

		alert("Sucesso");

		setPeople((F) => {
			if (F === null || undefined) return null;

			F.filter((patient, k) => {
				if (patient.id!.includes(id)) {
					patient = managerEdition!;
				}

				return patient;
			});
			return [...F];
		});

		setManagerEdition(null);
	};

	useEffect(() => {
		NewRequest();
	}, []);

	return (
		<S.ReportStyles>
			<S.Header>
				<h2>Usuários</h2>
				<S.Select onClick={() => setCreateNewUser(!createNewUser)}>
					<S.Plus />
					<S.Text>Adicionar Usuário</S.Text>
				</S.Select>
			</S.Header>

			{people ? (
				<S.Table>
					<thead>
						<th>Email</th>
						<th>Nome do Usúario</th>
						<th>Senha</th>
						<th>Permissão</th>

						<th className="IconTable">
							<EyeClose />
						</th>
					</thead>
					<tbody>
						{createNewUser && (
							<tr>
								<td>
									<input
										className="input"
										value={NewEmail}
										onChange={(e) => setNewUserEmail(e.target.value)}
									/>
									<div className="line" />
								</td>
								<td>
									<input
										className="input"
										value={newUserName}
										onChange={(e) => setNewUserName(e.target.value)}
									/>
									<div className="line" />
								</td>
								<td>
									<input
										className="input"
										value={NewUserPassword}
										onChange={(e) => setNewUserPassword(e.target.value)}
									/>
									<div className="line" />
								</td>
								<td>
									<select
										name="select"
										id="select"
										className="slct"
										defaultValue={0}
										onChange={(e) => setNewUserRank(e.target.value)}
									>
										<option value="operador">operador</option>
										<option value="master">master</option>
									</select>
								</td>
								<td className="IconTable">
									<Save onClick={registerNewUser} />
								</td>
							</tr>
						)}
						{people &&
							people
								.slice(
									Number.parseInt(page.toString() + "0") - 10,
									Number.parseInt(page.toString() + "0")
								)
								.map((ItemBody, index) => {
									if (managerEdition && managerEdition.id === ItemBody.id) {
										return (
											<tr key={index}>
												<td>
													<input
														className="input"
														value={managerEdition.email}
														onChange={(e) =>
															setManagerEdition({
																...managerEdition,
																email: e.target.value,
															})
														}
													/>
												</td>
												<td>
													<input
														className="input"
														value={managerEdition.name}
														onChange={(e) =>
															setManagerEdition({
																...managerEdition,
																name: e.target.value,
															})
														}
													/>
												</td>
												<td>
													<input
														className="input"
														value={managerEdition.password}
														onChange={(e) =>
															setManagerEdition({
																...managerEdition,
																password: e.target.value,
															})
														}
													/>
												</td>
												<td>
													<select
														name="select"
														id="select"
														className="slct"
														value={managerEdition.rank}
														onChange={(e) => {
															setManagerEdition({
																...managerEdition,
																rank: e.target.value,
															});
														}}
													>
														<option value="operador">operador</option>
														<option value="master">master</option>
													</select>
												</td>
												<td className="IconTable">
													<Save
														onClick={() => {
															updateManager(ItemBody.id!);
														}}
													/>
													<S.LixoIcon onClick={() => setManagerEdition(null)} />
												</td>
											</tr>
										);
									}

									return (
										<tr key={index}>
											<td>{ItemBody.email}</td>
											<td>{ItemBody.name}</td>
											<td>{ItemBody.password}</td>
											<td>{ItemBody.rank}</td>
											<td className="IconTable">
												<S.EditIcon
													onClick={() => setManagerEdition(ItemBody)}
												/>
												<S.LixoIcon
													onClick={() => removeManager(ItemBody.id!)}
												/>
											</td>
										</tr>
									);
								})}
					</tbody>
					{people && (
						<S.Indexao>
							<S.IndexaoCard
								backgroundState={"transparent"}
								disable={page - 1 <= 0 ? true : false}
								onClick={() => setCurrent({ index: page - 1 })}
							>
								<S.Arrow color="#52575c" size="12px" direction="left" />
							</S.IndexaoCard>

							{[...Array(limitPage).fill("").keys()].map((i) => {
								return (
									<S.IndexaoCard
										key={i}
										onClick={() => setCurrent({ index: i + 1 })}
										backgroundState={
											page === i + 1 ? "gradient" : "transparent"
										}
									>
										{i + 1}
									</S.IndexaoCard>
								);
							})}

							<S.IndexaoCard
								backgroundState={"transparent"}
								onClick={() => setCurrent({ index: page + 1 })}
								disable={page + 1 > limitPage ? true : false}
							>
								<S.Arrow color="#52575c" size="12px" direction="right" />
							</S.IndexaoCard>
						</S.Indexao>
					)}
				</S.Table>
			) : (
				<h1>Loading...</h1>
			)}
		</S.ReportStyles>
	);
};

export default Managers;
