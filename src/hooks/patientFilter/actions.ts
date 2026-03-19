import IPatient from "../../interfaces/IPatient";
import { IPatientFilters } from "./contracts";

/**
 * Filtra pacientes baseado nos filtros aplicados
 */
export const filterPatients = (
      patients: IPatient[],
      filters: IPatientFilters,
): IPatient[] => {
      return patients.filter((patient) => {
            // Filtro por status
            if (filters.status && filters.status !== "*") {
                  if (
                        !patient.status
                              ?.toLowerCase()
                              .includes(filters.status.toLowerCase())
                  ) {
                        return false;
                  }
            }

            // Filtro por nome do paciente
            if (filters.name && filters.name.trim() !== "") {
                  if (
                        !patient.name
                              ?.toLowerCase()
                              .includes(filters.name.toLowerCase())
                  ) {
                        return false;
                  }
            }

            // Filtro por nome do gerente/responsável
            if (filters.manager && filters.manager.trim() !== "") {
                  if (
                        !patient.managers_name
                              ?.toLowerCase()
                              .includes(filters.manager.toLowerCase())
                  ) {
                        return false;
                  }
            }

            // Filtro por data início (created_at >= dateStart)
            if (filters.dateStart) {
                  const createdAt = patient.created_at?.slice(0, 10);
                  if (createdAt && createdAt < filters.dateStart) {
                        return false;
                  }
            }

            // Filtro por data fim (created_at <= dateEnd)
            if (filters.dateEnd) {
                  const createdAt = patient.created_at?.slice(0, 10);
                  if (createdAt && createdAt > filters.dateEnd) {
                        return false;
                  }
            }

            return true;
      });
};

/**
 * Calcula o total de páginas baseado no número de items e items por página
 */
export const calculateTotalPages = (
      totalItems: number,
      itemsPerPage: number,
): number => {
      return Math.max(1, Math.ceil(totalItems / itemsPerPage));
};

/**
 * Retorna os items da página atual
 */
export const getPageItems = <T>(
      items: T[],
      currentPage: number,
      itemsPerPage: number,
): T[] => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return items.slice(startIndex, endIndex);
};

/**
 * Gera array de páginas visíveis para paginação inteligente
 * Mostra no máximo 7 elementos: primeira, última e 5 ao redor da atual
 */
export const getVisiblePagesArray = (
      currentPage: number,
      totalPages: number,
      maxVisible: number = 5,
): (number | string)[] => {
      if (totalPages <= maxVisible + 2) {
            // Mostra todas as páginas se couber
            return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      const pages: (number | string)[] = [];
      const halfVisible = Math.floor(maxVisible / 2);

      // Sempre mostra a primeira página
      pages.push(1);

      // Calcula o range de páginas ao redor da atual
      let startPage = Math.max(2, currentPage - halfVisible);
      let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

      // Ajusta se estiver muito perto do início
      if (currentPage <= halfVisible + 1) {
            endPage = Math.min(totalPages - 1, maxVisible);
      }

      // Ajusta se estiver muito perto do fim
      if (currentPage >= totalPages - halfVisible) {
            startPage = Math.max(2, totalPages - maxVisible + 1);
      }

      // Adiciona ellipsis antes se necessário
      if (startPage > 2) {
            pages.push("...");
      }

      // Adiciona páginas do meio
      for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
      }

      // Adiciona ellipsis depois se necessário
      if (endPage < totalPages - 1) {
            pages.push("...");
      }

      // Sempre mostra a última página
      if (totalPages > 1) {
            pages.push(totalPages);
      }

      return pages;
};
