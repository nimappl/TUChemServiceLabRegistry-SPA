import {TestFeeType} from "./enums/test-fee-type";

export default class TestFee {
  id: number;
  type: TestFeeType;
  amount: number;
  testId: number;
  date: Date;
  step: number;

  constructor(data?: TestFee) {
    if (data) {
      this.id = data.id;
      this.type = data.type;
      this.amount = data.amount;
      this.testId = data.testId;
      this.date = data.date;
      this.step = data.step;
    }
  }

  public static getType(type: number) {
    switch (type) {
      case TestFeeType.perSample: return 'تعداد نمونه';
      case TestFeeType.perTestTime: return 'زمان آزمون (دقیقه)';
    }
  }

  public getTitle(): string {
    return this.amount + ' ریال - ' +
      (this.type === TestFeeType.perTestTime ? 'برحسب زمان آزمون (به ازای هر ' + this.step + ' دقیقه)' : 'برحسب تعداد نمونه');
  }
}
