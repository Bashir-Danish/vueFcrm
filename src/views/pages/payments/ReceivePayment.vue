<template>
    <div class="p-4 md:p-6">
        <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-24 w-24 md:h-32 md:w-32 border-b-2 border-primary"></div>
        </div>

        <div v-else class="flex flex-col lg:flex-row gap-4 md:gap-6">
            <!-- Left Column - Payment Form -->
            <div class="w-full lg:w-[48%]">
                <Card>
                    <CardHeader>
                        <CardTitle class="text-lg md:text-xl">{{ $t('payments.receive.title') }}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form @submit.prevent="handleSubmit" class="space-y-4 md:space-y-6">
                            <!-- Customer Info -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                <div class="form-control">
                                    <label class="label">
                                        <span class="label-text">{{ $t('payments.receive.customerName') }}</span>
                                    </label>
                                    <Input :model-value="customerData?.custType === 'business'
                                        ? customerData?.companyName
                                        : `${customerData?.name || ''} ${customerData?.lastName || ''}`" />
                                </div>
                                <div class="form-control">
                                    <label class="label">
                                        <span class="label-text">{{ $t('payments.receive.customerId') }}</span>
                                    </label>
                                    <Input :model-value="customerData?.username" readonly />
                                </div>
                            </div>

                            <!-- Payment Details -->
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                                <div class="form-control">
                                    <label class="label">
                                        <span class="label-text">{{ $t('payments.receive.paymentDate') }}</span>
                                    </label>
                                    <DatePicker v-model="form.paymentDate"
                                        :placeholder="$t('payments.receive.paymentDate')" class="w-full" />
                                </div>
                                <div class="form-control">
                                    <label class="label">
                                        <span class="label-text">{{ $t('payments.receive.referenceNo') }}</span>
                                    </label>
                                    <Input v-model="form.referenceNo" required readonly />
                                </div>
                                <!-- Amount -->
                            <div class="form-control">
                                <label class="label">
                                        <span class="label-text">{{ t('payments.receive.amount') }}</span>
                                </label>
                                    <div class="space-y-2">
                                <Input v-model="form.amount" type="number" required />
                                        <div class="flex justify-between text-xs">
                                            <div class="text-muted-foreground flex " v-if="form.totalAmount">
                                                {{ t('payments.receive.totalAmount') }}: {{ parseFloat(form.totalAmount).toLocaleString() }} Af
                                            </div>
                                            <div class="text-green-600" v-if="form.paidAmount">
                                                {{ t('payments.receive.paidAmount') }}: {{ parseFloat(form.paidAmount).toLocaleString() }} Af
                                        </div>
                                        </div>
                                    </div>
                            </div>
                            </div>
                            <div class="form-control">
                                    <label class="label">
                                        <span class="label-text">{{ $t('payments.receive.depositTo') }}</span>
                                    </label>
                                    <Select v-model="form.depositTo">
                                        <SelectTrigger class="w-full">
                                            <SelectValue :placeholder="$t('payments.common.select')" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem v-for="account in depositAccounts" 
                                                       :key="account.id" 
                                                       :value="account.id">
                                                {{ account.name }} ({{ account.accountType }})
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                           

                            <!-- Service or Device Details -->
                            <div class="space-y-4">
                                <div class="form-control">
                                    <label class="label">
                                        <span class="label-text">{{
                                            selectedInvoiceType === 'service'
                                                ? $t('payments.receive.servicePayment')
                                                : $t('payments.receive.devicePayment')
                                        }}</span>
                                    </label>

                                    <!-- Service Details -->
                                    <div v-if="selectedInvoiceType === 'service'" class="space-y-4">
                                        <div class="form-control">
                                            <label class="label">
                                                <span class="label-text">{{ $t('payments.receive.package') }}</span>
                                            </label>
                                            <Input v-model="form.package" readonly />
                                        </div>

                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                            <div class="form-control">
                                                <label class="label">
                                                    <span class="label-text">{{ $t('payments.receive.startDate')
                                                        }}</span>
                                                </label>
                                                <DatePicker v-model="form.startDate" readonly class="w-full" />
                                            </div>
                                            <div class="form-control">
                                                <label class="label">
                                                    <span class="label-text">{{ $t('payments.receive.endDate') }}</span>
                                                </label>
                                                <DatePicker v-model="form.endDate" readonly class="w-full" />
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Device Details -->
                                    <div v-else-if="selectedInvoiceType === 'device'" class="bg-muted rounded-lg p-4">
                                        <ul class="space-y-3">
                                            <li v-for="(item, index) in selectedInvoiceItems" :key="index"
                                                class="flex flex-col md:flex-row justify-between items-start md:items-center p-3 bg-background rounded-lg">
                                                <div class="space-y-1">
                                                    <h4 class="font-medium">{{ item.description }}</h4>
                                                    <div class="text-sm text-muted-foreground">
                                                        {{ $t('payments.receive.quantity') }}: {{ item.quantity }}
                                                    </div>
                                                </div>
                                                <div class="space-y-1 text-right mt-2 md:mt-0">
                                                    <div class="font-medium">
                                                        {{ item.amount.toLocaleString() }} Af
                                                    </div>
                                                    <div class="text-sm text-muted-foreground">
                                                        {{ $t('payments.receive.unitPrice') }}: {{
                                                            item.unitPrice.toLocaleString() }} Af
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <!-- Memo -->
                            <div class="form-control w-full">
                                <label class="label">
                                    <span class="label-text">{{ $t('payments.receive.memo') }}</span>
                                </label>
                                <textarea v-model="form.memo"
                                    class="textarea border border-border h-full bg-background w-full mt-2 pt-2 px-2 py-1 focus:outline-none rounded-lg"></textarea>
                            </div>

                            <!-- Action Buttons -->
                            <div class="flex justify-end gap-4">
                                <Button variant="outline" type="button" @click="handleClear">
                                    {{ $t('payments.common.clear') }}
                                </Button>
                                <Button variant="outline" type="submit">
                                    {{ $t('payments.receive.saveAndPrint') }}
                                </Button>
                                <Button type="submit">
                                    {{ $t('payments.receive.saveAndClose') }}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <!-- Right Column -->
            <div class="w-full lg:w-[52%] flex flex-col md:flex-row gap-4 md:gap-6">
                <!-- First Column -->
                <div class="w-full md:w-1/2 space-y-4 md:space-y-6">
                    <span class="text-sm md:text-base text-muted-foreground font-semibold">
                        {{ customerData?.custType === 'business'
                            ? customerData?.companyName
                            : `${customerData?.name} ${customerData?.lastName} (${customerData?.username})` }}
                    </span>

                    <!-- Customer Summary Card -->
                    <Card>
                        <CardHeader class="flex flex-row items-center justify-between pb-2">
                            <CardTitle class="text-base md:text-lg font-semibold">
                                {{ $t('payments.receive.customerInfo') }}
                            </CardTitle>
                            <Button variant="outline" size="icon" class="h-8 w-8 md:h-9 md:w-9">
                                <ListIcon class="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div class="space-y-3 md:space-y-4">
                                <div class="p-3 md:p-4  rounded-lg">
                                    <div class="mb-3 md:mb-4">
                                        <div class="text-xs md:text-sm font-medium text-muted-foreground">
                                            {{ $t('payments.receive.summary') }}
                                        </div>
                                        <div class="text-xl md:text-2xl font-bold text-destructive">-41,500.00 Af</div>
                                        <div class="text-xs md:text-sm text-muted-foreground">
                                            {{ $t('payments.receive.openBalance') }}
                                        </div>
                                    </div>
                                    <div class="mb-3 md:mb-4">
                                        <div class="text-xs md:text-sm font-medium text-muted-foreground">
                                            {{ $t('payments.receive.summary') }}
                                        </div>
                                        <div class="text-xl md:text-2xl font-bold text-destructive">-41,500.00 Af</div>
                                        <div class="text-xs md:text-sm text-muted-foreground">
                                            {{ $t('payments.receive.openBalance') }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <!-- Recent Transactions Card -->
                    <Card>
                        <CardHeader>
                            <CardTitle class="text-base md:text-lg font-semibold">
                                {{ $t('payments.receive.transactionList') }}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup v-model="selectedTransaction" class="space-y-1 md:space-y-3">
                                <div v-for="(transaction, index) in transactions" :key="index"
                                    class="flex items-center p-1 md:p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer">
                                    <div class="mr-3">
                                        <RadioGroupItem 
                                            :value="transaction.type"
                                            :id="'transaction-' + index"
                                            class="data-[state=checked]:border-primary data-[state=checked]:text-primary"
                                            :disabled="!transaction.type.startsWith('Invoice')"
                                        />
                                    </div>
                                    <Label 
                                        :for="'transaction-' + index"
                                        class="flex-1 cursor-pointer"
                                        @click="transaction.type.startsWith('Invoice') && handleInvoiceClick(transaction)"
                                    >
                                        <div class="flex justify-between items-center">
                                            <div>
                                                <div class="text-sm md:text-base font-medium">{{ transaction.date }}</div>
                                                <div class="text-xs md:text-sm text-muted-foreground">
                                                    {{ transaction.type }}
                                                    <span v-if="transaction.status !== 'paid'" class="ml-2 text-xs">
                                                        ({{ transaction.status }})
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="text-sm md:text-base font-medium"
                                                :class="[
                                                    transaction.type.startsWith('Payment') ? 'text-green-600' : 'text-destructive',
                                                    selectedTransaction === transaction.type ? 'font-bold' : ''
                                                ]">
                                                {{ Math.abs(transaction.amount).toLocaleString() }} Af
                                            </div>
                                        </div>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </CardContent>
                    </Card>
                </div>

                <!-- Second Column -->
                <div class="w-full md:w-1/2 space-y-4 md:space-y-6">
                    <!-- Navigation Button -->
                    <Button class="w-full text-sm md:text-base" @click="$router.push('/payments')">
                        {{ $t('payments.list.title') }}
                    </Button>

                    <!-- Status Section -->
                    <div class="p-3 md:p-4 bg-muted rounded-lg">
                        <div class="flex justify-between items-center">
                            <div class="text-xs md:text-sm text-muted-foreground">
                                {{ $t('payments.receive.status') }}
                            </div>
                            <Select v-model="status">
                                <SelectTrigger class="w-[140px]">
                                    <SelectValue :placeholder="$t('payments.common.select')" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">{{ $t('payments.receive.active') }}</SelectItem>
                                    <SelectItem value="inactive">{{ $t('payments.receive.inactive') }}</SelectItem>
                                    <SelectItem value="suspended">{{ $t('payments.receive.suspended') }}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button class="mt-2 w-full text-xs md:text-sm" size="sm" variant="outline">
                            {{ $t('payments.receive.changeStatus') }}
                        </Button>
                    </div>

                    <!-- Service Details Card -->
                    <Card>
                        <CardHeader>
                            <CardTitle class="text-base md:text-lg font-semibold">
                                {{ $t('payments.receive.serviceDetails') }}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div class="space-y-4 md:space-y-6">
                                <!-- Active Service Info -->
                                <div class="p-3 md:p-4 bg-muted rounded-lg">
                                    <div class="text-xs md:text-sm text-muted-foreground"> {{
                                        $t('payments.receive.package') }} </div>
                                    <div class="text-sm md:text-base font-medium"> {{
                                        customerData?.currentService?.service.ServiceName }} </div>
                                    <div class="text-xs md:text-sm text-muted-foreground mt-2"> {{
                                        $t('payments.receive.price') }}: {{ customerData?.currentService?.service.Price
                                        }} Af </div>
                                </div>

                                <!-- Service Period -->
                                <div class="grid grid-cols-2 gap-3 md:gap-4">
                                    <div class="p-2 md:p-3 bg-muted rounded-lg">
                                        <div class="text-xs md:text-sm text-muted-foreground"> {{
                                            $t('payments.receive.startDate') }} </div>
                                        <div class="text-sm md:text-base font-medium"> {{
                                            formatDate(customerData?.currentService?.startDate) }} </div>
                                    </div>
                                    <div class="p-2 md:p-3 bg-muted rounded-lg">
                                        <div class="text-xs md:text-sm text-muted-foreground"> {{
                                            $t('payments.receive.endDate') }} </div>
                                        <div class="text-sm md:text-base font-medium"> {{
                                            formatDate(customerData?.currentService?.endDate) }} </div>
                                    </div>
                                </div>

                                <!-- Usage Progress -->
                                <div class="space-y-2">
                                    <div class="flex justify-between items-center">
                                        <span class="text-xs md:text-sm text-muted-foreground">
                                            {{ $t('payments.receive.usageStats.used') }} 140Gb
                                        </span>
                                        <span class="text-xs md:text-sm text-muted-foreground">
                                            {{ $t('payments.receive.usageStats.remaining') }} 60Gb
                                        </span>
                                    </div>
                                    <div class="w-full bg-muted rounded-full h-2 md:h-2.5">
                                        <div class="bg-primary h-full rounded-full" style="width: 70%"></div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <!-- Action Buttons Card -->
                    <Card>
                        <CardContent class="p-3 md:p-4">
                            <div class="space-y-2 md:space-y-3">
                                <Button class="w-full bg-primary text-white justify-center text-xs md:text-sm"
                                    variant="outline">
                                    <PlusIcon class="mr-2 h-3 w-3 md:h-4 md:w-4" />
                                    {{ $t('payments.receive.addService') }}
                                </Button>
                                <Button class="w-full bg-primary text-white justify-center text-xs md:text-sm"
                                    variant="outline">
                                    <PlayIcon class="mr-2 h-3 w-3 md:h-4 md:w-4" />
                                    {{ $t('payments.receive.startNextService') }}
                                </Button>
                                <Button class="w-full bg-destructive text-white justify-center text-xs md:text-sm"
                                    variant="outline">
                                    <XIcon class="mr-2 h-3 w-3 md:h-4 md:w-4" />
                                    {{ $t('payments.receive.cancelService') }}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { useI18n } from 'vue-i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast/use-toast'
