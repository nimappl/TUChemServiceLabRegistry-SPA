export default class TestFee {
  id: number;
  type: number;
  amount: number;
  testId: number;
  date: Date;
  step: number;

  public static getType(type: number) {
    switch (type) {
      case 0: return 'تعداد نمونه';
      case 1: return 'زمان آزمون (دقیقه)';
    }
  }
}
