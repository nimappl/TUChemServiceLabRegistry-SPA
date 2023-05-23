import {Organization, Person, IMUsedMaterial, Instrument} from "./index";

export default class InstrumentMaintenance {
  id: number;
  title: string;
  date: Date;
  additionalCosts: number;
  totalCost: number;
  invoiceNo:string;
  instrumentId: number;
  instrument: Instrument;
  servicemanId: number;
  serviceman: Person;
  servicingCompanyId: number;
  servicingCompany: Organization;
  description: string;
  usedMaterialList: Array<IMUsedMaterial>;

  public static formatDescription(val: string): string {
    return val.replace(/(\r\n|\r|\n)/g, '<br>')
  }
}