import { ListIcon, PlusIcon, XIcon, PlayIcon } from 'lucide-vue-next'
import {
    RadioGroup,
    RadioGroupItem
} from "@/components/ui/radio-group"
import DatePicker from '@/components/DatePicker.vue'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Label } from '@/components/ui/label'

interface Customer {
    _id: string;
    name: string;
    lastName: string;
    username: string;
    quickbooksCustomerId: string;
    custType: 'individual' | 'business';
    companyName?: string;
    currentService?: {
        service: {
            ServiceName: string;
            Price: string;
        };
        startDate: string;
        endDate: string;
    };
}

interface Transaction {
    date: string;
    type: string;
    amount: number;
    status: string;
    memo: string;
}

interface Invoice {
    id: string;
    docNumber: string;
    date: string;
    totalAmount: number;
    balance: number;
    status: string;
    memo: string;
    lineItems: any[];
    payments: any[];
}

interface DepositAccount {
    id: string;
    name: string;
    accountType: string;
}

interface PaymentData {
    invoiceId: string;
    amount: number;
    customerId: string;
    lineItemId: string;
    depositToAccountId: string;
    referenceNo?: string;
    memo?: string;
}

const route = useRoute()
const mainStore = useMainStore()
const { toast } = useToast()
const { t } = useI18n()

