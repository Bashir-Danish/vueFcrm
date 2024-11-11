export default {
  title: 'فاکتورها',
  summary: {
    totalAmount: 'مبلغ کل',
    totalBalance: 'مانده کل',
    paidInvoices: 'فاکتورهای پرداخت شده',
    unpaidInvoices: 'فاکتورهای پرداخت نشده'
  },
  columns: {
    number: 'شماره فاکتور',
    customer: 'مشتری',
    date: 'تاریخ',
    dueDate: 'تاریخ سررسید',
    totalAmount: 'مبلغ کل',
    balance: 'مانده',
    status: {
      paid: 'پرداخت شده',
      partiallyPaid: 'پرداخت جزئی',
      unpaid: 'پرداخت نشده'
    },
    actions: 'عملیات'
  },
  actions: {
    menu: 'باز کردن منو',
    title: 'عملیات',
    view: 'مشاهده فاکتور',
    download: 'دانلود فاکتور',
    pay: 'پرداخت آیتم',
    payFull: 'پرداخت کل فاکتور'
  },
  lineItems: {
    title: 'اقلام فاکتور',
    item: 'کالا',
    details: 'جزئیات',
    quantity: 'تعداد',
    amount: 'مبلغ'
  },
  total: 'جمع کل',
  memo: 'یادداشت',
  noMemo: 'یادداشتی ثبت نشده است',
  noDetails: 'جزئیاتی ثبت نشده است',
  notifications: {
    viewNotImplemented: 'قابلیت مشاهده فاکتور هنوز پیاده‌سازی نشده است.',
    downloadNotImplemented: 'قابلیت دانلود فاکتور هنوز پیاده‌سازی نشده است.'
  },
  search: {
    placeholder: "جستجو بر اساس نام مشتری یا شماره فاکتور...",
    minChars: "لطفا حداقل ۳ کاراکتر برای جستجو وارد کنید",
    loading: "در حال جستجو...",
    noResults: "مشتری یافت نشد",
    startSearching: "جستجو بر اساس نام مشتری یا شماره فاکتور را شروع کنید"
  },
  payment: {
    title: 'پرداخت',
    amount: 'مبلغ',
    payItem: 'پرداخت آیتم',
    payFull: 'پرداخت کامل',
    paidStatus: 'پرداخت شده',
    linePayment: 'پرداخت: {amount} در تاریخ {date}',
    paidAmount: 'مجموع پرداختی: {amount}',
    balanceAmount: 'مانده: {amount}',
    lineSpecific: 'پرداخت آیتم',
    shared: 'پرداخت مشترک',
    success: 'پرداخت موفق',
    successMessage: 'پرداخت {amount} برای {item} با موفقیت انجام شد',
    error: 'خطا در پرداخت',
    invalidAmount: 'لطفا مبلغ معتبر وارد کنید',
    exceedsBalance: 'مبلغ از مانده بیشتر است',
    alreadyPaid: 'این آیتم قبلا پرداخت شده است',
    history: 'تاریخچه پرداخت',
    hoverToSeeDetails: 'برای مشاهده تاریخچه پرداخت نشانگر را نگه دارید'
  }
} 