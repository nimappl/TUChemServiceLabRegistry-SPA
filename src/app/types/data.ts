import { Filter } from "./filter";

export class Data<T> {
    data: T[];
    filters: Filter[];
    sortBy: string;
    sortType: SortType;
    pageSize: number;
    pageNumber: number;
    count: number;
}

export enum SortType {
    Asc,
    Desc,
}
