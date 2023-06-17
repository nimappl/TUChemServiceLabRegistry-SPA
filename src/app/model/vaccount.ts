import {CustomerType} from "./enums/customer-type";

export default class VAccount {
  id: number;
  type: CustomerType;
  balance: number;
  customerName: string;
  nationalNumber: string;
  personCustomerId: number;
  organizationCustomerId: number;

  constructor(data?: VAccount) {
    if (data) {
    this.id = data.id;
    this.type = data.type;
    this.balance = data.balance;
    this.customerName = data.customerName;
    this.nationalNumber = data.nationalNumber;
    this.personCustomerId = data.personCustomerId;
    this.organizationCustomerId = data.organizationCustomerId;
    }
  }

  public getStatus(): string {
    if (this.balance > 0) return 'بدهکار';
    if (this.balance < 0) return 'بستانکار';
    return 'تسویه';
  }
}
