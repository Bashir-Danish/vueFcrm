<script setup>
import { ref } from 'vue';

const customers = ref([
  {
    "currentPackage": {
      "package": {
        "_id": "66afffc127abcfed45c64738",
        "name": "2 MB monthly",
        "price": 1399,
        "__v": 0
      },
      "startDate": "2024-10-17T07:20:54.282Z",
      "paid": false
    },
    "_id": "6710bad612edf0ba45fca75d",
    "custType": "individual",
    "name": "DOS",
    "lastName": "danish",
    "email": "dosdanish@gmail.com",
    "nid": 13992120021222,
    "address": "herat",
    "date": "2024-10-17T07:20:11.642Z",
    "customFields": [
      {
        "key": "test",
        "value": "test",
        "_id": "6710bad612edf0ba45fca75e"
      },
      {
        "key": "test",
        "value": "test",
        "_id": "6710bad612edf0ba45fca75f"
      }
    ],
    "phones": [
      "0799434343"
    ],
    "internetUsage": "Yes",
    "terminationReason": "customerService",
    "familiarityWithUs": "through a friend",
    "internetUsagePurpose": "personal",
    "previousPackage": "1 MB monthly",
    "isReturningCustomer": false,
    "devices": [
      {
        "device": {
          "_id": "66f492b8f3a1bd710ad43402",
          "name": "LHG5",
          "model": "LHG 5",
          "company": "Mikrotik",
          "unit": "piece",
          "price": 89.99,
          "__v": 0
        },
        "quantity": 1,
        "paid": false,
        "purchaseDate": "2024-10-17T07:21:05.762Z",
        "_id": "6710bae112edf0ba45fca774"
      },
      {
        "device": {
          "_id": "66f9cb44a9bc73b088df3671",
          "name": "tp link",
          "model": "axe75",
          "company": "tp link",
          "unit": "piece",
          "price": 175,
          "__v": 0
        },
        "quantity": 1,
        "paid": false,
        "purchaseDate": "2024-10-17T07:21:05.960Z",
        "_id": "6710bae112edf0ba45fca775"
      }
    ],
    "paymentHistory": [
      { date: '2024-09-15', amount: 1399 },
      { date: '2024-08-15', amount: 1399 },
      { date: '2024-07-15', amount: 1399 }
    ],
    "packageHistory": [
      { name: "1 MB monthly", startDate: "2024-07-01", endDate: "2024-10-16" }
    ],
    "customerId": 1,
    "__v": 0,
    "signalStrength": "Good",
    "ccq": 95,
    "connectedUsers": 2,
    "cableStatus": true,
    "routerStatus": true,
    "peviStatus": true
  },
  {
    "currentPackage": {
      "package": {
        "_id": "66afffb327abcfed45c64736",
        "name": "4 MB monthly",
        "price": 1999,
        "__v": 0
      },
      "startDate": "2024-10-17T07:22:43.601Z",
      "paid": true
    },
    "_id": "6710bb4312edf0ba45fca7da",
    "custType": "business",
    "name": "khalil ah",
    "lastName": "danish",
    "email": "khalil@gmail.com",
    "address": "herat",
    "companyName": "Jami university",
    "licenseNo": 1399100022121,
    "date": "2024-10-17T07:21:47.644Z",
    "customFields": [
      {
        "key": "test",
        "value": "test",
        "_id": "6710bb4312edf0ba45fca7db"
      }
    ],
    "activity": "university",
    "phones": [
      "6346453453",
      "6346453453",
      "6346453453"
    ],
    "internetUsage": "Yes",
    "terminationReason": "quality,customerService",
    "familiarityWithUs": "through a friend",
    "internetUsagePurpose": "development",
    "previousPackage": "2 MB monthly",
    "isReturningCustomer": true,
    "devices": [
      {
        "device": {
          "_id": "66f492b8f3a1bd710ad43402",
          "name": "LHG5",
          "model": "LHG 5",
          "company": "Mikrotik",
          "unit": "piece",
          "price": 89.99,
          "__v": 0
        },
        "quantity": 1,
        "paid": true,
        "purchaseDate": "2024-10-17T07:22:59.552Z",
        "_id": "6710bb5312edf0ba45fca7f7"
      },
      {
        "device": {
          "_id": "66f9cb44a9bc73b088df3671",
          "name": "tp link",
          "model": "axe75",
          "company": "tp link",
          "unit": "piece",
          "price": 175,
          "__v": 0
        },
        "quantity": 5,
        "paid": true,
        "purchaseDate": "2024-10-17T07:22:59.856Z",
        "_id": "6710bb5312edf0ba45fca7f8"
      }
    ],
    "paymentHistory": [
      { date: '2024-10-15', amount: 1999 },
      { date: '2024-09-15', amount: 1999 },
      { date: '2024-08-15', amount: 1999 },
      { date: '2024-07-15', amount: 1399 }
    ],
    "packageHistory": [
      { name: "2 MB monthly", startDate: "2024-07-01", endDate: "2024-10-16" }
    ],
    "customerId": 2,
    "__v": 0,
    "signalStrength": "Excellent",
    "ccq": 98,
    "connectedUsers": 15,
    "cableStatus": true,
    "routerStatus": true,
    "peviStatus": true
  }
]);

