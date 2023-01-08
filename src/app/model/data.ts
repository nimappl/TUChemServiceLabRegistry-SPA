import { default as Filter } from "./filter";

export default class Data<T> {
    records: T[];
    filters: Filter[];
    sortBy: string;
    sortType: SortType;
    pageSize: number = 5;
    pageNumber: number = 1;
    count: number;
}

export enum SortType {
    Asc,
    Desc,
}
