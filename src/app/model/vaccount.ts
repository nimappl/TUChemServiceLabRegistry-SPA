import {CustomerType} from "./enums/customer-type";

export default class VAccount {
  id: number;
  type: CustomerType;
  balance: number;
  customerName: string;
  nationalNumber: string;
  personCustomerId: number;
  organizationCustomerId: number;
}
