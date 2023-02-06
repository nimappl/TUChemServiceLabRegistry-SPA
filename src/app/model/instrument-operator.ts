import Instrument from "./instrument";
import Person from "./person";

export default class InstrumentOperator extends Person {
  designationDate: Date;
  type: number;
  instruments: Array<Instrument>;
}