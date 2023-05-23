export default class Discount {
  id: number;
  type: number;
  typeString: string;
  percent: number;
  date: Date;
  minSamples: number;
  name: string;

  public static getType(type: number): string {
    switch(type) {
      case 0: return 'دانشجویان و هیات عملی گروه شیمی دانشگاه تبریز';
      case 1: return 'دانشجویان و هیات عملی دانشگاه تبریز';
      case 2: return 'تعداد نمونه';
      case 3: return 'مشتریان دائمی';
      case 4: return this.name;
    }
  }
}
