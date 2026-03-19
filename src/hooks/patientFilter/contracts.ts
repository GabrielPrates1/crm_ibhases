import IPatient from "../../interfaces/IPatient";

export interface IPatientFilters {
      status?: string;
      name?: string;
      manager?: string;
      dateStart?: string;
      dateEnd?: string;
}

export interface IPaginationState {
      currentPage: number;
      itemsPerPage: number;
      totalPages: number;
      totalItems: number;
}

export interface IPatientFilterState {
      patients: IPatient[];
      filteredPatients: IPatient[];
      filters: IPatientFilters;
      pagination: IPaginationState;
      isLoading: boolean;
      error: string | null;
}

export interface IPatientFilterActions {
      setFilter: (key: keyof IPatientFilters, value: string) => void;
      setFilters: (filters: IPatientFilters) => void;
      clearFilters: () => void;
      setPage: (page: number) => void;
      nextPage: () => void;
      prevPage: () => void;
      fetchPatients: () => Promise<void>;
      removePatient: (id: string) => Promise<boolean>;
      getCurrentPageItems: () => IPatient[];
      getVisiblePages: () => (number | string)[];
}

export interface IPatientFilterContext
      extends IPatientFilterState,
            IPatientFilterActions {}
