export default {
    title: 'Branches',
    columns: {
        name: 'Name',
        location: 'Location'
    },
    actions: {
        add: 'Add',
        edit: 'Edit',
        delete: 'Remove Branch',
        copyId: 'Copy Branch ID',
        update: 'Update Branch'
    },
    dialog: {
        add: {
            title: 'Add New Branch',
            description: 'Enter the details for the new branch here. Click save when you\'re done.'
        },
        update: {
            title: 'Update Branch',
            description: 'Update the details for this branch. Click save when you\'re done.'
        },
        save: 'Save changes'
    },
    fields: {
        name: 'Name',
        location: 'Location'
    },
    notifications: {
        idCopied: {
            title: 'Branch ID Copied',
            description: 'The branch ID has been copied to your clipboard.'
        },
        deleted: {
            title: 'Branch Deleted',
            description: 'The branch has been successfully deleted.'
        },
        error: {
            title: 'Error',
            description: 'Failed to delete the branch. Please try again.'
        }
    }
} 