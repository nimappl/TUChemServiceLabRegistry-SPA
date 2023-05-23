import OrgPhoneNumber from "./org-phone-number";
import OrgRepresentative from "./org-representative";

export default class Organization {
  id: number;
  name: string;
  nationalId: string;
  registrationNo: string;
  contractNo: string;
  phoneNumbers: Array<OrgPhoneNumber>;
  representatives: Array<OrgRepresentative>;
  customerId: number;
}
