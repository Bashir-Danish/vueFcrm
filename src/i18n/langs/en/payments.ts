export default {
  title: 'Payments',
  list: {
    title: 'Payments List',
    addPayment: 'Add Payment',
    noPayments: 'No payments found',
    searchCustomers: 'Search customers...',
    selectCustomer: 'Select a customer',
    resetFilter: 'Reset customer filter',
    transactionType: 'Transaction Type',
    allTransactions: 'All',
    invoicesOnly: 'Invoices',
    paymentsOnly: 'Payments',
    columns: {
      id: 'ID',
      date: 'Date',
      customer: 'Customer',
      amount: 'Amount',
      status: 'Status',
      referenceNo: 'Reference No',
      balance: 'Balance',
      type: 'Type',
      actions: 'Actions'
    },
    types: {
      invoice: 'Invoice',
      payment: 'Payment'
    },
    loading: 'Loading...',
    loadingPayments: 'Loading transactions...'
  },
  search: {
    title: 'Search Customers',
    placeholder: 'Search by customer name, email, or phone number...',
    error: 'Search Error',
    noResults: 'No customers found',
    results: 'Search Results',
    startSearching: 'Enter customer name, email, or phone number to search',
    minChars: 'Please enter at least 3 characters to search',
    columns: {
      name: 'Customer Name',
      email: 'Email',
      phone: 'Phone',
      actions: 'Actions'
    }
  },
  actions: {
    pay: 'Pay'
  },
  form: {
    searchCustomer: 'Search Customer',
    searchPlaceholder: 'Type customer name, email, or phone (min. 3 characters)',
    selectedCustomer: 'Selected Customer',
    amount: 'Amount',
    paymentMethod: 'Payment Method',
    date: 'Payment Date',
    notes: 'Notes',
    error: 'Payment Error',
    selectCustomer: 'Please select a customer first',
    success: 'Payment saved successfully'
  },
  methods: {
    cash: 'Cash',
    card: 'Card',
    bank: 'Bank Transfer'
  },
  status: {
    completed: 'Completed',
    pending: 'Pending',
    failed: 'Failed'
  },
  edit: {
    title: 'Edit Payment'
  },
  create: {
    title: 'New Payment'
  },
  depositTo: {
    title: 'Deposit To',
    cash: 'Cash',
    bank: 'Bank Transfer'
  },
  common: {
    list: 'P',
    select: 'Select...',
    clear: 'Clear',
    save: 'Save',
    cancel: 'Cancel',
    view: 'View',
    submitting: 'Submitting...'
  },
  receive: {
    title: 'Receive Payment',
    customerInfo: 'Customer Information',
    summary: 'Summary',
    openBalance: 'Open Balance',
    overduePayment: 'Overdue Payment',
    transactionList: 'Transaction List',
    serviceDetails: 'Service Details',
    quickbooksBalance: 'QuickBooks Balance',
    deltasibBalance: 'DeltaSIB Balance',
    package: 'Package',
    price: 'Price',
    startDate: 'Start Date',
    endDate: 'End Date',
    addService: 'Add Service',
    cancelService: 'Cancel Service',
    startNextService: 'Start Next Service',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    suspended: 'Suspended',
    changeStatus: 'Change Status',
    customerName: 'Customer Name',
    customerId: 'Customer ID',
    paymentDate: 'Payment Date',
    referenceNo: 'Reference No',
    depositTo: 'Deposit To',
    amount: 'Amount',
    paidAmount: 'Paid Amount',
    packageNo: 'Package No',
    memo: 'Memo',
    saveAndPrint: 'Save & Print',
    saveAndClose: 'Save & Close',
    selectDepositAccount: 'Select Deposit Account',
    usageStats: {
      used: 'Used',
      remaining: 'Remaining'
    },
    devices: 'Devices',
    quantity: 'Quantity',
    unitPrice: 'Unit Price',
    totalAmount: 'Total',
    deviceDetails: 'Device Details',
    servicePayment: 'Service Payment',
    devicePayment: 'Device Payment',
    paymentHistory: 'Payment History',
    totalToBePaid: 'Total To Be Paid',
    remainingBalance: 'Remaining Balance',
  }
}