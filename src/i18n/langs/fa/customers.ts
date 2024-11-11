export default {
  title: 'مشتریان',
  search: {
    title: 'جستجوی مشتری',
    placeholder: 'جستجوی مشتریان...',
    noResults: 'مشتری‌ای یافت نشد. عبارت دیگری را امتحان کنید.'
  },
  manage: {
    title: 'مدیریت مشتری',
    steps: {
      customer: 'مشتری',
      devices: 'تجهیزات',
      assign: 'تخصیص',
      installation: 'نصب'
    },
    form: {
      save: 'ذخیره مشتری',
      submit: 'ثبت',
      approve: 'تایید',
      reject: 'رد',
      submitInstallation: 'ثبت فرم نصب'
    },
    accessDenied: 'دسترسی غیرمجاز'
  },
  form: {
    customerType: 'نوع مشتری',
    individual: 'شخصی',
    business: 'تجاری',
    username: 'نام کاربری',
    date: 'تاریخ',
    companyName: 'نام شرکت',
    activity: 'فعالیت',
    name: 'نام',
    lastName: 'نام خانوادگی',
    email: 'ایمیل',
    licenseNo: 'شماره مجوز',
    nid: 'کد ملی',
    address: 'آدرس',
    phones: {
      title: 'شماره‌های تماس',
      add: 'افزودن شماره تما',
      placeholder: 'شماره تماس را وارد کنید'
    },
    package: 'بسته',
    selectPackage: 'انتخاب بسته',
    searchPackages: 'جستجوی بسته ها...',
    customFields: {
      title: 'فیلدهای سفارشی',
      add: 'افزودن فیلد سفارشی',
      key: 'کلید را وارد کنید',
      value: 'مقدار را وارد کنید'
    },
    submit: 'ذخیره مشتری',
    selectDate: 'انتخاب تاریخ',
    selectCustomerType: 'انتخاب نوع مشتری',
    usernamePlaceholder: 'نام کاربری را وارد کنید',
    companyNamePlaceholder: 'نام شرکت را وارد کنید',
    activityPlaceholder: 'فعالیت تجاری را وارد کنید',
    namePlaceholder: 'نام را وارد کنید',
    lastNamePlaceholder: 'نام خانوادگی را وارد کنید',
    emailPlaceholder: 'آدرس ایمیل را وارد کنید',
    licenseNoPlaceholder: 'شماره مجوز را وارد کنید',
    nidPlaceholder: 'کد ملی را وارد کنید',
    addressPlaceholder: 'آدرس را وارد کنید',
    internetUsage: {
      title: 'آیا قبلاً اینترنت وایرلس داشته‌اید؟',
      yes: 'بله'
    },
    internetPurpose: {
      title: 'چرا از اینترنت استفاده می‌کنید؟',
      placeholder: 'هدف استفاده از اینترنت را وارد کنید'
    },
    findUs: {
      title: 'چگونه با FR-ISP آشنا شدید؟',
      placeholder: 'نحوه آشنایی با ما را وارد کنید'
    },
    previousPackage: {
      title: 'پکیج قبلی',
      placeholder: 'پکیج قبلی را وارد کنید'
    },
    terminationReasons: {
      title: 'دلایل قطع سرویس',
      price: 'قیمت',
      quality: 'کیفیت',
      customerService: 'خدمات مشتری',
      speed: 'سرعت'
    },
    selectCustomer: 'انتخاب مشتری',
    searchCustomer: 'جستجوی مشتریان...'
  },
  devices: {
    title: 'تجهیزات',
    add: 'افزودن تجهیزات',
    selectDevice: 'انتخاب تجهیزات',
    searchDevices: 'جستجوی تجهیزات...',
    table: {
      name: 'نام',
      model: 'مدل',
      company: 'شرکت',
      unit: 'واحد',
      price: 'قیمت',
      quantity: 'تعداد'
    },
    totalAmount: 'مبلغ کل',
    submit: 'ثبت'
  },
  installation: {
    title: 'نصب',
    form: {
      date: 'تاریخ',
      selectDate: 'انتخاب تاریخ',
      type: 'نوع',
      types: {
        installation: 'نصب',
        troubleshooting: 'عیب‌یابی'
      },
      status: {
        title: 'وضعیت',
        pending: 'در انتظار',
        inProgress: 'در حال انجام',
        done: 'انجام شده',
        failed: 'ناموفق'
      },
      customerInfo: {
        name: 'نام مشتری',
        phone: 'تلفن',
        address: 'آدرس'
      },
      details: {
        signal: 'سیگنال',
        ccq: 'CCQ',
        base: 'پایه',
        cable: 'کابل',
        router: 'روتر',
        antenna: 'آنتن',
        note: 'یادداشت',
        cancelReason: 'دلیل لغو'
      },
      actions: {
        approve: 'تایید',
        reject: 'رد',
        submit: 'ثبت فرم نصب'
      }
    }
  },
  filter: {
    all: 'همه',
    individual: 'شخصی',
    business: 'تجاری'
  },
  actions: {
    add: 'افزودن مشتری',
    edit: 'ویرایش',
    delete: 'حذف',
    view: 'مشاهده',
    menu: 'باز کردن منو',
    title: 'عملیات',
    copyId: 'کپی شناسه مشتری'
  },
  columns: {
    id: 'آیدی',
    name: 'نام',
    licenseOrNID: 'شماره مجوز / کد ملی',
    email: 'ایمیل',
    address: 'آدرس',
    phones: 'شماره‌های تماس',
    fields: 'فیلدها',
    devices: 'تجهیزات',
    noPhone: 'بدون شماره تماس',
    noFields: 'بدون فیلد',
    noDevices: 'بدون تجهیزات',
    deviceCount: '{count} تجهیز'
  },
  notifications: {
    customerUpdated: 'اطلاعات {name} با موفقیت به‌روزرسانی شد!',
    customerAdded: '{name} با موفقیت به عنوان مشتری اضافه شد!',
    deviceUpdated: 'تجهیزات با موفقیت به‌روزرسانی شدند!',
    installationUpdated: 'نصب با موفقیت به‌روزرسانی شد!',
    usernameExists: 'این نام کاربری قبلاً گرفته شده است. لطفاً نام کاربری دیگری انتخاب کنید.',
    processFailed: 'پردازش مشتری با خطا مواجه شد.',
    deviceUpdateFailed: 'به‌روزرسانی تجهیزات {name} با خطا مواجه شد.',
    installationFailed: 'ثبت نصب برای {name} با خطا مواجه شد.',
    idCopied: 'شناسه مشتری در کلیپ‌بورد کپی شد',
    customerDeleted: '{name} با موفقیت حذف شد',
    deleteFailed: 'حذف مشتری با خطا مواجه شد. لطفاً دوباره تلاش کنید.',
  },
  common: {
    success: 'موفقیت',
    error: 'خطا',
    loading: 'در حال بارگذاری...',
    submitting: 'در حال ارسال...',
    customer: 'مشتری'
  },
  assignment: {
    installers: 'تسک های کاربران',
    unassignedInstallations: 'تسک های تخصیص نیافته',
    searchInstallers: 'جستجوی تسک ها...',
    searchInstallations: 'جستجوی کارمندان...',
    tasksCount: 'تسک ها: {count}',
    dragHint: 'برای تخصیص، تسک را بکشید',
    taskDetails: 'جزئیات وظیفه',
    taskAssigned: 'وظیفه با موفقیت تخصیص داده شد',
    taskUnassigned: 'وظیفه با موفقیت لغو تخصیص شد',
    assignFailed: 'تخصیص وظیفه با خطا مواجه شد. لطفاً دوباره تلاش کنید.',
    unassignFailed: 'لغو تخصیص وظیفه با خطا مواجه شد. لطفاً دوباره تلاش کنید.'
  },
  roles: {
    admin: 'مدیر',
    noc: 'ناک',
    installer: 'وظایف'
  },
  dialog: {
    errors: {
      title: 'خطا',
      noPhone: 'شماره تلفن الزامی است',
      phoneRequired: 'لطفا قبل از ثبت حداقل یک شماره تلفن وارد کنید'
    },
    success: {
      title: 'موفقیت',
      customerAdded: 'مشتری با موفقیت اضافه شد',
      customerUpdated: 'مشتری با موفقیت بروزرسانی شد'
    }
  }
} 