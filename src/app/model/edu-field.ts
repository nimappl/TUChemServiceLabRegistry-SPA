import EduGroup from "./edu-group";

export default class EduField {
  id: number;
  name: string;
  fieldLevel: number;
  eduGroupId: number;
  eduGroup: EduGroup;

  public static getFieldLevel(field: number): string {
    switch (field) {
      case 0: return 'کاردانی';
      case 1: return 'کارشناسی';
      case 2: return 'کارشناسی ارشد';
      case 3: return 'دکتری';
    }
  }
}
