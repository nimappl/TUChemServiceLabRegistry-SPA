import Person from "./person";
import EduGroup from "./edu-group";
import EduField from "./edu-field";
import Organization from "./organization";
import LabPersonnel from "./lab-personnel";

export default class PersonGeneral extends Person {
  labPersonnelCode: string;
  labPost: string;
  labRole: number;
  profPersonnelCode: string;
  profEduGroupId: number;
  profEduGroup: EduGroup;
  stdnCode: string;
  stdnEduLevel: number;
  stdnEduFieldId: number;
  stdnEduField: EduField;
  orgRepOrganizations: Array<Organization>;

  constructor(data?: PersonGeneral) {
    if (data) {
      super(data);
      this.labPersonnelCode = data.labPersonnelCode;
      this.labPost = data.labPost;
      this.labRole = data.labRole;
      this.profPersonnelCode = data.profPersonnelCode;
      this.profEduGroupId = data.profEduGroupId;
      this.profEduGroup = data.profEduGroup;
      this.stdnCode = data.stdnCode;
      this.stdnEduLevel = data.stdnEduLevel;
      this.stdnEduFieldId = data.stdnEduFieldId;
      this.stdnEduField = data.stdnEduField;
      this.orgRepOrganizations = data.orgRepOrganizations;
    } else super();
  }

  public asPerson(): Person {
    let person = new Person();
    person.id = this.id;
    person.firstName = this.firstName;
    person.lastName = this.lastName;
    person.phoneNumber = this.phoneNumber;
    person.nationalNumber = this.nationalNumber;
    person.gender = this.gender;
    person.email = this.email;
    person.typeLab = this.typeLab;
    person.typeProf = this.typeProf;
    person.typeStdn = this.typeStdn;
    person.typeOrg = this.typeOrg;
    return person
  }

  public asLabPrsnl(): LabPersonnel {
    let personnel = new LabPersonnel();
    personnel.id = this.id;
    personnel.firstName = this.firstName;
    personnel.lastName = this.lastName;
    personnel.phoneNumber = this.phoneNumber;
    personnel.nationalNumber = this.nationalNumber;
    personnel.gender = this.gender;
    personnel.email = this.email;
    personnel.typeLab = this.typeLab;
    personnel.typeProf = this.typeProf;
    personnel.typeStdn = this.typeStdn;
    personnel.typeOrg = this.typeOrg;
    personnel.personnelCode = this.labPersonnelCode;
    personnel.post = this.labPost;
    personnel.role = this.labRole;
    return personnel;
  }
}
