import PersonGeneral from "./person-general";
import Organization from "./organization";
import Payment from "./payment";
import {CustomerType} from "./enums/customer-type";

export default class Account {
  id: number;
  type: CustomerType;
  balance: number;
  personCustomerId: number;
  custPerson: PersonGeneral;
  organizationCustomerId: number;
  custOrganization: Organization;
  payments: Array<Payment>;

  constructor() {
    this.custPerson = new PersonGeneral();
    this.custOrganization = new Organization();
  }
}
