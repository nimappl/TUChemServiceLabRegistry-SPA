import {Data} from "../model";

export class CustomFieldData {
    label: string;
    selectedValue: any = null;
    options: Array<{value: number, title: string, fieldValue?: string}> = [];
    loading: boolean = false;
    loadingFailed: boolean = false;
    searchText: string = '';
}
