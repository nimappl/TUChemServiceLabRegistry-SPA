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

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.nationalNumber = data.nationalNumber;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.phoneNumber = data.phoneNumber;
      this.email = data.email;
      this.gender = data.gender;
      this.typeStdn = data.typeStdn;
      this.typeProf = data.typeProf;
      this.typeLab = data.typeLab;
      this.typeOrg = data.typeOrg;
    }
  }

  setPersonInfo(person: Person) {
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
