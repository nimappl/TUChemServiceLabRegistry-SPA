export class DateConvertor {

  public static monthName = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

  public static jalaliToGeorgian(jy:number, jm:number, jd:number): string {
    let sal_a, gy, gm, gd, days;
    jy += 1595;
    days = -355668 + (365 * jy) + (~~(jy / 33) * 8) + ~~(((jy % 33) + 3) / 4) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
    gy = 400 * ~~(days / 146097);
    days %= 146097;
    if (days > 36524) {
      gy += 100 * ~~(--days / 36524);
      days %= 36524;
      if (days >= 365) days++;
    }
    gy += 4 * ~~(days / 1461);
    days %= 1461;
    if (days > 365) {
      gy += ~~((days - 1) / 365);
      days = (days - 1) % 365;
    }
    gd = days + 1;
    sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];

    gm = gm < 10 ? `0${gm}` : gm;
    gd = gd < 10 ? `0${gd}` : gd;
    return `${gy}-${gm}-${gd}`;
  }

  public static georgianToJalali(gdate: string): {year: number, month: number, day: number} {
    let gy = Number(gdate.slice(0, 4)), gm = Number(gdate.slice(5, 7)), gd = Number(gdate.slice(8, 10));
    let g_d_m, jy, jm, jd, gy2, days;
    g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    gy2 = (gm > 2) ? (gy + 1) : gy;
    days = 355666 + (365 * gy) + ~~((gy2 + 3) / 4) - ~~((gy2 + 99) / 100) + ~~((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
    jy = -1595 + (33 * ~~(days / 12053));
    days %= 12053;
    jy += 4 * ~~(days / 1461);
    days %= 1461;
    if (days > 365) {
      jy += ~~((days - 1) / 365);
      days = (days - 1) % 365;
    }
    if (days < 186) {
      jm = 1 + ~~(days / 31);
      jd = 1 + (days % 31);
    } else {
      jm = 7 + ~~((days - 186) / 30);
      jd = 1 + ((days - 186) % 30);
    }

    return {year: jy, month: jm, day: jd};
  }

  public static dateStringToJalali(date: string) {
    if (date) {
      let jalali = this.georgianToJalali(date);
      return `${jalali.year}/${jalali.month}/${jalali.day}`;
    }
  }
}