const customerData = ref<Customer | null>(null)
const loading = ref(false)
const transactions = ref<Transaction[]>([])
const status = ref('active')
const invoices = ref<Invoice[]>([])
const depositAccounts = ref<DepositAccount[]>([])

const form = ref({
    customerName: '',
    customerLastName: '',
    customerId: '',
    username: '',
    paymentDate: new Date(),
    referenceNo: '',
    package: '',
    amount: '',
    paidAmount: '',
    totalAmount: '',
    packageNo: '',
    startDate: new Date(),
    endDate: new Date(),
    memo: '',
    depositTo: ''
})

const selectedInvoiceType = ref<'service' | 'device' | null>(null)
const selectedInvoiceItems = ref<any[]>([])
const selectedTransaction = ref<string | undefined>(undefined)

const handleSubmit = async () => {
    try {
        if (!form.value.depositTo) {
            toast({
                title: 'Error',
                description: t('payments.receive.selectDepositAccount'),
                variant: 'destructive'
            });
            return;
        }

        if (!selectedTransaction.value) {
            toast({
                title: 'Error',
                description: t('payments.receive.selectTransaction'),
                variant: 'destructive'
            });
            return;
        }

        const invoice = invoices.value.find(inv => 
            inv.docNumber === selectedTransaction.value?.split('#')[1]
        );

        if (!invoice) {
            toast({
                title: 'Error',
                description: t('payments.receive.invoiceNotFound'),
                variant: 'destructive'
            });
            return;
        }

        if (!customerData.value?.quickbooksCustomerId || !customerData.value?._id) {
            toast({
                title: 'Error',
                description: t('payments.receive.customerNotFound'),
                variant: 'destructive'
            });
            return;
        }

        // Create payment data
        const paymentData = {
            invoiceId: invoice.id,
            amount: parseFloat(form.value.amount),
            customerId: customerData.value.quickbooksCustomerId,
            lineItemId: invoice.id,
            depositToAccountId: form.value.depositTo,
            referenceNo: form.value.referenceNo || invoice.docNumber,
            memo: form.value.memo || `Payment for invoice #${invoice.docNumber}`
        };

        console.log('Submitting payment with data:', paymentData);

        const response = await mainStore.makeInvoicePayment(paymentData);

        if (response.success) {
            // Refresh customer data and invoices using MongoDB ID
            const result = await mainStore.fetchCustomerWithInvoices(customerData.value._id);
            
            // Update local data
            customerData.value = result.customer as Customer;
            invoices.value = result.invoices;
            transactions.value = transformInvoicesToTransactions(result.invoices);
            
            toast({
                title: 'Success',
                description: t('payments.receive.paymentSuccess'),
            });
            
            // Clear form
            handleClear();
        }
    } catch (error) {
        console.error('Payment failed:', error);
        toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Payment failed',
            variant: 'destructive'
        });
    }
};

