export interface Branch {
  _id: string;
  name: string;
  location: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Notification {
  message: string;
  read: boolean;
  seen: boolean;
  relatedModel: string;
  relatedId: string;
  createdAt: Date;
}

export interface User {
  _id: string;
  cartId: number;
  name: string;
  email: string;
  role: "admin" | "noc" | "installer" | "financeAdmin" | "sales" | "creditChecker" | "cashier";
  branch_id: string | Branch;
  notifications: Notification[];
  refreshToken?: string;
  refreshTokens?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  password?: string;
  tasks?: AssignedTask[]; 
}

export interface Equipment {
  _id: string;
  name: string;
  model: string;
  company: string;
  unit: string;
  price: number;
}

export interface Service {
  Service_Id: string;
  ServiceName: string;
  Description: string;
  Price: string;
  ServiceType: string;
  ISEnable: string;
  UserChoosable: string;
  ResellerChoosable: string;
}

export type Customer = {
  _id?: string;
  customerId?: number;
  username: string;
  password: string;
  custType: "individual" | "business";
  name: string;
  lastName?: string;
  email?: string;
  nid?: number;
  address?: string;
  companyName?: string;
  devices: Array<{ device: any; quantity: number; paid: boolean }>;
  licenseNo?: number;
  date: Date;
  customFields: Array<{ key: string; value: string }>;
  activity?: string;
  phones: string[];
  packageId?: { type: string; ref: 'Package' };
  branch_id?: { type: string; ref: 'Branch' };
  internetUsage?: "Yes" | "No";
  terminationReason?: string;
  familiarityWithUs?: string;
  internetUsagePurpose?: string;
  paymentHistory?: Array<{
    date?: Date;
    amount?: number;
    description?: string;
  }>;
  isReturningCustomer?: boolean;
  currentService?: {
    service: Service;
    startDate?: Date;
    paid: boolean;
  };
};

export const CustomerMessages = {
  CREATE_SUCCESS: (name: string) => `${name} has been successfully added as a customer!`,
  CREATE_ERROR: (name: string) => `Failed to add ${name} as a customer. Please try again.`,
  UPDATE_SUCCESS: (name: string) => `${name}'s information has been updated successfully!`,
  UPDATE_ERROR: (name: string) => `Failed to update ${name}'s information.`,
  DELETE_SUCCESS: (name: string) => `${name} has been removed from customers successfully!`,
  DELETE_ERROR: (name: string) => `Failed to remove ${name} from customers.`,
  DEVICE_UPDATE_SUCCESS: (name: string) => `${name}'s devices have been updated successfully!`,
  DEVICE_UPDATE_ERROR: (name: string) => `Failed to update ${name}'s devices.`,
  USERNAME_EXISTS: 'Username already exists. Please choose a different username.',
  INVALID_USERNAME: 'Invalid username. Username must be unique and contain only letters, numbers, and underscores.',
} as const;

export interface Installation {
  _id: string;
  customerId: any;
  taskId?: string;
  status: "pending" | "in-progress" | "done" | "failed";
  type: string;
  date: Date;
  result: {
    signal: number;
    ccq: number;
    base: string;
    note: string;
    cancelDetails: string;
  };
  devices: {
    cable: string;
    router: string;
    routerMac: string;
    antenna: string;
    antennaMac: string;
    source: string;
  };
  packageId: string;
}

export interface AssignedTask {
  _id: string;
  userId: string | User;
  installationId: string | Installation;
  assignedAt: Date;
  status: "assigned" | "in-progress" | "completed" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Checklist {
  _id: string;
  customerId: string | Customer;
  totalPrice: number;
  status: "pending" | "done" | "others";
  createdAt?: Date;
  updatedAt?: Date;
  unpaidDevices?: Array<{ name: string; price: number }>;
  unpaidPackage?: { name: string; price: number };
}

export interface FormData {
  custType: 'individual' | 'business';
  username: string;
  password: string;
  date: Date;
  name: string;
  lastName: string;
  email: string;
  address: string;
  phones: string[];
  customFields: { key: string; value: string }[];
  internetUsagePurpose: string;
  familiarityWithUs: string;
  previousPackage: string;
  internetUsage: string;
  terminationReason: string;
  nid?: string;
  companyName?: string;
  licenseNo?: string;
  activity?: string;
  currentService?: {
    service: Service;
    startDate: Date;
    paid: boolean;
  };
}
