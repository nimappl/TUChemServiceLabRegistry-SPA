export default class TPayment {
  id: number;
  type: number;
  date: Date;
  amount: number;
  customerName: string;


  constructor(data?: TPayment) {
    if (data) {
      this.id = data.id;
      this.type = data.type;
      this.date = data.date;
      this.amount = data.amount;
      this.customerName = data.customerName;
    }
  }

  public getType() {
    switch (this.type) {
      case 0: return 'نقدی';
      case 1: return 'گرنت اساتید';
      case 2: return 'اعتبار شبکه آزمایشگاهی';
    }
  }
}
