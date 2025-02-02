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
                                                {{ t('payments.receive.totalAmount') }}: {{
                                                parseFloat(form.totalAmount).toLocaleString() }} Af
                                            </div>
                                            <div class="text-green-600" v-if="form.paidAmount">
                                                {{ t('payments.receive.paidAmount') }}: {{
                                                parseFloat(form.paidAmount).toLocaleString() }} Af
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
                                        <SelectItem v-for="account in depositAccounts" :key="account.id"
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
                                <Button type="submit" :disabled="isSubmitting">
                                    <template v-if="isSubmitting">
                                        <span class="animate-spin mr-2">
                                            <svg class="h-4 w-4" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                            </svg>
                                        </span>
                                        {{ $t('payments.common.submitting') }}
                                    </template>
                                    <template v-else>
                                        {{ $t('payments.receive.saveAndClose') }}
                                    </template>
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
                            <CardTitle>{{ $t('payments.receive.transactionList') }}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup v-model="selectedTransaction" class="space-y-2">
                                <div v-for="transaction in transactions" :key="transaction.type">
                                    <div class="relative group rounded-lg transition-colors"
                                        @mouseenter="hoveredInvoice = transaction.type.split('#')[1]"
                                        @mouseleave="hoveredInvoice = null" @mousemove="updateMousePosition">
                                        <RadioGroupItem :id="transaction.type" :value="transaction.type" class="sr-only"
                                            @click="handleInvoiceClick(transaction)" />
                                        <Label :for="transaction.type"
                                            class="flex justify-between items-center p-3 rounded-lg border cursor-pointer"
                                            :class="{
                                                'border-2 border-primary bg-primary/5': selectedTransaction === transaction.type,
                                                'border-border hover:border-primary': selectedTransaction !== transaction.type
                                            }">
                                            <div>
                                                <p class="font-medium">{{ transaction.type }}</p>
                                                <p class="text-sm text-muted-foreground">{{ transaction.date }}</p>
                                            </div>
                                            <div class="text-right">
                                                <p class="font-medium">{{ formatCurrency(Math.abs(transaction.amount))
                                                    }}</p>
                                                <p class="text-sm" :class="{
                                                    'text-green-600': transaction.status === 'paid',
                                                    'text-yellow-600': transaction.status === 'partially_paid',
                                                    'text-red-600': transaction.status === 'unpaid'
                                                }">{{ transaction.status  }}</p>
                                            </div>
                                        </Label>

                                        <!-- Payment History Popup -->
                                        <div v-if="hoveredInvoice === transaction.type.split('#')[1] && hasPayments(transaction.type)" 
                                             class="fixed z-50 bg-card rounded-lg shadow-lg p-3 min-w-[300px] max-w-[400px]
                                                        border border-border opacity-0 invisible group-hover:opacity-100 
                                                        group-hover:visible transition-all duration-200 tooltip"
                                            :style="getTooltipPosition()" 
                                            @click.stop>
                                            <div class="text-xs space-y-2">
                                                <div class="font-semibold text-sm mb-2 text-foreground/90 border-b pb-2">
                                                    {{ t('payments.receive.paymentHistory') }}
                                                </div>
                                                <div v-for="payment in getInvoicePayments(transaction.type)"
                                                    :key="payment.id"
                                                    class="flex justify-between py-1 hover:bg-muted/50 rounded px-1">
                                                    <span class="text-muted-foreground">{{ formatDate(payment.date) }}</span>
                                                    <span class="font-medium text-foreground">{{ formatCurrency(payment.amount) }}</span>
                                                </div>

                                                <!-- Total and Balance Section -->
                                                <div class="border-t mt-2 pt-2 space-y-1">
                                                    <div class="flex justify-between text-sm">
                                                        <span class="text-muted-foreground">{{ t('payments.receive.totalToBePaid') }}</span>
                                                        <span class="font-medium text-green-500">
                                                            {{ transaction.totalAmount }}
                                                        </span>
                                                    </div>
                                                    <div class="flex justify-between text-sm">
                                                        <span class="text-muted-foreground">{{ t('payments.receive.remainingBalance') }}</span>
                                                        <span class="font-medium text-red-500">
                                                            {{ formatCurrency(Math.abs(transaction.amount)) }}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                                            calculatedEndDate }} </div>
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
import { ref, onMounted, computed, watch } from 'vue'
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
import { formatCurrency } from '@/utils/formatters'

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
    totalAmount: number;
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
const selectedTransaction = ref<string>('')
const hoveredInvoice = ref<string | null>(null)
const mousePosition = ref({ x: 0, y: 0 })
const isSubmitting = ref(false)

