declare module '@persian-tools/persian-date' {
  class PersianDate {
    constructor(date?: Date | number | string);
    format(format: string): string;
    toDate(): Date;
    // Add other methods you use from PersianDate
  }
  export default PersianDate;
}