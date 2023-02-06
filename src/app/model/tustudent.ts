import Person from "./person";
import EduField from "./edu-field";

export default class TUStudent extends Person {
  stCode: string;
  eduFieldId: number;
  eduField: EduField;
}