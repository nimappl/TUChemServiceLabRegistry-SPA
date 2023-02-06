export default class Person {
  id: number;
  nationalNumber: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  gender: number;
  customerId: number;
  type: number;
  username: string;
  password: string;

  setPersonInfo(person: Person): void {
    this.id = person.id;
    this.nationalNumber = person.nationalNumber;
    this.firstName = person.firstName;
    this.lastName = person.lastName;
    this.phoneNumber = person.phoneNumber;
    this.gender = person.gender;
    this.customerId = person.customerId;
    this.email = person.email;
    this.type = person.type;
    this.username = person.username;
    this.password = person.password;
  }
}