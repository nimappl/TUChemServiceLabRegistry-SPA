export default class Discount {
  id: number;
  type: number;
  percent: number;
  date: Date;
  minSamples: number;
  name: string;

  constructor(d?: Discount) {
    if (d) {
      this.id = d.id;
      this.type = d.type;
      this.percent = d.percent;
      this.date = d.date;
      this.minSamples = d.minSamples;
      this.name = d.name;
    }
  }

  public getType(): string {
    switch(this.type) {
      case 0: return 'دانشجویان و هیات عملی گروه شیمی دانشگاه تبریز';
      case 1: return 'دانشجویان و هیات عملی دانشگاه تبریز';
      case 2: return `بیش از ${this.minSamples} نمونه`;
      case 3: return 'مشتریان دائمی';
      case 4:
        let title = this.name;
        if (this.minSamples) title += `، بیش از ${this.minSamples} نمونه`;
        return title;
    }
  }
}
