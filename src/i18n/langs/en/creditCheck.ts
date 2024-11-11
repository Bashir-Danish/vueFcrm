export default {
  title: 'Credit Check List',
  status: {
    pending: 'Pending',
    done: 'Done',
    others: 'Others'
  },
  columns: {
    customer: 'Customer',
    total: 'Total',
    status: 'Status',
    createdAt: 'Created At'
  },
  details: {
    title: 'Credit Check Details',
    customerInfo: {
      title: 'Customer Information',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      customerType: 'Customer Type',
      nid: 'NID',
      companyName: 'Company Name',
      licenseNo: 'License No',
      address: 'Address'
    },
    devices: {
      title: 'Unpaid Devices',
      totalPrice: 'Total Device Price'
    },
    package: {
      title: 'Unpaid Package',
      price: 'Package Price'
    },
    totalAmount: 'Total Unpaid Amount'
  },
  actions: {
    check: 'Check',
    approve: 'Approve',
    reject: 'Reject',
    cancel: 'Cancel'
  },
  dialog: {
    confirm: {
      title: 'Confirm Action',
      approveMessage: 'Are you sure you want to approve this item?',
      rejectMessage: 'Are you sure you want to reject this item?'
    }
  },
  notifications: {
    approved: {
      title: 'Approved',
      description: 'Credit check has been approved.'
    },
    rejected: {
      title: 'Rejected', 
      description: 'Credit check has been rejected.'
    },
    error: {
      title: 'Error',
      description: 'Failed to process credit check. Please try again.',
      fetchError: 'Failed to fetch checklist items. Please try again.'
    }
  }
} 