const handleFullPayment = async (invoice: Invoice) => {
    try {
        if (!form.value.depositTo) {
            toast({
                title: 'Error',
                description: t('payments.receive.selectDepositAccount'),
                variant: 'destructive'
            });
            return;
        }

        if (!customerData.value?.quickbooksCustomerId || !customerData.value?._id) {
            toast({
                title: 'Error',
                description: t('payments.receive.customerNotFound'),
                variant: 'destructive'
            });
            return;
        }

        const response = await mainStore.makeFullPayment(
            invoice.id, 
            customerData.value.quickbooksCustomerId,
            form.value.depositTo
        );

        if (response.success) {
            // Refresh customer data and invoices using MongoDB ID
            const result = await mainStore.fetchCustomerWithInvoices(customerData.value._id);
            
            // Update local data
            customerData.value = result.customer as Customer;
            invoices.value = result.invoices;
            transactions.value = transformInvoicesToTransactions(result.invoices);
            
            toast({
                title: 'Success',
                description: t('payments.receive.fullPaymentSuccess'),
            });
            
            // Clear form
            handleClear();
        }
    } catch (error) {
        console.error('Full payment failed:', error);
        toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Full payment failed',
            variant: 'destructive'
        });
    }
};

const handleClear = () => {
    selectedTransaction.value = undefined;
    form.value = {
        customerName: customerData.value?.name || '',
        customerLastName: customerData.value?.lastName || '',
        customerId: customerData.value?._id || '',
        username: customerData.value?.username || '',
        paymentDate: new Date(),
        referenceNo: '',
        package: '',
        amount: '',
        paidAmount: '',
        totalAmount: '',
        packageNo: '',
        startDate: new Date(),
        endDate: new Date(),
        memo: '',
        depositTo: ''
    }
};

