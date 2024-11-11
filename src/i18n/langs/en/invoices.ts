export default {
  title: 'Invoices',
  summary: {
    totalAmount: 'Total Amount',
    totalBalance: 'Total Balance',
    paidInvoices: 'Paid Invoices',
    unpaidInvoices: 'Unpaid Invoices'
  },
  columns: {
    number: 'Invoice #',
    customer: 'Customer',
    date: 'Date',
    dueDate: 'Due Date',
    totalAmount: 'Total Amount',
    balance: 'Balance',
    status: {
      paid: 'Paid',
      unpaid: 'Unpaid'
    },
    actions: 'Actions'
  },
  actions: {
    menu: 'Open menu',
    title: 'Actions',
    view: 'View Invoice',
    download: 'Download Invoice',
    pay: 'Pay Item',
    payFull: 'Pay Full Invoice'
  },
  lineItems: {
    title: 'Line Items',
    description: 'Description',
    quantity: 'Quantity',
    unitPrice: 'Unit Price',
    amount: 'Amount',
    memo: 'Memo'
  },
  total: 'Total',
  memo: 'Memo',
  noMemo: 'No memo provided',
  noDetails: 'No details provided',
  notifications: {
    viewNotImplemented: 'View invoice feature is not implemented yet.',
    downloadNotImplemented: 'Download invoice feature is not implemented yet.'
  },
  search: {
    placeholder: "Search by customer name or invoice number...",
    minChars: "Please enter at least 3 characters to search",
    loading: "Searching...",
    noResults: "No customers found",
    startSearching: "Start searching by customer name or invoice number"
  },
  payment: {
    title: 'Payment',
    amount: 'Amount',
    payItem: 'Pay Item',
    payFull: 'Pay Full',
    paidStatus: 'Paid',
    linePayment: 'Payment: {amount} on {date}',
    paidAmount: 'Total Paid: {amount}',
    balanceAmount: 'Remaining: {amount}',
    lineSpecific: 'Line Payment',
    shared: 'Shared Payment',
    success: 'Payment Successful',
    successMessage: 'Payment of {amount} for {item} was successful',
    error: 'Payment Failed',
    invalidAmount: 'Please enter a valid amount',
    exceedsBalance: 'Amount exceeds remaining balance',
    alreadyPaid: 'This item is already fully paid',
    history: 'Payment History',
    hoverToSeeDetails: 'Hover to see payment history'
  },
  confirmDelete: 'Are you sure you want to delete this invoice?',
  delete: {
    success: 'Invoice deleted successfully',
    error: 'Failed to delete invoice'
  },
  status: {
    paid: 'Paid',
    partiallyPaid: 'Partially Paid',
    unpaid: 'Unpaid'
  }
} 