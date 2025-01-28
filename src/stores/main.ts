import { defineStore } from 'pinia'
import { ref } from 'vue'
import axiosInstance from '@/utils/axios';
import { Branch, Equipment, Customer, Installation, AssignedTask, Checklist, Service } from '@/types/types';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth'; 
import { CustomerMessages } from '@/types/types';
import { Invoice, InvoicePaymentParams } from '@/types/invoice';

export interface BranchesData {
  branches: Branch[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface EquipmentData {
  equipment: Equipment[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface CustomersData {
  customers: Customer[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  filterCounts: {
    custType: { [key: string]: number };
  };
}

export interface InstallationsData {
  installations: Installation[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  filterCounts: {
    type: { [key: string]: number };
    status: { [key: string]: number };
  };
}

export interface AssignedTasksData {
  assignedTasks: AssignedTask[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  filterCounts: {
    status: { [key: string]: number };
  };
}

export interface ChecklistData {
  items: Checklist[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  filterCounts: {
    status: { [key: string]: number };
    type: { [key: string]: number };
    location: { [key: string]: number };
  };
}

export interface ServicesData {
  services: Service[];
  totalCount: number;
  page: number;
  limit: number;
  isLoading: boolean;
  hasMore: boolean;
}

interface InvoicesData {
  invoices: Invoice[];
  summary: {
    totalAmount: number;
    totalBalance: number;
    totalInvoices: number;
    paidInvoices: number;
    unpaidInvoices: number;
  };
}

interface DepositAccount {
  id: string;
  name: string;
  accountType: string;
  accountSubType: string;
  currentBalance: number;
  active: boolean;
  classification: string;
  fullyQualifiedName: string;
}

interface FetchChecklistParams {
  page: number;
  limit: number;
  status: string;
  type: string;
  date?: string;
  [key: string]: string | number | undefined;
}

export interface State {
  branchesData: BranchesData;
  equipmentData: EquipmentData;
  customersData: CustomersData;
  installationsData: InstallationsData;
  assignedTasksData: AssignedTasksData;
  checklistData: ChecklistData;
  servicesData: ServicesData;
  invoicesData: InvoicesData;
  token: string | null;
}

export const useMainStore = defineStore('main', () => {
  const branchesData = ref<BranchesData>({
    branches: [],
    totalCount: 0,
    page: 1,
    limit: 10
  });

  const equipmentData = ref<EquipmentData>({
    equipment: [],
    totalCount: 0,
    page: 1,
    limit: 10
  });

  const customersData = ref<CustomersData>({
    customers: [],
    totalCount: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    filterCounts: {
      custType: {}
    }
  });

  const installationsData = ref<InstallationsData>({
    installations: [],
    totalCount: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    filterCounts: {
      type: {},
      status: {}
    }
  });

  const assignedTasksData = ref<AssignedTasksData>({
    assignedTasks: [],
    totalCount: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    filterCounts: {
      status: {}
    }
  });

  const checklistData = ref<ChecklistData>({
    items: [],
    totalCount: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    filterCounts: {
      status: {},
      type: {},
      location: {}
    }
  });

  const servicesData = ref<ServicesData>({
    services: [],
    totalCount: 0,
    page: 1,
    limit: 200,
    isLoading: false,
    hasMore: true,
  });

  const invoicesData = ref<InvoicesData>({
    invoices: [],
    summary: {
      totalAmount: 0,
      totalBalance: 0,
      totalInvoices: 0,
      paidInvoices: 0,
      unpaidInvoices: 0
    }
  });

  const token = ref<string | null>(null);

  const makeSecureRequest = async (url: string, method: string, data: any = null) => {
    try {
      const config = {
        method,
        url,
        data,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('Error making secure request:', error);
      throw error;
    }
  };

  const fetchBranches = async (params = {}) => {
    try {
      const authStore = useAuthStore();
      const response = await axiosInstance.get('/api/branches', {
        params,
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      });
      
      branchesData.value = {
        branches: response.data.branches,
        totalCount: response.data.pagination.totalCount,
        page: response.data.pagination.page,
        limit: response.data.pagination.limit
      };
      
      return response.data;
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error;
    }
  };

  const addBranch = async (branchData: Partial<Branch>) => {
    try {
      const response = await axiosInstance.post('/api/branches', branchData);
      const newBranch = response.data.branch;
      branchesData.value.branches.push(newBranch);
      branchesData.value.totalCount++;
      return newBranch;
    } catch (error) {
      console.error('Error adding branch:', error);
      throw error;
    }
  };

  const updateBranch = async (branchData: Branch) => {
    try {
      if (!branchData || !branchData._id) {
        throw new Error('Invalid branch data: Missing _id');
      }

      const response = await axiosInstance.put(`/api/branches/${branchData._id}`, branchData);
  
      const updatedBranch = response.data;
      
      if (!updatedBranch || !updatedBranch._id) {
        throw new Error('Invalid response: Updated branch data is missing or incomplete');
      }

      branchesData.value.branches = branchesData.value.branches.map(branch => 
        branch._id === updatedBranch._id ? updatedBranch : branch
      );
      
      return updatedBranch;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error stack:', error.stack);
      }
      throw error;
    }
  };

  const getBranchById = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/api/branches/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching branch by ID:', error);
      throw error;
    }
  };

  const deleteBranch = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/branches/${id}`);
      branchesData.value.branches = branchesData.value.branches.filter(branch => branch._id !== id);
      branchesData.value.totalCount--;
    } catch (error) {
      console.error('Error deleting branch:', error);
      throw error;
    }
  };

  const fetchEquipment = async (page: number = 1, limit: number = 10, search: string = "") => {
    try {
      const response = await axiosInstance.get('/api/equipment', {
        params: {
          page,
          limit,
          search
        }
      });
      equipmentData.value = {
        equipment: response.data.equipment,
        totalCount: response.data.pagination.totalCount,
        page: response.data.pagination.page,
        limit: response.data.pagination.limit
      };
    } catch (error) {
      console.error('Error fetching equipment:', error);
      throw error;
    }
  };

  const addEquipment = async (newEquipmentData: Partial<Equipment>) => {
    try {
      const response = await axiosInstance.post('/api/equipment', newEquipmentData);
      const newEquipment = response.data.equipment;
      
      if (equipmentData.value.equipment) {
        equipmentData.value.equipment = [ ...equipmentData.value.equipment ,newEquipment];
        if (equipmentData.value.equipment.length > equipmentData.value.limit) {
          equipmentData.value.equipment.pop();
        }
      }
      
      if (equipmentData.value.totalCount !== undefined) {
        equipmentData.value.totalCount++;
      }
      
      return newEquipment;
    } catch (error) {
      console.error('Error adding equipment:', error);
      throw error;
    }
  };

  const updateEquipment = async (equipmentToUpdate: Equipment) => {
    try {
      if (!equipmentToUpdate || !equipmentToUpdate._id) {
        throw new Error('Invalid equipment data: Missing _id');
      }

      const response = await axiosInstance.put(`/api/equipment/${equipmentToUpdate._id}`, equipmentToUpdate);
  
      const updatedEquipment = response.data;
      
      if (!updatedEquipment || !updatedEquipment._id) {
        throw new Error('Invalid response: Updated equipment data is missing or incomplete');
      }

      equipmentData.value.equipment = equipmentData.value.equipment.map(equipment => 
        equipment._id === updatedEquipment._id ? updatedEquipment : equipment
      );
      
      return updatedEquipment;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error stack:', error.stack);
      }
      throw error;
    }
  };

  const getEquipmentById = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/api/equipment/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching equipment by ID:', error);
      throw error;
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/equipment/${id}`);
      equipmentData.value.equipment = equipmentData.value.equipment.filter(equipment => equipment._id !== id);
      equipmentData.value.totalCount--;
    } catch (error) {
      console.error('Error deleting equipment:', error);
      throw error;
    }
  };

  const fetchCustomers = async (page: number = 1, limit: number = 10, search: string = "", custType: string = "") => {
    try {
      const response = await axiosInstance.get('/api/customers', {
        params: {
          page,
          limit,
          search,
          custType
        }
      });
      customersData.value = {
        customers: response.data.customers,
        totalCount: response.data.totalCount,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages,
        filterCounts: response.data.filterCounts
      };
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  };

  const addCustomer = async (newCustomerData: Partial<Customer>) => {
    try {
      const response = await axiosInstance.post('/api/customers', newCustomerData);
      const { customer: newCustomer, installation, message } = response.data;
      
      if (customersData.value.customers) {
        customersData.value.customers.push(newCustomer);
      }
      if (customersData.value.totalCount !== undefined) {
        customersData.value.totalCount++;
      }
      return { 
        customer: newCustomer, 
        installation,
        message: message || CustomerMessages.CREATE_SUCCESS(newCustomer.name)
      };
    } catch (error: any) {
      console.error('Error adding customer:', error);
      const errorMessage = error.response?.data?.message || 
        CustomerMessages.CREATE_ERROR(newCustomerData.name || 'Customer');
      throw new Error(errorMessage);
    }
  };

  const updateCustomer = async (customerData: Customer) => {
    try {
      if (!customerData || !customerData._id) {
        throw new Error('Invalid customer data: Missing _id');
      }

      const response = await axiosInstance.put(`/api/customers/${customerData._id}`, customerData);
      const { customer: updatedCustomer, message } = response.data;

      if (!updatedCustomer || !updatedCustomer._id) {
        throw new Error('Invalid response: Updated customer data is missing or incomplete');
      }

      customersData.value.customers = customersData.value.customers.map(customer => 
        customer._id === updatedCustomer._id ? updatedCustomer : customer
      );

      return {
        customer: updatedCustomer,
        message: message || CustomerMessages.UPDATE_SUCCESS(updatedCustomer.name)
      };
    } catch (error: any) {
      console.error('Error updating customer:', error);
      const errorMessage = error.response?.data?.message || 
        CustomerMessages.UPDATE_ERROR(customerData.name);
      throw new Error(errorMessage);
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const customer = customersData.value.customers.find(c => c._id === id);
      const response = await axiosInstance.delete(`/api/customers/${id}`);
      customersData.value.customers = customersData.value.customers.filter(c => c._id !== id);
      customersData.value.totalCount--;
      return {
        message: response.data.message || CustomerMessages.DELETE_SUCCESS(customer?.name || 'Customer')
      };
    } catch (error: any) {
      console.error('Error deleting customer:', error);
      const customer = customersData.value.customers.find(c => c._id === id);
      const errorMessage = error.response?.data?.message || 
        CustomerMessages.DELETE_ERROR(customer?.name || 'Customer');
      throw new Error(errorMessage);
    }
  };

  const updateCustomerDevices = async (data: { customerId: string; devices: any[] }) => {
    try {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        throw new Error('User is not authenticated');
      }

      const response = await axiosInstance.put(`/api/customers/${data.customerId}/devices`, data, {
        headers: {
          'Authorization': `Bearer ${authStore.token}` 
        }
      });
      
      const { customer: updatedCustomer, message } = response.data;

      if (!updatedCustomer || !updatedCustomer._id) {
        throw new Error('Invalid response: Updated customer data is missing or incomplete');
      }

      customersData.value.customers = customersData.value.customers.map(customer => 
        customer._id === updatedCustomer._id ? updatedCustomer : customer
      );

      return {
        customer: updatedCustomer,
        message: message || CustomerMessages.DEVICE_UPDATE_SUCCESS(updatedCustomer.name)
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error updating customer devices:', error.stack);
      }
      throw error;
    }
  };

  const getCustomerById = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/api/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer by ID:', error);
      throw error;
    }
  };

  const fetchInstallations = async (page: number = 1, limit: number = 10, type: string = "", status: string = "") => {
    try {
      const response = await axiosInstance.get('/api/installations', {
        params: {
          page,
          limit,
          type,
          status
        }
      });
      installationsData.value = {
        installations: response.data.installations,
        totalCount: response.data.totalCount,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages,
        filterCounts: response.data.filterCounts
      };
    } catch (error) {
      console.error('Error fetching installations:', error);
      throw error;
    }
  };

  const addInstallation = async (newInstallationData: Partial<Installation>) => {
    try {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        throw new Error('User is not authenticated');
      }

      const response = await axiosInstance.post('/api/installations', newInstallationData, {
        headers: {
          'Authorization': `Bearer ${authStore.token}` 
        }
      });
      const newInstallation = response.data.newInstallation;
      if (installationsData.value.installations) {
        installationsData.value.installations.push(newInstallation);
      }
      if (installationsData.value.totalCount !== undefined) {
        installationsData.value.totalCount++;
      }
      return newInstallation;
    } catch (error) {
      console.error('Error adding installation:', error);
      throw error;
    }
  };

  const updateInstallation = async (installationData: any) => {
    try {
      if (!installationData || !installationData._id) {
        throw new Error('Invalid installation data: Missing _id');
      }

      const response = await axiosInstance.put(`/api/installations/${installationData._id}`, installationData);
      const updatedInstallation = response.data;

      if (!updatedInstallation || !updatedInstallation._id) {
        throw new Error('Invalid response: Updated installation data is missing or incomplete');
      }

      installationsData.value.installations = installationsData.value.installations.map((installation: Installation) => 
        installation._id === updatedInstallation._id ? updatedInstallation : installation
      );

      return updatedInstallation;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error stack:', error.stack);
      }
      throw error;
    }
  };

