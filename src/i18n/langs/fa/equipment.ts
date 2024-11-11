export default {
    title: 'تجهیزات',
    actions: {
        add: 'افزودن تجهیزات',
        edit: 'ویرایش',
        delete: 'حذف تجهیزات',
        copyId: 'کپی شناسه تجهیزات',
        update: 'بروزرسانی تجهیزات'
    },
    columns: {
        name: 'نام',
        model: 'مدل',
        company: 'شرکت',
        unit: 'واحد',
        price: 'قیمت'
    },
    dialog: {
        add: {
            title: 'افزودن تجهیزات جدید',
            description: 'جزئیات تجهیزات جدید را در اینجا وارد کنید. پس از اتمام روی ذخیره کلیک کنید.'
        },
        update: {
            title: 'بروزرسانی تجهیزات',
            description: 'جزئیات این تجهیزات را بروزرسانی کنید. پس از اتمام روی ذخیره کلیک کنید.'
        },
        save: 'ذخیره تغییرات'
    },
    notifications: {
        idCopied: {
            title: 'شناسه تجهیزات کپی شد',
            description: 'شناسه تجهیزات در کلیپ‌بورد کپی شد.'
        },
        deleted: {
            title: 'تجهیزات حذف شد',
            description: 'تجهیزات با موفقیت حذف شد.'
        },
        error: {
            title: 'خطا',
            description: 'حذف تجهیزات با خطا مواجه شد. لطفا مجددا تلاش کنید.'
        }
    }
} 