const handleInvoiceClick = (transaction: Transaction) => {
    // Extract invoice number from the transaction type
    const invoiceNumber = transaction.type.split('#')[1]
    const invoice = invoices.value.find((inv: Invoice) => inv.docNumber === invoiceNumber)

    if (!invoice) return

    // Reset form
    handleClear()

    // Set common fields
    form.value.paymentDate = new Date()
    form.value.referenceNo = invoice.docNumber
    form.value.totalAmount = invoice.totalAmount.toString()

    // Calculate total paid amount from all payments
    const totalPaid = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
    // Calculate actual remaining balance
    const remainingBalance = invoice.totalAmount - totalPaid;
    
    // Determine if invoice is fully paid
    const isFullyPaid = Math.abs(remainingBalance) < 0.01; // Using small threshold for floating point comparison

    // Check if it's a service invoice by looking at line items
    const isServiceInvoice = invoice.lineItems.some((item: any) =>
        item.description === customerData.value?.currentService?.service.ServiceName
    )

    if (isServiceInvoice) {
        selectedInvoiceType.value = 'service'
        selectedInvoiceItems.value = []
        
        // Fill service related fields
        form.value.package = customerData.value?.currentService?.service.ServiceName || ''
        form.value.startDate = new Date(customerData.value?.currentService?.startDate || '')
        form.value.endDate = new Date(customerData.value?.currentService?.endDate || '')
    } else {
        selectedInvoiceType.value = 'device'
        // Show all line items for reference
        selectedInvoiceItems.value = invoice.lineItems;
        form.value.package = ''
    }

    // Set the amounts consistently
    form.value.paidAmount = totalPaid.toString()
    form.value.amount = remainingBalance.toString()
    form.value.memo = invoice.memo
};

