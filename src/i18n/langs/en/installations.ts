export default {
  title: 'Installations',
  assign: {
    title: 'Assign Installation',
    description: 'This page will contain a form for assigning new installations or reassigning existing ones.'
  },
  actions: {
    assign: 'Assign Installation',
    update: 'Update/Approve',
    copyId: 'Copy Installation ID',
    remove: 'Remove Installation',
    createPPPoE: 'Create PPOE'
  },
  status: {
    pending: 'Pending',
    inProgress: 'In Progress',
    done: 'Done',
    failed: 'Failed'
  },
  types: {
    all: 'All',
    installation: 'Installation',
    troubleshooting: 'Troubleshooting'
  },
  columns: {
    customer: 'Customer',
    status: 'Status',
    devices: 'Devices',
    type: 'Type'
  },
  customerDetails: {
    title: 'Customer Details',
    id: 'ID',
    type: 'Type',
    email: 'Email',
    address: 'Address',
    phone: 'Phone'
  },
  deviceDetails: {
    title: 'Devices',
    name: 'Name',
    quantity: 'Quantity',
    noDevices: 'No devices available'
  },
  notifications: {
    idCopied: {
      title: 'Installation ID Copied',
      description: 'The installation ID has been copied to your clipboard.'
    },
    deleted: {
      title: 'Installation Deleted',
      description: 'The installation has been successfully deleted.'
    },
    pppoeCreated: {
      title: 'PPOE Created',
      description: 'PPPoE account has been successfully created.'
    },
    error: {
      title: 'Error',
      description: 'Failed to delete the installation. Please try again.'
    }
  }
} 