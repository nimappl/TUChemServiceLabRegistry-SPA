import Person from "./person";
import EduGroup from "./edu-group";

export default class TUProfessor extends Person {
  personnelCode: string;
  eduGroupId: number;
  eduGroup: EduGroup;
  grantBalance: number;


  constructor(data?: TUProfessor) {
    if (data) {
      super(data);
      this.personnelCode = data.personnelCode;
      this.eduGroupId = data.eduGroupId;
      this.eduGroup = data.eduGroup;
      this.grantBalance = data.grantBalance;
    }
  }

  public getGrantStatus(): string {
    if (this.grantBalance > 0) return 'بدهکار';
    if (this.grantBalance < 0) return 'بستانکار';
    return 'تسویه';
  }
}
