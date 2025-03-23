export default {
  title: 'پرداخت ها',
  list: {
    title: 'لیست پرداخت ها',
    addPayment: 'افزودن پرداخت',
    noPayments: 'هیچ پرداختی یافت نشد',
    searchCustomers: 'جستجوی مشتریان',
    selectCustomer: 'انتخاب مشتری',
    transactionType: 'نوع تراکنش',
    allTransactions: 'همه',
    invoicesOnly: 'فاکتورها',
    paymentsOnly: 'پرداخت‌ها',
    columns: {
      id: 'شناسه',
      date: 'تاریخ',
      customer: 'مشتری', 
      amount: 'مبلغ',
      status: 'وضعیت',
      referenceNo: 'شماره مرجع',
      balance: 'مانده حساب',
      type: 'نوع',
      actions: 'عملیات'
    },
    types: {
      invoice: 'فاکتور',
      payment: 'پرداخت'
    },
    loading: 'در حال بارگیری...',
    loadingPayments: 'در حال بارگیری تراکنش‌ها...'
  },
  search: {
    title: 'جستجوی مشتریان',
    placeholder: 'جستجوی مشتری با نام، ایمیل یا شماره تماس',
    error: 'خطا در جستجو',
    noResults: 'هیچ مشتری یافت نشد',
    results: 'نتایج جستجو',
    startSearching: 'برای جستجوی مشتری، اطلاعات را وارد کنید',
    minChars: 'حداقل ۳ کاراکتر وارد کنید',
    columns: {
      name: 'نام مشتری',
      email: 'ایمیل',
      phone: 'شماره تماس',
      actions: 'عملیات'
    }
  },
  actions: {
    pay: 'پرداخت'
  },
  form: {
    searchCustomer: 'جستجوی مشتری',
    searchPlaceholder: 'نام، ایمیل یا شماره تماس مشتری را وارد کنید',
    selectedCustomer: 'مشتری انتخاب شده',
    amount: 'مبلغ',
    paymentMethod: 'روش پرداخت',
    date: 'تاریخ پرداخت',
    notes: 'یادداشت',
    error: 'خطا در پرداخت',
    selectCustomer: 'لطفا ابتدا مشتری را انتخاب کنید',
    success: 'پرداخت با موفقیت ثبت شد'
  },
  methods: {
    cash: 'نقدی',
    card: 'کارت',
    bank: 'انتقال بانکی'
  },
  status: {
    completed: 'تکمیل شده',
    pending: 'در انتظار',
    failed: 'ناموفق'
  },
  edit: {
    title: 'ویرایش پرداخت'
  },
  create: {
    title: 'پرداخت جدید'
  },
  depositTo: {
    title: 'واریز به',
    cash: 'نقدی',
    bank: 'انتقال بانکی'
  },
  common: {
    list: 'پ',
    select: 'انتخاب کنید...',
    clear: 'پاک کردن',
    save: 'ذخیره',
    cancel: 'لغو',
    view: 'نمایش',
    submitting: 'در حال ثبت...'
  },
  receive: {
    title: 'دریافت پرداخت',
    customerInfo: 'اطلاعات مشتری',
    summary: 'خلاصه',
    openBalance: 'مانده باز',
    overduePayment: 'پرداخت معوق',
    transactionList: 'لیست تراکنش‌ها',
    serviceDetails: 'جزئیات سرویس',
    quickbooksBalance: 'QuickBooks',
    package: 'پکیج',
    price: 'قیمت',
    startDate: 'تاریخ شروع',
    endDate: 'تاریخ پایان',
    addService: 'افزودن سرویس',
    cancelService: 'لغو سرویس',
    startNextService: 'شروع سرویس بعدی',
    status: 'وضعیت',
    active: 'فعال',
    inactive: 'غیرفعال',
    suspended: 'معلق',
    changeStatus: 'تغییر وضعیت',
    customerName: 'نام مشتری',
    customerId: 'شناسه مشتری',
    paymentDate: 'تاریخ پرداخت',
    referenceNo: 'شماره مرجع',
    depositTo: 'واریز به',
    amount: 'مبلغ',
    paidAmount: 'مبلغ پرداخت شده',
    packageNo: 'شماره پکیج',
    memo: 'یادداشت',
    saveAndPrint: 'ذخیره و چاپ',
    saveAndClose: 'ذخیره و بستن',
    selectDepositAccount: 'انتخاب حساب واریز',
    usageStats: {
      used: 'استفاده شده',
      remaining: 'باقی مانده'
    },
    devices: 'دستگاه‌ها',
    quantity: 'تعداد',
    unitPrice: 'قیمت واحد',
    totalAmount: 'مبلغ کل',
    deviceDetails: 'جزئیات دستگاه',
    servicePayment: 'پرداخت سرویس',
    devicePayment: 'پرداخت دستگاه',
    paymentHistory: 'تاریخچه پرداخت',
    totalToBePaid: 'مجموع برای پرداخت',
    remainingBalance: 'مانده حساب'
  }
}