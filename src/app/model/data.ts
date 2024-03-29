import Filter from "./filter";

export default class Data<T> {
    records: Array<T> = [];
    filters: Array<Filter> = [];
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
