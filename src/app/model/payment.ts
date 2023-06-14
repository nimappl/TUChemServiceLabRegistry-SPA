import Account from "./account";
import TUProfessor from "./tuprofessor";

export default class Payment {
  id: number;
  date: Date;
  type: number;
  amount: number;
  accountId: number;
  labsnetCreditTitle: string;
  labsnetTransactionCode: string;
  cashBasisType: number;
  cashBasisTrackingNo: string;
  grantProfessorId: number;
  grantProfessor: TUProfessor;
  account: Account;

  constructor(data?: Payment) {
    if (data) {
      this.id = data.id;
      this.date = data.date;
      this.date = data.date;
      this.type = data.type;
      this.amount = data.amount;
      this.accountId = data.accountId;
      this.labsnetCreditTitle = data.labsnetCreditTitle;
      this.labsnetTransactionCode = data.labsnetTransactionCode;
      this.cashBasisType = data.cashBasisType;
      this.cashBasisTrackingNo = data.cashBasisTrackingNo;
      this.grantProfessorId = data.grantProfessorId;
      this.grantProfessor = data.grantProfessor;
      this.account = new Account(data.account);
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
