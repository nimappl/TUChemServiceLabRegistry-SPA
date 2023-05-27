import Instrument from "./instrument";
import Person from "./person";
import Organization from "./organization";
import IMUsedMaterial from "./im-used-material";

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
