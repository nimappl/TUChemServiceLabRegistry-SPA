import Person from "./person";
import Organization from "./organization";

export default class OrgRepresentative extends Person {
  organizations: Array<Organization>;
}
