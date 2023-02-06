import InstrumentOperator from "./instrument-operator";

export default class Instrument {
  id: number;
  name: string;
  model: string;
  serial: string;
  manufacturer: string;
  madeIn: string;
  serviceable: any;
  operators: Array<InstrumentOperator>
}