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

export interface Customer {
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
  licenseNo?: string | number;
  activity?: string;
  phones?: string[];
  branch_id?: string | Branch;
  date?: Date;
  customFields?: Array<{
    key: string;
    value: string;
    _id?: string;
  }>;
  internetUsage?: string;
  internetUsagePurpose?: string;
  previousPackage?: string;
  familiarityWithUs?: string;
  terminationReason?: string;
  isReturningCustomer?: boolean;
  devices?: Array<{
    device?: Equipment;
    quantity?: number;
    paid: boolean;
    purchaseDate?: Date;
    _id?: string;
  }>;
  currentService?: {
    service: Service;
    startDate?: Date;
    endDate?: Date;
    paid: boolean;
    User_ServiceBase_Id?: string;
    serviceStatus?: string;
  };
  paymentHistory?: any[];
  deltaSibUserId?: string;
  __v?: number;
}

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
  customerId: Customer;
  totalPrice: number;
  type: 'device' | 'service';
  status: 'pending' | 'done' | 'others';
  isHidden: boolean;
  service?: {
    service: {
      Service_Id: string;
      ServiceName: string;
      Description: string;
      Price: string;
      ServiceType: string;
      ISEnable: string;
      UserChoosable: string;
      ResellerChoosable: string;
    };
    startDate: Date;
    endDate: Date;
    serviceStatus: string;
    User_ServiceBase_Id: string;
  };
  devices?: Array<{
    equipmentId: string | Equipment;
    quantity: number;
    _id: string;
  }>;
  branch_id?: string | Branch;
  sentToQuickbooks: boolean;
  customerCreatedInQB: boolean;
  invoiceCreated: boolean;
  isManual: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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
    endDate?: Date;
    paid: boolean;
  };
}

export interface FetchChecklistParams {
  page: number;
  limit: number;
  status: string;
  type: string;
  date?: string;
  branch?: string;
  [key: string]: string | number | undefined;
}
