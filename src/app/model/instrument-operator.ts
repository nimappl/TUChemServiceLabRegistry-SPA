import Person from "./person";
import Instrument from "./instrument";

export default class InstrumentOperator extends Person {
  designationDate: Date;
  type: number;
  instruments: Array<Instrument>;

  public static getType(type: number): string {
    switch (type) {
      case 0: return 'دائم';
      case 1: return 'موقت';
    }
  }
}