  const deleteInstallation = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/installations/${id}`);
      installationsData.value.installations = installationsData.value.installations.filter((installation: Installation) => installation._id !== id);
      installationsData.value.totalCount--;
    } catch (error) {
      console.error('Error deleting installation:', error);
      throw error;
    }
  };

  const getInstallationById = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/api/installations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching installation by ID:', error);
      throw error;
    }
  };

  const fetchAssignedTasks = async (params: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    userId?: string;
  }) => {
    try {
      const { page = 1, limit = 10, type = '', status = '', userId } = params;
      const queryParams: Record<string, string | number> = {
        page,
        limit,
        type,
        status,
      };
      if (userId) {
        queryParams.userId = userId;
      }
      const response = await axiosInstance.get('/api/installations/assigned-tasks', {
        params: queryParams
      });
      assignedTasksData.value = {
        assignedTasks: response.data.assignedTasks,
        totalCount: response.data.totalCount,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages,
        filterCounts: response.data.filterCounts || {}
      };
    } catch (error) {
      console.error('Error fetching assigned tasks:', error);
      throw error;
    }
  };

  const assignInstallation = async (userId: string, installationId: string) => {
    try {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        throw new Error('User is not authenticated');
      }

      const response = await axiosInstance.post('/api/installations/assign', { userId, installationId }, {
        headers: {
          'Authorization': `Bearer ${authStore.token}` 
        }
      });
      const newAssignedTask = response.data.assignedTask;
      
      // Update the installations data
      const updatedInstallation = installationsData.value.installations.find(
        installation => installation._id === installationId
      );
      if (updatedInstallation) {
        updatedInstallation.status = 'in-progress';
      }

      return newAssignedTask;
    } catch (error) {
      console.error('Error assigning installation:', error);
      throw error;
    }
  };

  const unassignInstallation = async (assignedTaskId: string) => {
    try {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        throw new Error('User is not authenticated');
      }

      const response = await axiosInstance.delete(`/api/installations/unassign/${assignedTaskId}`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}` 
        }
      });
      
      const { updatedInstallation, unassignedTaskId } = response.data;

      // Remove the task from assignedTasks
      assignedTasksData.value.assignedTasks = assignedTasksData.value.assignedTasks.filter(
        (task: AssignedTask) => task._id !== unassignedTaskId
      );

      // Update or add the installation to the installations list
      const existingIndex = installationsData.value.installations.findIndex(
        (installation) => installation._id === updatedInstallation._id
      );

      if (existingIndex !== -1) {
        // Update existing installation
        // installationsData.value.installations[existingIndex] = updatedInstallation;
      } else {
        // Add new installation to the list
        installationsData.value.installations.push(updatedInstallation);
      }

      // Optionally, you might want to update the total count
      // installationsData.value.totalCount = (installationsData.value.totalCount || 0) + 1;

      return response.data;
    } catch (error) {
      console.error('Error unassigning installation:', error);
      throw error;
    }
  };

  const approveOrRejectInstallation = async (
    installationId: string, 
    action: 'approve' | 'reject', 
    reason?: string,
    selectedService?: any
  ) => {
    try {
      const response = await axiosInstance.put(`/api/installations/${installationId}/${action}`, {
        reason,
        selectedService  // Make sure we're sending the selectedService in the request body
      });
      return response.data;
    } catch (error) {
      console.error(`Error ${action}ing installation:`, error);
      throw error;
    }
  };

  const fetchChecklistItems = async (params: FetchChecklistParams) => {
    try {
      // Remove empty parameters
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== '' && value != null)
      );

      const response = await axiosInstance.get('/api/creditcheck', {
        params: cleanParams
      });
      checklistData.value = response.data;
    } catch (error) {
      console.error('Error fetching checklist items:', error);
      throw error;
    }
  };

  const fetchServices = async (search: string = '', page: number = 1, limit: number = 200) => {
    try {
      servicesData.value.isLoading = true;
      const response = await axiosInstance.get('/api/delta/service', {
        params: {
          filter: '',
          search,
          limitFrom: (page - 1) * limit,
          limitCount: limit
        }
      });
      
      const services = response.data;
      const hasMore = services.length === limit;
      
      servicesData.value = {
        ...servicesData.value,
        services: page === 1 ? services : [...servicesData.value.services, ...services],
        totalCount: servicesData.value.services.length,
        page: page,
        limit: limit,
        isLoading: false,
        hasMore: hasMore,
      };

      return {
        services: services,
        hasMore: hasMore
      };
    } catch (error) {
      console.error('Error fetching Delta services:', error);
      servicesData.value.isLoading = false;
      throw error;
    }
  };

  const updateChecklistItemTotalPrice = (id: string, newPrice: number) => {
    const item = checklistData.value.items.find(item => item._id === id);
    if (item) {
      item.totalPrice = newPrice;
    }
  };

  const updateChecklistItemStatus = (id: string, newStatus: 'pending' | 'done' | 'others') => {
    const item = checklistData.value.items.find(item => item._id === id);
    if (item) {
      item.status = newStatus;
    }
  };

  const approveCreditCheck = async (creditCheckData: { id: string; status: string; deviceTotalPrice: number; packagePrice: number; totalPrice: number }) => {
    try {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        throw new Error('User is not authenticated');
      }

      const response = await axiosInstance.post(`/api/creditcheck/approve`, creditCheckData, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      });

      // Update only the specific item in the list
      const updatedItem = response.data.checklist;
      const index = checklistData.value.items.findIndex(item => item._id === updatedItem._id);
      if (index !== -1) {
        // Keep the array reference but update the specific item
        checklistData.value.items.splice(index, 1, updatedItem);
      }

      // Update filter counts if needed
      if (checklistData.value.filterCounts) {
        const oldStatus = checklistData.value.items[index]?.status;
        const newStatus = updatedItem.status;
        
        if (oldStatus && newStatus && oldStatus !== newStatus) {
          if (checklistData.value.filterCounts.status[oldStatus]) {
            checklistData.value.filterCounts.status[oldStatus]--;
          }
          if (checklistData.value.filterCounts.status[newStatus] !== undefined) {
            checklistData.value.filterCounts.status[newStatus]++;
          } else {
            checklistData.value.filterCounts.status[newStatus] = 1;
          }
        }
      }

      return response;
    } catch (error) {
      console.error('Error updating credit check:', error);
      throw error;
    }
  };

  const createPPoE = async (customerId: string) => {
    try {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        throw new Error('User is not authenticated');
      }

      const response = await axiosInstance.get(`/api/delta/ppoe/${customerId}`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      });

      if (!response.data || response.data.error) {
        throw new Error(response.data?.error || 'Failed to create PPPoE');
      }

      return response.data;
    } catch (error) {
      console.error('Error creating PPPoE:', error);
      throw error;
    }
  };

  const fetchInvoices = async (search: string = '') => {
    try {
      const response = await axiosInstance.get('/api/invoices', {
        params: { search }
      });
      return response.data as InvoicesData;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  };

  const fetchCustomerInvoices = async (customerId: string) => {
    try {
      const response = await axiosInstance.get(`/api/invoices/customer/${customerId}`);
      invoicesData.value = response.data;
    } catch (error) {
      console.error('Error fetching customer invoices:', error);
      throw error;
    }
  };

  const fetchCustomerWithInvoices = async (customerId: string) => {
    try {
      const response = await axiosInstance.get(`/api/invoices/customer-invoices/${customerId}`);
      const { customer, invoices, summary } = response.data;
      invoicesData.value = { invoices, summary };
      return { customer, invoices, summary };
    } catch (error) {
      console.error('Error fetching customer with invoices:', error);
      throw error;
    }
  };

  const makeInvoicePayment = async ({ invoiceId, amount, customerId, lineItemId, depositToAccountId, referenceNo, memo }: InvoicePaymentParams) => {
    try {
      console.log('Making payment:', { invoiceId, amount, customerId, lineItemId, depositToAccountId, referenceNo, memo });
      const response = await axiosInstance.post('/api/invoices/payment', {
        invoiceId,
        amount,
        customerId,
        lineItemId,
        depositToAccountId,
        referenceNo,
        memo
      });
      return response.data;
    } catch (error) {
      console.error('Payment failed:', error);
      throw error;
    }
  };

  const searchInvoiceCustomers = async (search: string ,fromQb: boolean = true) => {
    try {
      const response = await axiosInstance.get('/api/invoices/search-customers', {
        params: { search, fromQb }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching invoice customers:', error);
      throw error;
    }
  };

  const makeFullPayment = async (invoiceId: string, customerId: string, depositToAccountId: string) => {
    try {
      console.log('Processing full payment:', { invoiceId, customerId, depositToAccountId });
      const response = await axiosInstance.post('/api/invoices/payment/full', {
        invoiceId,
        customerId,
        depositToAccountId
      });
      
      // Refresh invoice data after successful payment
      await fetchCustomerInvoices(customerId);
      
      return response.data;
    } catch (error) {
      console.error('Full payment failed:', error);
      throw error;
    }
  };

  const syncCreditCheck = async (ids: string[]) => {
    try {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        throw new Error('User is not authenticated');
      }

      const response = await axiosInstance.post(`/api/creditcheck/sync`, { ids }, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      });

      // Update the local state if needed
      if (response.data.checklists) {
        response.data.checklists.forEach((updatedItem: any) => {
          const index = checklistData.value.items.findIndex(item => item._id === updatedItem._id);
          if (index !== -1) {
            checklistData.value.items[index] = updatedItem;
          }
        });
      }

      return response;
    } catch (error) {
      console.error('Error syncing credit check:', error);
      throw error;
    }
  };

  const toggleManualStatus = async (id: string, isManual: boolean) => {
    try {
      const response = await axiosInstance.put(`/api/creditcheck/${id}/manual`, { isManual });
      
      // Update the item in the store
      checklistData.value.items = checklistData.value.items.map(item => 
        item._id === id ? response.data.checklist : item
      );
      
      return response.data;
    } catch (error) {
      console.error('Error toggling manual status:', error);
      throw error;
    }
  };

  const toggleHideStatus = async (id: string) => {
    try {
      const response = await axiosInstance.put(`/api/creditcheck/${id}/hide`);
      
      // Remove the item from the list if it's hidden, or refresh the list if unhidden
      if (response.data.checklist.isHidden) {
        checklistData.value.items = checklistData.value.items.filter(item => item._id !== id);
        checklistData.value.totalCount--;
      } else {
        // Refresh the entire list to show unhidden item in correct position
        await fetchChecklistItems({
          page: checklistData.value.page,
          limit: checklistData.value.limit,
          status: '', // Use current filters
          type: '',
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Error toggling hide status:', error);
      throw error;
    }
  };

  const fetchDepositAccounts = async () => {
    try {
      const response = await axiosInstance.get('/api/invoices/deposit-accounts');
      return response.data as DepositAccount[];
    } catch (error) {
      console.error('Error fetching deposit accounts:', error);
      throw error;
    }
  };

  return {
    branchesData,
    fetchBranches,
    addBranch,
    updateBranch,
    getBranchById,
    deleteBranch,
    equipmentData,
    fetchEquipment,
    addEquipment,
    updateEquipment,
    getEquipmentById,
    deleteEquipment,
    token,
    customersData,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    updateCustomerDevices,
    getCustomerById,
    makeSecureRequest,
    installationsData,
    fetchInstallations,
    addInstallation,
    updateInstallation,
    deleteInstallation,
    getInstallationById,
    assignedTasksData,
    fetchAssignedTasks,
    assignInstallation,
    unassignInstallation,
    approveOrRejectInstallation,
    checklistData,
    fetchChecklistItems,
    servicesData,
    fetchServices,
    updateChecklistItemTotalPrice,
    updateChecklistItemStatus,
    approveCreditCheck,
    createPPoE,
    invoicesData,
    fetchInvoices,
    fetchCustomerInvoices,
    fetchCustomerWithInvoices,
    makeInvoicePayment,
    searchInvoiceCustomers,
    makeFullPayment,
    syncCreditCheck,
    toggleManualStatus,
    toggleHideStatus,
    fetchDepositAccounts
  }
})
