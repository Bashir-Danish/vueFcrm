export default {
    title: 'Equipment',
    actions: {
        add: 'Add Equipment',
        edit: 'Edit',
        delete: 'Remove Equipment',
        copyId: 'Copy Equipment ID',
        update: 'Update Equipment'
    },
    columns: {
        name: 'Name',
        model: 'Model',
        company: 'Company',
        unit: 'Unit',
        price: 'Price'
    },
    dialog: {
        add: {
            title: 'Add New Equipment',
            description: 'Enter the details for the new equipment here. Click save when you\'re done.'
        },
        update: {
            title: 'Update Equipment',
            description: 'Update the details for this equipment. Click save when you\'re done.'
        },
        save: 'Save changes'
    },
    notifications: {
        idCopied: {
            title: 'Equipment ID Copied',
            description: 'The equipment ID has been copied to your clipboard.'
        },
        deleted: {
            title: 'Equipment Deleted',
            description: 'The equipment has been successfully deleted.'
        },
        error: {
            title: 'Error',
            description: 'Failed to delete the equipment. Please try again.'
        }
    }
} 