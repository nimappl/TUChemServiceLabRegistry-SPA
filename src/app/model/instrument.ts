import InstrumentOperator from "./instrument-operator";

export default class Instrument {
  id: number;
  name: string;
  model: string;
  serial: string;
  manufacturer: string;
  madeIn: string;
  serviceable: boolean;
  operators: Array<InstrumentOperator>

  public static getServiceability(value: boolean): string {
    switch(value) {
      case false: return 'غیرقابل استفاده';
      case true: return 'آماده سرویس‌دهی';
    }
  }
}
