export default {
  title: 'نصب و راه‌اندازی',
  assign: {
    title: 'تخصیص نصب',
    description: 'این صفحه شامل فرم تخصیص نصب‌های جدید یا تخصیص مجدد نصب‌های موجود خواهد بود.'
  },
  actions: {
    assign: 'تخصیص نصب',
    update: 'بروزرسانی/تایید',
    copyId: 'کپی شناسه نصب',
    remove: 'حذف نصب',
    createPPPoE: 'ایجاد PPOE'
  },
  status: {
    pending: 'در انتظار',
    inProgress: 'در حال انجام',
    done: 'انجام شده',
    failed: 'ناموفق'
  },
  types: {
    all: 'همه',
    installation: 'نصب',
    troubleshooting: 'عیب‌یابی'
  },
  columns: {
    customer: 'مشتری',
    status: 'وضعیت',
    devices: 'تجهیزات',
    type: 'نوع'
  },
  customerDetails: {
    title: 'جزئیات مشتری',
    id: 'شناسه',
    type: 'نوع',
    email: 'ایمیل',
    address: 'آدرس',
    phone: 'تلفن'
  },
  deviceDetails: {
    title: 'تجهیزات',
    name: 'نام',
    quantity: 'تعداد',
    noDevices: 'تجهیزاتی موجود نیست'
  },
  notifications: {
    idCopied: {
      title: 'شناسه نصب کپی شد',
      description: 'شناسه نصب در کلیپ‌بورد کپی شد.'
    },
    deleted: {
      title: 'نصب حذف شد',
      description: 'نصب با موفقیت حذف شد.'
    },
    pppoeCreated: {
      title: 'PPPoE ایجاد شد',
      description: 'حساب PPOE با موفقیت ایجاد شد.'
    },
    error: {
      title: 'خطا',
      description: 'حذف نصب با خطا مواجه شد. لطفا مجددا تلاش کنید.'
    }
  }
} 