const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString()
};

const fetchAccounts = async () => {
    try {
        depositAccounts.value = await mainStore.fetchDepositAccounts()
    } catch (error) {
        console.error('Error fetching deposit accounts:', error)
        toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Failed to fetch deposit accounts',
            variant: 'destructive'
        })
    }
};

// Transform invoices into transactions with payment status
const transformInvoicesToTransactions = (invoices: Invoice[]) => {
    const transactions: Transaction[] = [];
    
    invoices.forEach(invoice => {
        // Calculate total paid amount from all payments
        const totalPaid = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
        // Calculate actual remaining balance
        const remainingBalance = invoice.totalAmount - totalPaid;
        
        // Determine if invoice is fully paid
        const isFullyPaid = Math.abs(remainingBalance) < 0.01; // Using small threshold for floating point comparison
        
        // Only include invoices that are not fully paid
        if (!isFullyPaid) {
            transactions.push({
                date: new Date(invoice.date).toLocaleDateString(),
                type: `Invoice #${invoice.docNumber}`,
                amount: -remainingBalance,
                status: remainingBalance === invoice.totalAmount ? 'unpaid' : 'partially_paid',
                memo: invoice.memo
            });
        }
    });

    // Sort transactions by date, most recent first
    return transactions.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
};

onMounted(async () => {
    try {
        loading.value = true
        const customerId = route.params.customerId as string
        if (!customerId) {
            toast({
                title: 'Error',
                description: 'Customer ID is required',
                variant: 'destructive'
            })
            return
        }

        await Promise.all([
            fetchAccounts(),
            mainStore.fetchCustomerWithInvoices(customerId).then(({ customer, invoices: fetchedInvoices }) => {
                customerData.value = customer as Customer
                invoices.value = fetchedInvoices
                
                // Transform invoices into transactions including payments
                transactions.value = transformInvoicesToTransactions(fetchedInvoices);
            })
        ])

    } catch (error: unknown) {
        console.error('Error fetching data:', error)
        toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Failed to fetch data',
            variant: 'destructive'
        })
    } finally {
        loading.value = false
    }
})
</script>