import {Observable} from "rxjs";
import {Data} from "../model";
import {InstrumentService} from "../services/instrument.service";

export class CustomFieldData {
    label: string;
    selectedValue: any = null;
    options: Array<{value: number, title: string}> = [];
    loading: boolean = false;
    loadingFailed: boolean = false;
    invalid: boolean = false;
}
