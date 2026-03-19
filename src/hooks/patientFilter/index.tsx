import React, {
      createContext,
      useContext,
      useState,
      useCallback,
      useMemo,
      useEffect,
} from "react";
import IPatient from "../../interfaces/IPatient";
import API from "../../services/api";
import useAuth from "../auth";
import { sucess, error as showError, warning } from "../../components/alert";
import {
      IPatientFilterContext,
      IPatientFilters,
      IPaginationState,
} from "./contracts";
import {
      filterPatients,
      calculateTotalPages,
      getPageItems,
      getVisiblePagesArray,
} from "./actions";

const ITEMS_PER_PAGE = 10;

const initialFilters: IPatientFilters = {
      status: "*",
      name: "",
      manager: "",
      dateStart: "",
      dateEnd: "",
};

const initialPagination: IPaginationState = {
      currentPage: 1,
      itemsPerPage: ITEMS_PER_PAGE,
      totalPages: 1,
      totalItems: 0,
};

const PatientFilterContext = createContext<IPatientFilterContext | null>(null);

export const PatientFilterProvider: React.FC<{ children: React.ReactNode }> = ({
      children,
}) => {
      const { userData } = useAuth();

      // Estado dos pacientes
      const [patients, setPatients] = useState<IPatient[]>([]);
      const [filters, setFiltersState] =
            useState<IPatientFilters>(initialFilters);
      const [pagination, setPagination] =
            useState<IPaginationState>(initialPagination);
      const [isLoading, setIsLoading] = useState<boolean>(false);
      const [errorState, setErrorState] = useState<string | null>(null);

      // Pacientes filtrados (memoizado)
      const filteredPatients = useMemo(() => {
            return filterPatients(patients, filters);
      }, [patients, filters]);

      // Atualiza paginação quando pacientes filtrados mudam
      useEffect(() => {
            const totalItems = filteredPatients.length;
            const totalPages = calculateTotalPages(totalItems, ITEMS_PER_PAGE);

            setPagination((prev) => ({
                  ...prev,
                  totalItems,
                  totalPages,
                  // Reseta para página 1 se a página atual ficou inválida
                  currentPage:
                        prev.currentPage > totalPages ? 1 : prev.currentPage,
            }));
      }, [filteredPatients]);

      // Busca pacientes do backend
      const fetchPatients = useCallback(async () => {
            if (!userData?.token) return;

            setIsLoading(true);
            setErrorState(null);

            try {
                  const { data } = await API.get<{ patients: IPatient[] }>(
                        "patient/get/all",
                        {
                              headers: {
                                    Authorization: userData.token,
                              },
                        },
                  );

                  setPatients(data.patients || []);
            } catch (err: any) {
                  const errorMessage =
                        "Erro ao carregar pacientes. Tente novamente.";
                  setErrorState(errorMessage);
                  showError(errorMessage);
            } finally {
                  setIsLoading(false);
            }
      }, [userData?.token]);

      // Define um filtro específico
      const setFilter = useCallback(
            (key: keyof IPatientFilters, value: string) => {
                  setFiltersState((prev) => ({ ...prev, [key]: value }));
                  // Volta para página 1 ao filtrar
                  setPagination((prev) => ({ ...prev, currentPage: 1 }));
            },
            [],
      );

      // Define múltiplos filtros de uma vez
      const setFilters = useCallback((newFilters: IPatientFilters) => {
            setFiltersState((prev) => ({ ...prev, ...newFilters }));
            // Volta para página 1 ao filtrar
            setPagination((prev) => ({ ...prev, currentPage: 1 }));
      }, []);

      // Limpa todos os filtros
      const clearFilters = useCallback(() => {
            setFiltersState(initialFilters);
            setPagination((prev) => ({ ...prev, currentPage: 1 }));
      }, []);

      // Define página atual
      const setPage = useCallback((page: number) => {
            setPagination((prev) => {
                  if (
                        page < 1 ||
                        page > prev.totalPages ||
                        page === prev.currentPage
                  ) {
                        return prev;
                  }
                  return { ...prev, currentPage: page };
            });
      }, []);

      // Próxima página
      const nextPage = useCallback(() => {
            setPagination((prev) => {
                  if (prev.currentPage >= prev.totalPages) return prev;
                  return { ...prev, currentPage: prev.currentPage + 1 };
            });
      }, []);

      // Página anterior
      const prevPage = useCallback(() => {
            setPagination((prev) => {
                  if (prev.currentPage <= 1) return prev;
                  return { ...prev, currentPage: prev.currentPage - 1 };
            });
      }, []);

      // Remove paciente
      const removePatient = useCallback(
            async (id: string): Promise<boolean> => {
                  if (!userData?.token) return false;

                  try {
                        await API.delete("master/patient/delete", {
                              headers: {
                                    Authorization: userData.token,
                              },
                              data: { id },
                        });

                        setPatients((prev) => prev.filter((p) => p.id !== id));
                        sucess("Paciente deletado com sucesso!");
                        return true;
                  } catch (err: any) {
                        if (err?.request?.status === 401) {
                              warning("O usuário está sem permissão.");
                        } else {
                              showError(
                                    "Não foi possível deletar o paciente, tente novamente.",
                              );
                        }
                        return false;
                  }
            },
            [userData?.token],
      );

      // Retorna items da página atual
      const getCurrentPageItems = useCallback((): IPatient[] => {
            return getPageItems(
                  filteredPatients,
                  pagination.currentPage,
                  ITEMS_PER_PAGE,
            );
      }, [filteredPatients, pagination.currentPage]);

      // Retorna páginas visíveis para paginação
      const getVisiblePages = useCallback((): (number | string)[] => {
            return getVisiblePagesArray(
                  pagination.currentPage,
                  pagination.totalPages,
                  5,
            );
      }, [pagination.currentPage, pagination.totalPages]);

      const value: IPatientFilterContext = {
            patients,
            filteredPatients,
            filters,
            pagination,
            isLoading,
            error: errorState,
            setFilter,
            setFilters,
            clearFilters,
            setPage,
            nextPage,
            prevPage,
            fetchPatients,
            removePatient,
            getCurrentPageItems,
            getVisiblePages,
      };

      return (
            <PatientFilterContext.Provider value={value}>
                  {children}
            </PatientFilterContext.Provider>
      );
};

export const usePatientFilter = (): IPatientFilterContext => {
      const context = useContext(PatientFilterContext);

      if (!context) {
            throw new Error(
                  "usePatientFilter deve ser usado dentro de um PatientFilterProvider",
            );
      }

      return context;
};

export default usePatientFilter;
