import Person from "./person";
import EduField from "./edu-field";

export default class TUStudent extends Person {
  stCode: string;
  eduLevel: number;
  eduFieldId: number;
  eduField: EduField;

  public static getLevel(level: number): string {
    if (level == null) return '';
    switch (level) {
      case 0: return 'کاردانی';
      case 1: return 'کارشناسی';
      case 2: return 'کارشناسی ارشد';
      case 3: return 'دکتری';
    }
  }
}
