export default {
  title: 'لیست اعتبارسنجی',
  status: {
    pending: 'در انتظار',
    done: 'انجام شده',
    others: 'سایر'
  },
  columns: {
    customer: 'مشتری',
    total: 'مجموع',
    status: 'وضعیت',
    createdAt: 'تاریخ ایجاد'
  },
  details: {
    title: 'جزئیات اعتبارسنجی',
    customerInfo: {
      title: 'اطلاعات مشتری',
      name: 'نام',
      email: 'ایمیل',
      phone: 'تلفن',
      customerType: 'نوع مشتری',
      nid: 'کد ملی',
      companyName: 'نام شرکت',
      licenseNo: 'شماره مجوز',
      address: 'آدرس'
    },
    devices: {
      title: 'تجهیزات پرداخت نشده',
      totalPrice: 'مجموع قیمت تجهیزات'
    },
    package: {
      title: 'بسته پرداخت نشده',
      price: 'قیمت بسته'
    },
    totalAmount: 'مجموع مبلغ پرداخت نشده'
  },
  actions: {
    check: 'بررسی',
    approve: 'تایید',
    reject: 'رد',
    cancel: 'انصراف'
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
    }
  }
} 