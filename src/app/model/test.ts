import Instrument from "./instrument";
import TestPrep from "./test-prep";
import TestFee from "./test-fee";
import Discount from "./discount";

export default class Test {
  id: number;
  name: string;
  shortName: string;
  hasPrep: any;
  instrumentId: number;
  instrument: Instrument;
  tActive: any;
  description: string;
  samplePreparations: Array<TestPrep>;
  fees: Array<TestFee>;
  discounts: Array<Discount>;
}