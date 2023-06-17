import Test from "./test";
import TestFee from "./test-fee";
import LabPersonnel from "./lab-personnel";
import Account from "./account";
import ServiceResultFile from "./service-result-file";
import Discount from "./discount";
import TestPrep from "./test-prep";
import {TestFeeType} from "./enums/test-fee-type";

export default class Service {
  public id: number;
  public date: Date;
  public sampleQuantity: number;
  public testTime: number;
  public additionalCosts: number;
  public totalPrice: number;
  public testId: number;
  public test: Test;
  public testFeeId: number;
  public testFee: TestFee;
  public testPreps: Array<TestPrep>;
  public servingPersonnelId: number;
  public servingPersonnel: LabPersonnel;
  public customerAccountId: number;
  public customerAccount: Account;
  public resultFiles: Array<ServiceResultFile>;
  public discounts: Array<Discount>;
  public considerations: string;

  constructor(data?: Service) {
    if (data) {
      this.id = data.id;
      this.date = data.date;
      this.sampleQuantity = data.sampleQuantity;
      this.testTime = data.testTime;
      this.additionalCosts = data.additionalCosts;
      this.totalPrice = data.totalPrice;
      this.testId = data.testId;
      this.test = data.test;
      this.testFeeId = data.testFeeId
      this.testFee = data.testFee;
      this.testPreps = data.testPreps;
      this.servingPersonnelId = data.servingPersonnelId;
      this.servingPersonnel = data.servingPersonnel;
      this.customerAccountId = data.customerAccountId;
      this.customerAccount = data.customerAccount;
      this.resultFiles = data.resultFiles;
      this.discounts = data.discounts;
      this.considerations = data.considerations;
    }

    if (!this.customerAccount) this.customerAccount = new Account();
    if (!this.discounts) this.discounts = [];
    if (!this.resultFiles) this.resultFiles = [];
    if (!this.testPreps) this.testPreps = [];
  }

  public normalizeTestTime(): void {
    if (this.testTime && (this.testTime % this.testFee.step !== 0) ) {
      let frag = this.testFee.step - (this.testTime % this.testFee.step);
      this.testTime = this.testTime + frag;
    }
  }

  public calculateTotalPrice(): void {
    let cost: number = 0;
    if (this.testFee) {
      if (this.testFee.type == TestFeeType.perSample && this.sampleQuantity) {
        cost = this.testFee.amount * this.sampleQuantity;
      } else if (this.testFee.type == TestFeeType.perTestTime && this.testTime) {
        cost = this.testFee.amount * Math.ceil(this.testTime / this.testFee.step);
      }
    }
    if (this.testPreps) this.testPreps.forEach(tp => cost += tp.price);
    if (this.additionalCosts) cost += this.additionalCosts;
    if (this.discounts) {
      let totalDiscount: number = 0;
      this.discounts.forEach(d => totalDiscount += d.percent);
      if (totalDiscount !== 0) cost -= Math.ceil(cost * totalDiscount / 100);
    }
    this.totalPrice = cost;
  }

  public getTotalDiscount(): number {
    let total = 0;
    this.discounts.forEach(discount => total += discount.percent);
    return total;
  }

  public getSamplePrepTotal(): number {
    let total = 0;
    this.testPreps.forEach(prep => total += prep.price);
    return total;
  }
}
