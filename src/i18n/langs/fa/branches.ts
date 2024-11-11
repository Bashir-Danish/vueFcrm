export default {
    title: 'شعبه‌ها',
    columns: {
        name: 'نام',
        location: 'موقعیت'
    },
    actions: {
        add: 'افزودن',
        edit: 'ویرایش',
        delete: 'حذف شعبه',
        copyId: 'کپی شناسه شعبه',
        update: 'بروزرسانی شعبه'
    },
    dialog: {
        add: {
            title: 'افزودن شعبه جدید',
            description: 'جزئیات شعبه جدید را در اینجا وارد کنید. پس از اتمام روی ذخیره کلیک کنید.'
        },
        update: {
            title: 'بروزرسانی شعبه',
            description: 'جزئیات این شعبه را بروزرسانی کنید. پس از اتمام روی ذخیره کلیک کنید.'
        },
        save: 'ذخیره تغییرات'
    },
    fields: {
        name: 'نام',
        location: 'موقعیت'
    },
    notifications: {
        idCopied: {
            title: 'شناسه شعبه کپی شد',
            description: 'شناسه شعبه در کلیپ‌بورد کپی شد.'
        },
        deleted: {
            title: 'شعبه حذف شد',
            description: 'شعبه با موفقیت حذف شد.'
        },
        error: {
            title: 'خطا',
            description: 'حذف شعبه با خطا مواجه شد. لطفا مجددا تلاش کنید.'
        }
    }
} 