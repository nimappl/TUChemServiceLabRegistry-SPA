import Person from "./person";
import EduGroup from "./edu-group";
import EduField from "./edu-field";
import Organization from "./organization";

export default class PersonGeneral extends Person {
  labPersonnelCode: string;
  labPost: string;
  labRole: number;
  profPersonnelCode: string;
  profEduGroupId: number;
  profEduGroup: EduGroup;
  profGrantIssueDate: Date;
  profGrantAmount: number;
  profGrantCredibleUntil: Date;
  stdnCode: string;
  stdnEduLevel: number;
  stdnEduFieldId: number;
  stdnEduField: EduField;
  orgRepOrganizations: Array<Organization>;
}