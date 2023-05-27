export default class Person {
  id: number;
  nationalNumber: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  gender: number;
  typeStdn: boolean = false;
  typeProf: boolean = false;
  typeLab: boolean = false;
  typeOrg: boolean = false;

  setPersonInfo(person: Person): void {
    this.id = person.id;
    this.nationalNumber = person.nationalNumber;
    this.firstName = person.firstName;
    this.lastName = person.lastName;
    this.phoneNumber = person.phoneNumber;
    this.gender = person.gender;
    this.email = person.email;
    this.typeStdn = person.typeStdn;
    this.typeProf = person.typeProf;
    this.typeLab = person.typeLab;
    this.typeOrg = person.typeOrg;
  }
}