const handleSubmit = async () => {
    try {
        isSubmitting.value = true;  // Start loading
        
        if (!form.value.depositTo) {
            toast({
                title: 'Error',
                description: t('payments.receive.selectDepositAccount'),
                variant: 'destructive'
            });
            return;
        }

        // Get the base invoice number by removing the payment suffix
        const baseInvoiceNumber = form.value.referenceNo.split('-').slice(0, -1).join('-');
        console.log('Looking for invoice with number:', baseInvoiceNumber); // Debug log

        // Find the invoice using the base number
        const invoice = invoices.value.find(inv => inv.docNumber === baseInvoiceNumber);
        console.log('Found invoice:', invoice); // Debug log

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

        const paymentAmount = parseFloat(form.value.amount);
        if (isNaN(paymentAmount) || paymentAmount <= 0) {
            toast({
                title: 'Error',
                description: t('payments.receive.invalidAmount'),
                variant: 'destructive'
            });
            return;
        }

        // Create payment data
        const paymentData = {
            invoiceId: invoice.id,
            amount: paymentAmount,
            customerId: customerData.value.quickbooksCustomerId,
            lineItemId: invoice.id,
            depositToAccountId: form.value.depositTo,
            referenceNo: form.value.referenceNo, // Keep the full reference number with suffix
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
    } finally {
        isSubmitting.value = false;  // Stop loading
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
    selectedTransaction.value = '';
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
    console.log('Selected transaction:', transaction.type);
    selectedTransaction.value = transaction.type;

    // Extract invoice number from the transaction type
    const invoiceNumber = transaction.type.split('#')[1];
    const invoice = invoices.value.find((inv: Invoice) => inv.docNumber === invoiceNumber);

    if (!invoice) return;

    // Reset form
    handleClear();

    // Get the number of existing payments for this invoice
    const existingPaymentsCount = invoice.payments?.length || 0;
    
    // Generate the next reference number by adding 1 to the count
    const nextPaymentNumber = existingPaymentsCount + 1;
    const nextReferenceNumber = `${invoice.docNumber}-${nextPaymentNumber}`;

    // Calculate total paid amount and remaining balance
    const totalPaid = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const remainingBalance = Math.max(0, invoice.totalAmount - totalPaid);

    // Set the form values
    form.value = {
        ...form.value,
        customerName: customerData.value?.name || '',
        customerLastName: customerData.value?.lastName || '',
        customerId: customerData.value?._id || '',
        username: customerData.value?.username || '',
        paymentDate: new Date(),
        referenceNo: nextReferenceNumber,
        totalAmount: invoice.totalAmount.toString(),
        paidAmount: totalPaid.toString(),
        amount: remainingBalance.toString(),
        memo: invoice.memo || ''
    };

    // Rest of the existing code remains unchanged...
    const isServiceInvoice = invoice.lineItems.some((item: any) =>
        item.description === customerData.value?.currentService?.service.ServiceName
    );

    if (isServiceInvoice) {
        selectedInvoiceType.value = 'service';
        selectedInvoiceItems.value = [];

        const startDate = new Date(customerData.value?.currentService?.startDate || '');
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 6);

        form.value = {
            ...form.value,
            package: customerData.value?.currentService?.service.ServiceName || '',
            startDate: startDate,
            endDate: endDate
        };
    } else {
        selectedInvoiceType.value = 'device';
        selectedInvoiceItems.value = invoice.lineItems;
        form.value.package = '';
    }

    console.log('Form updated:', form.value);
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
                memo: invoice.memo,
                totalAmount: invoice.totalAmount
            });
        }
    });

    // Sort transactions by date, most recent first
    return transactions.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
};

const getTooltipPosition = () => {
    const offset = 10;
    return {
        left: `${mousePosition.value.x + offset}px`,
        top: `${mousePosition.value.y + offset}px`
    };
};

const updateMousePosition = (event: MouseEvent) => {
    mousePosition.value = {
        x: event.clientX,
        y: event.clientY
    };
};

const getInvoicePayments = (transactionType: string) => {
    const invoiceNumber = transactionType.split('#')[1];
    const invoice = invoices.value.find(inv => inv.docNumber === invoiceNumber);
    return invoice?.payments || [];
};

const getInvoiceTotalPaid = (transactionType: string) => {
    const payments = getInvoicePayments(transactionType);
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
};

// Add a watch to validate amount input
watch(() => form.value.amount, (newAmount) => {
    const amount = parseFloat(newAmount);
    const totalAmount = parseFloat(form.value.totalAmount);
    const paidAmount = parseFloat(form.value.paidAmount);
    const remainingBalance = totalAmount - paidAmount;

    if (amount > remainingBalance) {
        form.value.amount = remainingBalance.toString();
        toast({
            title: 'Warning',
            description: t('payments.receive.amountAdjusted'),
            variant: 'default'
        });
    }
});

// Add this computed property
const calculatedEndDate = computed(() => {
    if (!customerData.value?.currentService?.startDate) return '';

    const startDate = new Date(customerData.value.currentService.startDate);
    const serviceName = customerData.value.currentService.service.ServiceName;
    const duration = getServiceDurationInMonths(serviceName);

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + duration);

    return formatDate(endDate.toISOString());
});

// Make sure getServiceDurationInMonths is defined
const getServiceDurationInMonths = (packageName: string) => {
    if (packageName.includes('6-Month')) return 6;
    if (packageName.includes('3-Month')) return 3;
    if (packageName.includes('12-Month')) return 12;
    return 1; // default to 1 month if no duration found
};

// Add this computed property to check if an invoice has payments
const hasPayments = (transactionType: string) => {
    const invoiceNumber = transactionType.split('#')[1];
    const invoice = invoices.value.find(inv => inv.docNumber === invoiceNumber);
    return (invoice?.payments ?? []).length > 0;
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

<style scoped>
.tooltip {
    pointer-events: none;
}

/* Add these styles if needed */
.border-primary {
    border-color: hsl(var(--primary));
}

.bg-primary\/5 {
    background-color: hsl(var(--primary) / 0.05);
}
</style>