const searchQuery = ref('');
const selectedCustomer = ref(null);
const searchPerformed = ref(false);

const performSearch = () => {
  searchPerformed.value = true;
  const query = searchQuery.value.toLowerCase();
  const result = customers.value.find(customer => 
    customer.name.toLowerCase().includes(query) ||
    customer.lastName.toLowerCase().includes(query) ||
    customer.email.toLowerCase().includes(query) ||
    customer.phones.some(phone => phone.includes(query))
  );
  selectedCustomer.value = result || null;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const getInitials = (firstName, lastName) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
};

const getAvatarColor = (name) => {
  const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const capitalize = (value) => {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
};
</script>

<template>
  <div class="customer-search mx-auto px-4 py-8">
    <div class="search-container sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4">
      <div class="relative max-w-md mx-auto">
        <input 
          v-model="searchQuery" 
          @input="performSearch" 
          placeholder="Search customers..." 
          class="w-full py-3 px-5 text-sm border border-input bg-background rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 ease-in-out"
        />
        <i class="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground fas fa-search text-sm"></i>
      </div>
    </div>

    <transition name="fade">
      <div v-if="searchPerformed && !selectedCustomer" class="text-center text-muted-foreground mt-12">
        <i class="fas fa-user-astronaut text-6xl mb-4 text-primary/40 animate-float"></i>
        <p class="text-lg font-medium">No customers found. Try a different search term.</p>
      </div>
    </transition>

    <transition name="slide-fade">
      <div v-if="selectedCustomer" class="customer-details bg-card rounded-2xl shadow-2xl p-8 mt-12 border border-border overflow-hidden">
        <div class="relative overflow-hidden mb-8">
          <div class="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/10 opacity-50"></div>
          <div class="relative z-10 flex items-center space-x-6">
            <div class="customer-avatar w-24 h-24 text-2xl rounded-full flex items-center justify-center shadow-lg border-4 border-background" :style="{ backgroundColor: getAvatarColor(selectedCustomer.name) }">
              {{ getInitials(selectedCustomer.name, selectedCustomer.lastName) }}
            </div>
            <div class="flex-grow">
              <h2 class="text-3xl font-bold text-foreground mb-2">{{ selectedCustomer.name }} {{ selectedCustomer.lastName }}</h2>
              <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <p class="flex items-center"><i class="fas fa-envelope mr-2 text-primary"></i> {{ selectedCustomer.email }}</p>
                <p class="flex items-center"><i class="fas fa-phone mr-2 text-primary"></i> {{ selectedCustomer.phones.join(', ') }}</p>
                <p class="flex items-center"><i class="fas fa-map-marker-alt mr-2 text-primary"></i> {{ selectedCustomer.address }}</p>
                <p v-if="selectedCustomer.custType === 'business'" class="flex items-center"><i class="fas fa-building mr-2 text-primary"></i> {{ selectedCustomer.companyName }}</p>
                <p v-if="selectedCustomer.custType === 'business'" class="flex items-center"><i class="fas fa-id-card mr-2 text-primary"></i> {{ selectedCustomer.licenseNo }}</p>
                <p v-if="selectedCustomer.custType === 'individual'" class="flex items-center"><i class="fas fa-id-badge mr-2 text-primary"></i> {{ selectedCustomer.nid }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="info-card bg-card rounded-xl shadow-md p-6 border border-border transition-all duration-300 hover:shadow-lg hover:scale-105">
            <h3 class="text-lg font-semibold mb-4 flex items-center"><i class="fas fa-box-open mr-3 text-primary"></i> Package Information</h3>
            <div class="space-y-3 text-sm">
              <p><span class="font-medium">Current Package:</span> {{ selectedCustomer.currentPackage.package.name }}</p>
              <p><span class="font-medium">Price:</span> ${{ selectedCustomer.currentPackage.package.price }}</p>
              <p><span class="font-medium">Start Date:</span> {{ formatDate(selectedCustomer.currentPackage.startDate) }}</p>
              <p><span class="font-medium">Status:</span> 
                <span class="status px-3 py-1 rounded-full text-xs font-medium" :class="selectedCustomer.currentPackage.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ selectedCustomer.currentPackage.paid ? 'Paid' : 'Unpaid' }}
                </span>
              </p>
            </div>
          </div>

          <div class="info-card bg-card rounded-xl shadow-md p-6 border border-border transition-all duration-300 hover:shadow-lg hover:scale-105">
            <h3 class="text-lg font-semibold mb-4 flex items-center"><i class="fas fa-network-wired mr-3 text-primary"></i> Network Information</h3>
            <div class="space-y-3 text-sm">
              <p><span class="font-medium">Bandwidth:</span> {{ selectedCustomer.currentPackage.package.name }}</p>
              <p><span class="font-medium">Signal Strength:</span> <span class="font-medium text-primary">{{ selectedCustomer.signalStrength }}</span></p>
              <p><span class="font-medium">CCQ:</span> {{ selectedCustomer.ccq }}%</p>
              <p><span class="font-medium">Connected Users:</span> {{ selectedCustomer.connectedUsers }}</p>
              <div class="grid grid-cols-3 gap-3 mt-4">
                <div class="flex items-center justify-between bg-muted rounded-lg p-2">
                  <span class="flex items-center"><i class="fas fa-ethernet text-primary mr-2"></i> Cable</span>
                  <i :class="['fas', selectedCustomer.cableStatus ? 'text-green-500 fa-check-circle' : 'text-red-500 fa-times-circle']"></i>
                </div>
                <div class="flex items-center justify-between bg-muted rounded-lg p-2">
                  <span class="flex items-center"><i class="fas fa-router text-primary mr-2"></i> Router</span>
                  <i :class="['fas', selectedCustomer.routerStatus ? 'text-green-500 fa-check-circle' : 'text-red-500 fa-times-circle']"></i>
                </div>
                <div class="flex items-center justify-between bg-muted rounded-lg p-2">
                  <span class="flex items-center"><i class="fas fa-broadcast-tower text-primary mr-2"></i> PEVI</span>
                  <i :class="['fas', selectedCustomer.peviStatus ? 'text-green-500 fa-check-circle' : 'text-red-500 fa-times-circle']"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="info-card bg-card rounded-xl shadow-md p-6 border border-border transition-all duration-300 hover:shadow-lg hover:scale-105">
            <h3 class="text-lg font-semibold mb-4 flex items-center"><i class="fas fa-file-invoice-dollar mr-3 text-primary"></i> Payment History</h3>
            <div v-if="selectedCustomer.paymentHistory.length === 0" class="text-center text-muted-foreground">
              <i class="fas fa-piggy-bank text-4xl mb-2 text-primary/40"></i>
              <p class="text-sm">No payment history available yet</p>
            </div>
            <ul v-else class="space-y-3 text-sm">
              <li v-for="payment in selectedCustomer.paymentHistory" :key="payment.date" class="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                <span class="text-muted-foreground">{{ formatDate(payment.date) }}</span>
                <span class="font-medium text-green-600">${{ payment.amount }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.customer-search {
  max-width: 1200px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease-out;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(30px);
  opacity: 0;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
.animate-float {
  animation: float 3s ease-in-out infinite;
}

.info-card {
  transition: all 0.3s ease;
}

.info-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
