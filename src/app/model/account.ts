import Person from "./person";
import Organization from "./organization";
import Payment from "./payment";

export default class Account {
  id: number;
  type: number;
  balance: number;
  personCustomerId: number;
  custPerson: Person;
  organizationCustomerId: number;
  custOrganization: Organization;
  payments: Array<Payment>;
}
