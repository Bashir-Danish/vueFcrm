export default {
  title: 'Customers',
  search: {
    title: 'Customer Search',
    placeholder: 'Search customers...',
    noResults: 'No customers found. Try a different search term.'
  },
  manage: {
    title: 'Manage Customer',
    steps: {
      customer: 'Customer',
      devices: 'Devices',
      assign: 'Assign',
      installation: 'Installation'
    },
    form: {
      save: 'Save Customer',
      submit: 'Submit',
      approve: 'Approve',
      reject: 'Reject',
      submitInstallation: 'Submit Installation Form'
    },
    accessDenied: 'Access Denied'
  },
  form: {
    customerType: 'Customer Type',
    individual: 'Individual',
    business: 'Business',
    username: 'Username',
    date: 'Date',
    companyName: 'Company Name',
    activity: 'Activity',
    name: 'Name',
    lastName: 'Last Name',
    email: 'Email',
    licenseNo: 'License No',
    nid: 'NID',
    address: 'Address',
    phones: {
      title: 'Phone Numbers',
      add: 'Add Phone Number',
      placeholder: 'Enter phone number'
    },
    package: 'Package',
    selectPackage: 'Select a package',
    searchPackages: 'Search packages...',
    customFields: {
      title: 'Custom Fields',
      add: 'Add Custom Field',
      key: 'Enter key',
      value: 'Enter value'
    },
    submit: 'Save Customer',
    selectDate: 'Select date',
    selectCustomerType: 'Select customer type',
    usernamePlaceholder: 'Enter username',
    companyNamePlaceholder: 'Enter company name',
    activityPlaceholder: 'Enter business activity',
    namePlaceholder: 'Enter name',
    lastNamePlaceholder: 'Enter last name',
    emailPlaceholder: 'Enter email address',
    licenseNoPlaceholder: 'Enter license number',
    nidPlaceholder: 'Enter NID',
    addressPlaceholder: 'Enter address',
    internetUsage: {
      title: 'Have you had wireless internet before?',
      yes: 'Yes'
    },
    internetPurpose: {
      title: 'Why you use Internet?',
      placeholder: 'Enter internet usage purpose'
    },
    findUs: {
      title: 'How did you find FR-ISP?',
      placeholder: 'Enter how you found FR-ISP'
    },
    previousPackage: {
      title: 'Previous Package',
      placeholder: 'Enter previous package'
    },
    terminationReasons: {
      title: 'Termination Reasons',
      price: 'Price',
      quality: 'Quality',
      customerService: 'Customer Service',
      speed: 'Speed'
    },
    selectCustomer: 'Select customer',
    searchCustomer: 'Search customers...'
  },
  devices: {
    title: 'Devices',
    add: 'Add Device',
    selectDevice: 'Select a device',
    searchDevices: 'Search devices...',
    table: {
      name: 'Name',
      model: 'Model',
      company: 'Company',
      unit: 'Unit',
      price: 'Price',
      quantity: 'Quantity'
    },
    totalAmount: 'Total Amount',
    submit: 'Submit'
  },
  installation: {
    title: 'Installation',
    form: {
      date: 'Date',
      selectDate: 'Select date',
      type: 'Type',
      types: {
        installation: 'Installation',
        troubleshooting: 'Troubleshooting'
      },
      status: {
        title: 'Status',
        pending: 'Pending',
        inProgress: 'In Progress',
        done: 'Done',
        failed: 'Failed'
      },
      customerInfo: {
        name: 'Customer Name',
        phone: 'Phone',
        address: 'Address'
      },
      details: {
        signal: 'Signal',
        ccq: 'CCQ',
        base: 'Base',
        cable: 'Cable',
        router: 'Router',
        antenna: 'Antenna',
        note: 'Note',
        cancelReason: 'Cancel Reason'
      },
      actions: {
        approve: 'Approve',
        reject: 'Reject',
        submit: 'Submit Installation Form'
      }
    }
  },
  filter: {
    all: 'All',
    individual: 'Individual',
    business: 'Business'
  },
  actions: {
    add: 'Add Customer',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    menu: 'Open menu',
    title: 'Actions',
    copyId: 'Copy Customer ID'
  },
  columns: {
    id: 'ID',
    name: 'Name',
    licenseOrNID: 'License / NID',
    email: 'Email',
    address: 'Address',
    phones: 'Phone Numbers',
    fields: 'Fields',
    devices: 'Devices',
    noPhone: 'No Phone',
    noFields: 'No Fields',
    noDevices: 'No devices',
    deviceCount: '{count} device(s)'
  },
  notifications: {
    customerUpdated: '{name}\'s information has been updated successfully!',
    customerAdded: '{name} has been successfully added as a customer!',
    deviceUpdated: 'Devices have been updated successfully!',
    installationUpdated: 'Installation has been updated successfully!',
    usernameExists: 'This username is already taken. Please choose a different username.',
    processFailed: 'Failed to process customer.',
    deviceUpdateFailed: 'Failed to update {name}\'s devices.',
    installationFailed: 'Failed to submit installation for {name}.',
    idCopied: 'Customer ID has been copied to clipboard',
    customerDeleted: '{name} has been successfully deleted',
    deleteFailed: 'Failed to delete customer. Please try again.',
  },
  common: {
    success: 'Success',
    error: 'Error',
    loading: 'Loading...',
    submitting: 'Submitting...',
    customer: 'Customer'
  },
  assignment: {
    installers: 'Installer Users',
    unassignedInstallations: 'Unassigned Installations',
    searchInstallers: 'Search installers...',
    searchInstallations: 'Search installations...',
    tasksCount: 'Tasks: {count}',
    dragHint: 'Drag installation to assign',
    taskDetails: 'Task Details',
    taskAssigned: 'Task has been successfully assigned',
    taskUnassigned: 'Task has been successfully unassigned',
    assignFailed: 'Failed to assign task. Please try again.',
    unassignFailed: 'Failed to unassign task. Please try again.'
  },
  roles: {
    admin: 'Admin',
    noc: 'NOC',
    installer: 'Installer'
  },
  dialog: {
    errors: {
      title: 'Error',
      noPhone: 'Phone Number Required',
      phoneRequired: 'Please add at least one phone number before submitting'
    },
    success: {
      title: 'Success',
      customerAdded: 'Customer added successfully',
      customerUpdated: 'Customer updated successfully'
    }
  }
} 