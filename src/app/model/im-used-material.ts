export default class IMUsedMaterial {
  id: number;
  name: string;
  manufacturer: string;
  price: number;
  maintenanceId: number;
  quantity: number;
  type: number;

  public static getType(type:number):string {
    switch (type) {
      case 0: return 'قطعه';
      case 1: return 'مایع';
      case 2: return 'گاز';
      case 3: return 'جامد';
    }
  }

  public static getTypeUnit(type: number) {
    switch (type) {
      case 0: return 'تعداد';
      case 1: return 'لیتر';
      case 2: return 'لیتر';
      case 3: return 'گرم';
    }
  }
}
