import Person from "./person";
import EduGroup from "./edu-group";

export default class TUProfessor extends Person {
  personnelCode: string;
  eduGroupId: number;
  eduGroup: EduGroup;
  grantIssueDate: Date;
  grantAmount: number;
  grantCredibleUntil: Date;
}
