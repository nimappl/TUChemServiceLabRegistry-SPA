import Test from "./test";
import TestFee from "./test-fee";
import LabPersonnel from "./lab-personnel";
import Customer from "./customer";
import ServiceResultFile from "./service-result-file";
import Discount from "./discount";
import Payment from "./payment";

export default class Service {
  id: number;
  date: Date;
  sampleQuantity: number;
  testTime: number;
  price: number;
  hasSamplePrep: any;
  test: Test;
  testFee: TestFee;
  servingPersonnel: LabPersonnel;
  customer: Customer;
  settlementStatus: any;
  resultFiles: Array<ServiceResultFile>;
  discounts: Array<Discount>;
  payments: Array<Payment>;
  considerations: string;
}