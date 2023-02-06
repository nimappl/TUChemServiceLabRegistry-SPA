import Person from "./person";
import Organization from "./organization";

export default class Customer {
  id: number;
  type: number;
  balance: number;
  person: Person;
  organization: Organization;
}