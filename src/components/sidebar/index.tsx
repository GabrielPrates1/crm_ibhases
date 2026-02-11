/* eslint-disable react-hooks/exhaustive-deps */
/*important imports.*/
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Hamburger, ContainerMobile } from "./styles";

/*not so important imports.*/
import { ReactComponent as RicChartsIcon } from "../../assets/icons/pichart.svg";
import { ReactComponent as ChartIcon } from "../../assets/icons/chart.svg";
import { ReactComponent as ExitIcon } from "../../assets/icons/exit.svg";
import { ReactComponent as RelatorioIcon } from "../../assets/icons/relatorio.svg";
import { ReactComponent as StethoscopeIcon } from "../../assets/icons/stethoscope.svg";
import { ReactComponent as SignIcon } from "../../assets/icons/dollar-sign.svg";
import { ReactComponent as IbhasesLogo } from "../../assets/logo.svg";
import { TextCard } from "./utils/textCard";
import useAuth from "../../hooks/auth";
/*Button interfaces.*/
interface IButton {
	Route: string;
	Title: string;
	Icon: React.FunctionComponent<
		React.SVGProps<SVGSVGElement> & {
			title?: string | undefined;
		}
	>;
}

/*Link, name, button icon here.*/
const buttons: Array<IButton> = [
	{
		Route: "/",
		Title: "Dashboard",
		Icon: RicChartsIcon,
	},
	{
		Route: "/patient/create",
		Title: "Novo paciente",
		Icon: StethoscopeIcon,
	},
	{
		Route: "/patient/evolution/create",
		Title: "Nova evolução",
		Icon: ChartIcon,
	},
	{
		Route: "/patient/relatory",
		Title: "Relátorios",
		Icon: RelatorioIcon,
	},
];

/*creation of the sidebar component.*/
const Sidebar = ({ mobile = false }): JSX.Element => {
	/*estado do click.*/
	const { logOut, userData } = useAuth();
	const [active, setActive] = useState<boolean>(false);
	const [list, setList] = useState<IButton[]>(buttons);

	const [click, setClick] = useState<Boolean>(false);
	let location = useLocation();

	function handlerClick() {
		return setClick(!click);
	}

	useEffect(() => {
		if (userData?.user_rank === "master") {
			setList((f) => [
				...f,
				{
					Route: "/managers",
					Title: "Usuarios",
					Icon: SignIcon,
				},
			]);
		}
	}, []);

	if (mobile) {
		return (
			<div>
				<Hamburger active={active} onClick={() => setActive(!active)}>
					<span />
				</Hamburger>
				<ContainerMobile active={active}>
					<div>
						<IbhasesLogo className="ibhasesLogo" />
						{list.map(({ Route, Title, Icon }, i) => {
							const DefineSelected = Route === location.pathname ? "#0088B2 " : "#52575C";

							return (
								<div key={i}>
									<TextCard link={Route} Icon={Icon} text={Title} color={DefineSelected} key={i} />
								</div>
							);
						})}
					</div>
					<TextCard Icon={ExitIcon} text="Sair" color="#52575c" onClick={logOut} />
				</ContainerMobile>
			</div>
		);
	}

	return (
		<Container onClick={() => handlerClick()}>
			<div>
				<IbhasesLogo className="ibhasesLogo" />
				{list.map(({ Route, Title, Icon }, i) => {
					const DefineSelected = Route === location.pathname ? "#0088B2 " : "#52575C";

					return (
						<div key={i}>
							<TextCard link={Route} Icon={Icon} text={Title} color={DefineSelected} key={i} />
						</div>
					);
				})}
			</div>

			<TextCard Icon={ExitIcon} text="Sair" color="#52575c" onClick={logOut} />
		</Container>
	);
};

export default Sidebar;
