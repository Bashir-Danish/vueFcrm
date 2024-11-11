declare module '@persian-tools/persian-date' {
  class PersianDate {
    constructor(date?: Date | number | string);
    format(format: string): string;
    toDate(): Date;
  }
  export default PersianDate;
}