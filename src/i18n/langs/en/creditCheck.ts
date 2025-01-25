export default {
  title: 'Credit Check List',
  sync: {
    title: 'Sync',
    noSelection: 'No Items Selected',
    selectItems: 'Please select items to sync',
    success: 'Successfully synced with QuickBooks',
    completed: 'Selected items have been synced successfully',
    error: 'Sync Error',
    failed: 'Failed to sync with QuickBooks',
    pending: 'Pending sync',
    manual: 'Manually processed',
    resend: 'Send Again'
  },
  types: {
    all: 'All',
    device: 'Devices',
    service: 'Services'
  },
  status: {
    pending: 'Pending',
    done: 'Done',
    others: 'Others',
    hidden: 'Hidden'
  },
  columns: {
    select: 'Select All',
    customer: 'Customer',
    total: 'Total',
    status: 'Status',
    createdAt: 'Date',
    details: 'Details',
    location: 'Location'
  },
  
  details: {
    title: 'Credit Check Details',
    customerInfo: {
      title: 'Customer Information',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      customerType: 'Customer Type',
      customerId: 'Customer ID',
      deltaId: 'Delta ID',
      nid: 'NID',
      companyName: 'Company Name',
      licenseNo: 'License No',
      activity: 'Business Activity',
      address: 'Address',
      internetUsage: 'Internet Usage',
      internetPurpose: 'Usage Purpose',
      previousPackage: 'Previous Package',
      familiarityWithUs: 'How Found Us'
    },
    devices: {
      title: 'Unpaid Devices',
      name: 'Device Name',
      quantity: 'Quantity',
      unitPrice: 'Unit Price',
      total: 'Total',
      totalPrice: 'Total Device Price'
    },
    package: {
      title: 'Unpaid Package',
      name: 'Package Name',
      period: 'Service Period',
      price: 'Package Price'
    },
    total: {
      title: 'Total Amount',
      amount: 'Amount',
      readonly: 'Price locked'
    },
    totalAmount: 'Total Unpaid Amount'
  },
  actions: {
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    check: 'Check',
    approve: 'Approve',
    reject: 'Reject',
    cancel: 'Cancel',
    resend: 'Send',
    tryAgain: 'Try Again',
    setManual: 'Set as Manual',
    unsetManual: 'Unset Manual',
    hide: 'Hide',
    unhide: 'Unhide'
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
    },
    hidden: {
      title: 'Hidden',
      hideDescription: 'Item has been hidden successfully.',
      unhideDescription: 'Item has been unhidden successfully.'
    },
    manual: {
      title: 'Manual Status',
      description: 'Manual status updated successfully.'
    }
  },
  search: {
    minChars: "Please enter at least 3 characters to search",
    placeholder: "Search by customer name, service, or device..."
  }
} 