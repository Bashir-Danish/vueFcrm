export default {
  title: 'لیست اعتبارسنجی',
  sync: {
    title: 'همگام‌سازی',
    noSelection: 'موردی انتخاب نشده',
    selectItems: 'لطفا موارد مورد نظر برای همگام‌سازی را انتخاب کنید',
    success: 'با موفقیت با QuickBooks همگام‌سازی شد',
    completed: 'موارد انتخاب شده با موفقیت همگام‌سازی شدند',
    error: 'خطا در همگام‌سازی',
    failed: 'همگام‌سازی با QuickBooks ناموفق بود',
    pending: 'در انتظار همگام‌سازی',
    manual: 'پردازش دستی',
    resend: 'ارسال مجدد'
  },
  types: {
    all: 'همه',
    device: 'تجهیزات',
    service: 'سرویس‌ها'
  },
  status: {
    pending: 'در انتظار',
    done: 'انجام شده',
    others: 'سایر',
    hidden: 'مخفی'
  },
  columns: {
    select: 'انتخاب همه',
    customer: 'مشتری',
    total: 'مجموع',
    status: 'وضعیت',
    createdAt: 'تاریخ',
    details: 'جزئیات',
    location: 'موقعیت'
  },
  details: {
    title: 'جزئیات اعتبارسنجی',
    customerInfo: {
      title: 'اطلاعات مشتری',
      name: 'نام',
      email: 'ایمیل',
      phone: 'تلفن',
      customerType: 'نوع مشتری',
      customerId: 'شناسه مشتری',
      deltaId: 'شناسه دلتا',
      // Individual specific
      nid: 'کد ملی',
      // Business specific
      companyName: 'نام شرکت',
      licenseNo: 'شماره مجوز',
      activity: 'نوع فعالیت',
      address: 'آدرس',
      internetUsage: 'سابقه استفاده از اینترنت',
      internetPurpose: 'هدف استفاده',
      previousPackage: 'بسته قبلی',
      familiarityWithUs: 'نحوه آشنایی'
    },
    devices: {
      title: 'تجهیزات پرداخت شده',
      name: 'نام تجهیز',
      quantity: 'تعداد',
      unitPrice: 'قیمت واحد',
      total: 'جمع',
      totalPrice: 'مجموع قیمت تجهیزات'
    },
    package: {
      title: 'بسته پرداخت نشده',
      name: 'نام بسته',
      period: 'دوره سرویس',
      price: 'قیمت بسته'
    },
    total: {
      title: 'مبلغ کل',
      amount: 'مبلغ',
      readonly: 'قیمت قفل شده'
    },
    totalAmount: 'مجموع مبلغ پرداخت نشده'
  },
  actions: {
    check: 'بررسی',
    approve: 'تایید',
    reject: 'رد',
    cancel: 'انصراف',
    resend: 'ارسال مجدد',
    setManual: 'تنظیم به صورت دستی',
    unsetManual: 'لغو تنظیم دستی',
    hide: 'مخفی کردن',
    unhide: 'نمایش'
  },
  dialog: {
    confirm: {
      title: 'تایید عملیات',
      approveMessage: 'آیا از تایید این مورد اطمینان دارید؟',
      rejectMessage: 'آیا از رد این مورد اطمینان دارید؟'
    }
  },
  notifications: {
    approved: {
      title: 'تایید شد',
      description: 'اعتبارسنجی با موفقیت تایید شد.'
    },
    rejected: {
      title: 'رد شد',
      description: 'اعتبارسنجی رد شد.'
    },
    error: {
      title: 'خطا',
      description: 'پردازش اعتبارسنجی با خطا مواجه شد. لطفا مجددا تلاش کنید.',
      fetchError: 'دریافت لیست با خطا مواجه شد. لطفا مجددا تلاش کنید.'
    },
    hidden: {
      title: 'مخفی',
      hideDescription: 'مورد با موفقیت مخفی شد.',
      unhideDescription: 'مورد با موفقیت نمایش داده شد.'
    },
    manual: {
      title: 'وضعیت دستی',
      description: 'وضعیت دستی با موفقیت به‌روز شد.'
    }
  },
  search: {
    minChars: "لطفا حداقل ۳ کاراکتر برای جستجو وارد کنید",
    placeholder: "جستجو بر اساس نام مشتری، سرویس یا دستگاه..."
  }
} 