import Instrument from "./instrument";
import IMUsedMaterial from "./im-used-material";
import OrgRepresentative from "./org-representative";

export default class InstrumentMaintenance {
  id: number;
  title: string;
  date: Date;
  cost: number;
  invoiceNo:string;
  instrument: Instrument;
  serviceman: OrgRepresentative;
  description: string;
  usedMaterialList: Array<IMUsedMaterial>;
}