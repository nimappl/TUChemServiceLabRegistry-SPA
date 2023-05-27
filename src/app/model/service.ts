import Test from "./test";
import TestFee from "./test-fee";
import LabPersonnel from "./lab-personnel";
import Account from "./account";
import ServiceResultFile from "./service-result-file";
import Discount from "./discount";
import TestPrep from "./test-prep";

export default class Service {
  id: number;
  date: Date;
  sampleQuantity: number;
  testTime: number;
  price: number;
  test: Test;
  testFee: TestFee;
  testPreps: Array<TestPrep>;
  servingPersonnel: LabPersonnel;
  customer: Account;
  customerId: number;
  resultFiles: Array<ServiceResultFile>;
  discounts: Array<Discount>;
  considerations: string;
}
