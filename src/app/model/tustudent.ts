import Person from "./person";
import EduField from "./edu-field";

export default class TUStudent extends Person {
  stCode: string;
  level: number;
  eduFieldId: number;
  eduField: EduField;

  public static getLevel(field: number): string {
    switch (field) {
      case 0: return 'کاردانی';
      case 1: return 'کارشناسی';
      case 2: return 'کارشناسی ارشد';
      case 3: return 'دکتری';
    }
  }
}
