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

  constructor(data?: Account) {
    if (data) {
      this.id = data.id;
      this.type = data.type;
      this.balance = data.balance;
      this.personCustomerId = data.personCustomerId;
      this.custPerson = data.custPerson;
      this.organizationCustomerId = data.organizationCustomerId;
      this.custOrganization = data.custOrganization;
      this.payments = data.payments;
    } else {
      this.custPerson = new PersonGeneral();
      this.custOrganization = new Organization();
    }
  }

  public getCustomerName(): string {
    if (this.type === 2) return this.custOrganization.name;
    return this.custPerson.firstName + ' ' + this.custPerson.lastName;
  }
}
