import {CustomerType} from "./enums/customer-type";

export default class CustomerCandidate {
  public type: CustomerType;
  public id: number;
  public name: string;
  public typeStdn: boolean;
  public typeProf: boolean;
  public typeOrg: boolean;
  public stdnEduGroup: string;
  public profEduGroup: string;
  public hasContract: boolean;
}
