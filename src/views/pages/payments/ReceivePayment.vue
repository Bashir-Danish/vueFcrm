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
                                <!-- QuickBooks Balance -->
                                <div class="p-3 md:p-4 rounded-lg bg-muted/50">
                                    <div class="mb-3 md:mb-4">
                                        <div class="text-xs md:text-sm font-medium text-muted-foreground">
                                            {{ $t('payments.receive.quickbooksBalance') }}
                                        </div>
                                        <div class="text-xl md:text-2xl font-bold" :class="summary.arBalance < 0 ? 'text-destructive' : 'text-green-600'">
                                            {{ summary.arBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} Af
                                        </div>
                                    </div>
                                </div>

                                <!-- DeltaSIB Balance -->
                                <div class="p-3 md:p-4 rounded-lg bg-muted/50">
                                    <div class="mb-3 md:mb-4">
                                        <div class="text-xs md:text-sm font-medium text-muted-foreground">
                                            {{ $t('payments.receive.deltasibBalance') }}
                                        </div>
                                        <div class="text-xl md:text-2xl font-bold " :class="deltaSibPayBalanceClass">
                                            {{ deltaSibBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} Af
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
                                        <div v-if="hoveredInvoice === transaction.type.split('#')[1] || transaction.type === 'Unapplied Payment'" 
                                             class="fixed z-50 bg-card rounded-lg shadow-lg p-3 min-w-[300px] max-w-[400px]
                                                        border border-border opacity-0 invisible group-hover:opacity-100 
                                                        group-hover:visible transition-all duration-200 tooltip"
                                            :style="getTooltipPosition()" 
                                            @click.stop>
                                            <div class="text-xs space-y-2">
                                                <div class="font-semibold text-sm mb-2 text-foreground/90 border-b pb-2">
                                                    {{ transaction.type === 'Unapplied Payment' 
                                                        ? t('payments.receive.unappliedPayment')
                                                        : t('payments.receive.paymentHistory') }}
                                                </div>

                                                <!-- For Unapplied Payment -->
                                                <div v-if="transaction.type === 'Unapplied Payment'" class="text-green-600">
                                                    <div class="flex justify-between py-1">
                                                        <span>{{ t('payments.receive.availableAmount') }}</span>
                                                        <span class="font-medium">{{ formatCurrency(transaction.amount) }}</span>
                                                    </div>
                                                    <div class="text-muted-foreground text-xs mt-1">
                                                        {{ t('payments.receive.autoApplyNote') }}
                                                    </div>
                                                </div>

                                                <!-- For Regular Invoices -->
                                                <template v-else>
                                                    <!-- Show recorded payments -->
                                                <div v-for="payment in getInvoicePayments(transaction.type)"
                                                    :key="payment.id"
                                                        class="flex justify-between py-1 hover:bg-muted/50 rounded px-1"
                                                        :class="{ 'text-muted-foreground': !payment.isAutoApplied }">
                                                        <span>{{ formatDate(payment.date) }}</span>
                                                        <span class="font-medium">{{ formatCurrency(payment.amount) }}</span>
                                                    </div>

                                                    <!-- Show auto-applied amount if any -->
                                                    <div v-if="getAutoAppliedAmount(transaction.type) > 0"
                                                         class="flex justify-between py-1 hover:bg-muted/50 rounded px-1 text-green-600">
                                                        <span>{{ t('payments.receive.autoApplied') }}</span>
                                                        <span class="font-medium">{{ formatCurrency(getAutoAppliedAmount(transaction.type)) }}</span>
                                                </div>

                                                <!-- Total and Balance Section -->
                                                <div class="border-t mt-2 pt-2 space-y-1">
                                                    <div class="flex justify-between text-sm">
                                                            <span class="text-muted-foreground">{{ t('payments.receive.totalAmount') }}</span>
                                                            <span class="font-medium">
                                                                {{ formatCurrency(transaction.totalAmount) }}
                                                        </span>
                                                    </div>
                                                    <div class="flex justify-between text-sm">
                                                        <span class="text-muted-foreground">{{ t('payments.receive.remainingBalance') }}</span>
                                                            <span class="font-medium" :class="{
                                                                'text-green-600': transaction.status === 'paid',
                                                                'text-yellow-600': transaction.status === 'partially_paid',
                                                                'text-red-600': transaction.status === 'unpaid'
                                                            }">
                                                            {{ formatCurrency(Math.abs(transaction.amount)) }}
                                                        </span>
                                                    </div>
                                                </div>
                                                </template>
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
import { useAuthStore } from '@/stores/auth'
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
import instance from '@/utils/axios'

interface Customer {
    _id: string;
    name: string;
    lastName: string;
    username: string;
    quickbooksCustomerId: string;
    custType: 'individual' | 'business';
    companyName?: string;
    deltaSibUserId?: string;
    currentService?: {
        service: {
            ServiceName: string;
            Price: string;
        };
        startDate: string;
        endDate: string;
        payBalance?: number;
    };
}

interface Transaction {
    date: string;
    type: string;
    amount: number;
    status: 'paid' | 'partially_paid' | 'unpaid';
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
    summary?: {
        totalAmount: number;
        totalBalance: number;
        paidInvoices: number;
        unpaidInvoices: number;
        totalInvoices: number;
        unappliedAmount: number;
        quickBooksBalance: number;
        arBalance: number;
    };
}

interface Summary {
    quickBooksBalance: number;
    arBalance: number;
}

interface DepositAccount {
    id: string;
    name: string;
    accountType: string;
}

interface DeltaSibPayment {
    User_Payment_Id: string;
    PaymentType: string;
    Price: string;
    Paybalance: string;
    User_PaymentCDT: string;
    Comment: string;
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
const deltaSibPayments = ref<DeltaSibPayment[]>([])
const deltaSibBalance = ref(0)

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

const summary = ref<Summary>({
    quickBooksBalance: 0,
    arBalance: 0
})

const deltaSibPayBalanceClass = computed(() => {
    const balance = deltaSibBalance.value;
    return balance < 0 ? 'text-red-700' : 'text-green-600';
});

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

        // If no invoice is selected, create a deposit
        if (!selectedTransaction.value) {
            const depositData = {
                amount: paymentAmount,
                customerId: customerData.value.quickbooksCustomerId,
                depositToAccountId: form.value.depositTo,
                referenceNo: form.value.referenceNo,
                memo: form.value.memo || 'Customer deposit'
            };

            console.log('Creating deposit with data:', depositData);

            const response = await instance.post('/api/invoices/deposit', depositData);

            if (response.data.success) {
                toast({
                    title: 'Success',
                    description: t('payments.receive.depositSuccess'),
                });

                // Clear form
                handleClear();
            }

            return;
        }

        // If invoice is selected, proceed with normal payment
        console.log('Form reference number:', form.value.referenceNo); // Debug log
        console.log('Available invoices:', invoices.value); // Debug log

        // Get the invoice number from the selected transaction
        const selectedInvoiceNumber = selectedTransaction.value.split('#')[1];
        console.log('Selected invoice number:', selectedInvoiceNumber); // Debug log

        // Find the invoice using the selected invoice number
        const invoice = invoices.value.find(inv => inv.docNumber === selectedInvoiceNumber);
        console.log('Found invoice:', invoice); // Debug log

        if (!invoice) {
            toast({
                title: 'Error',
                description: t('payments.receive.invoiceNotFound') + ` (${selectedInvoiceNumber})`,
                variant: 'destructive'
            });
            return;
        }

        // Create payment data
        const paymentData = {
            invoiceId: invoice.id,
            amount: paymentAmount,
            customerId: customerData.value.quickbooksCustomerId,
            lineItemId: invoice.lineItems[0]?.Id || invoice.lineItems[0]?.Id || null, // Get the first line item ID or null
            depositToAccountId: form.value.depositTo,
            referenceNo: form.value.referenceNo, 
            memo: form.value.memo || `Payment for invoice #${invoice.docNumber}`
        };

        console.log('Invoice line items:', invoice.lineItems);
        
        console.log('Submitting payment with data:', paymentData);

        const response = await mainStore.makeInvoicePayment(paymentData);

        if (response.success) {
            // Refresh customer data and invoices using MongoDB ID
            const result = await mainStore.fetchCustomerWithInvoices(customerData.value._id);

            // Update local data
            customerData.value = result.customer as Customer;
            invoices.value = result.invoices;
            transactions.value = transformInvoicesToTransactions(result.invoices, result.summary);

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

const getLastUsedDepositAccount = (invoice: any) => {
    // First check the invoice's own payments
    if (invoice.payments && invoice.payments.length > 0) {
        const lastPayment = invoice.payments[invoice.payments.length - 1];
        if (lastPayment.depositToAccountId) {
            return lastPayment.depositToAccountId;
        }
    }

    // Then check individual line item payments
    for (const item of invoice.lineItems) {
        if (item.payments && item.payments.length > 0) {
            const lastPayment = item.payments[item.payments.length - 1];
            if (lastPayment.depositToAccountId) {
                return lastPayment.depositToAccountId;
            }
        }
    }

    return null;
};

const handleInvoiceClick = async (transaction: Transaction) => {
    console.log('Selected transaction:', transaction.type);
    selectedTransaction.value = transaction.type;

    // Extract invoice number from the transaction type
    const invoiceNumber = transaction.type.split('#')[1];
    const invoice = invoices.value.find((inv: Invoice) => inv.docNumber === invoiceNumber);

    if (!invoice) return;

    // Reset form
    handleClear();

    try {
        // Get the branch name from the auth store
        const authStore = useAuthStore();
        const branchName = authStore.user?.branch_id?.name || 'UNK';
        
        // Create branch abbreviation (take first letter of each word)
        const branchAbbr = branchName
            .split(' ')
            .map((word: string) => word.charAt(0))
            .join('')
            .toUpperCase();

        // First, get the last payment number from QuickBooks
        const lastPaymentResponse = await instance.get(`/api/invoices/payments`, {
            params: {
                customerId: customerData.value?.quickbooksCustomerId,
                limit: 1,
                page: 1
            }
        });

        // Extract the last payment number if exists
        let lastPaymentNumber = 0;
        if (lastPaymentResponse.data.payments && lastPaymentResponse.data.payments.length > 0) {
            const lastPayment = lastPaymentResponse.data.payments[0];
            // Try to extract number from reference number if it exists
            if (lastPayment.referenceNo) {
                const match = lastPayment.referenceNo.match(/\d+$/);
                if (match) {
                    lastPaymentNumber = parseInt(match[0]);
                }
            }
        }

        // Increment the number for the new payment
        const nextNumber = lastPaymentNumber + 1;
        
        // Format: BRANCH-NUMBER (e.g., KB-1)
        const nextReferenceNumber = `${branchAbbr}-${nextNumber}`;

        // Calculate remaining balance from QuickBooks balance
        const remainingBalance = invoice.balance;

        // Find the appropriate deposit account to use
        const findDepositAccount = () => {
            // First try to get the last used account for this specific invoice
            let account = getLastUsedDepositAccount(invoice);
            
            // If no account found for this invoice, try to get the last used account from any invoice
            if (!account) {
                for (const inv of invoices.value) {
                    const lastUsed = getLastUsedDepositAccount(inv);
                    if (lastUsed) {
                        account = lastUsed;
                        break;
                    }
                }
            }
            
            // If still no account found and we have deposit accounts, use the first one
            if (!account && depositAccounts.value.length > 0) {
                account = depositAccounts.value[0].id;
            }

            return account || '';
        };

        const selectedDepositAccount = findDepositAccount();
        console.log('Selected deposit account:', selectedDepositAccount);

        // Set the form values
        const formValues = {
            customerName: customerData.value?.name || '',
            customerLastName: customerData.value?.lastName || '',
            customerId: customerData.value?._id || '',
            username: customerData.value?.username || '',
            paymentDate: new Date(),
            referenceNo: nextReferenceNumber,
            totalAmount: invoice.totalAmount.toString(),
            paidAmount: (invoice.totalAmount - invoice.balance).toString(),
            amount: remainingBalance.toString(),
            memo: invoice.memo || '',
            depositTo: selectedDepositAccount,
            package: '',
            packageNo: '',
            startDate: new Date(),
            endDate: new Date()
        };

        // Handle service or device invoice
        const isServiceInvoice = invoice.lineItems.some((item: any) =>
            item.description === customerData.value?.currentService?.service.ServiceName
        );

        if (isServiceInvoice) {
            selectedInvoiceType.value = 'service';
            selectedInvoiceItems.value = [];

            const startDate = new Date(customerData.value?.currentService?.startDate || '');
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 6);

            formValues.package = customerData.value?.currentService?.service.ServiceName || '';
            formValues.startDate = startDate;
            formValues.endDate = endDate;
        } else {
            selectedInvoiceType.value = 'device';
            selectedInvoiceItems.value = invoice.lineItems;
        }

        // Update the form with all values at once
        form.value = formValues;

    } catch (error) {
        console.error('Error generating reference number:', error);
        toast({
            title: 'Error',
            description: 'Failed to generate reference number',
            variant: 'destructive'
        });
    }
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
const transformInvoicesToTransactions = (invoices: Invoice[], apiSummary: Summary): Transaction[] => {
    const transactions: Transaction[] = [];

    // Add unpaid/partially paid invoices to transactions
    invoices.forEach((invoice: Invoice) => {
        if (invoice.balance === 0) return;

        const status = invoice.balance === 0 ? 'paid' 
            : invoice.balance < invoice.totalAmount ? 'partially_paid' 
            : 'unpaid';

        transactions.push({
            date: new Date(invoice.date).toLocaleDateString(),
            type: `Invoice #${invoice.docNumber}`,
            amount: invoice.balance,
            status,
            memo: invoice.memo,
            totalAmount: invoice.totalAmount
        });
    });

    // Use the server-calculated balances
    summary.value = {
        quickBooksBalance: apiSummary.quickBooksBalance,
        arBalance: apiSummary.arBalance
    };

    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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

// Add this function before onMounted
const getNextReferenceNumber = async () => {
    try {
        // Get the branch name from the auth store
        const authStore = useAuthStore();
        const branchName = authStore.user?.branch_id?.name || 'UNK';
        
        // Create branch abbreviation (take first letter of each word)
        const branchAbbr = branchName
            .split(' ')
            .map((word: string) => word.charAt(0))
            .join('')
            .toUpperCase();

        // Get the last payment number from QuickBooks
        const lastPaymentResponse = await instance.get(`/api/invoices/payments`, {
            params: {
                limit: 1,
                page: 1,
                search: branchAbbr // Add branch abbreviation to search
            }
        });

        // Extract the last payment number if exists
        let lastPaymentNumber = 0;
        if (lastPaymentResponse.data.payments && lastPaymentResponse.data.payments.length > 0) {
            const lastPayment = lastPaymentResponse.data.payments[0];
            // Try to extract number from reference number if it exists
            if (lastPayment.referenceNo) {
                const match = lastPayment.referenceNo.match(new RegExp(`${branchAbbr}-(\\d+)$`));
                if (match) {
                    lastPaymentNumber = parseInt(match[1]);
                }
            }
        }

        // Increment the number for the new payment
        const nextNumber = lastPaymentNumber + 1;
        
        // Format: BRANCH-NUMBER (e.g., KB-1)
        return `${branchAbbr}-${nextNumber}`;
    } catch (error) {
        console.error('Error generating reference number:', error);
        return '';
    }
};

// Add this helper function after getInvoicePayments
const getAutoAppliedAmount = (transactionType: string) => {
    const invoiceNumber = transactionType.split('#')[1];
    const invoice = invoices.value.find(inv => inv.docNumber === invoiceNumber);
    if (!invoice) return 0;

    // Calculate total from recorded payments
    const totalRecordedPayments = invoice.payments.reduce((sum, payment) => 
        sum + (payment.isAutoApplied ? 0 : payment.amount), 0);
    
    // Calculate auto-applied amount (difference between total paid and recorded payments)
    const totalPaid = invoice.totalAmount - invoice.balance;
    return Math.max(0, totalPaid - totalRecordedPayments);
};

onMounted(async () => {
    try {
        loading.value = true;
        const customerId = route.params.customerId as string;
        if (!customerId) {
            toast({
                title: 'Error',
                description: 'Customer ID is required',
                variant: 'destructive'
            });
            return;
        }

        await Promise.all([
            fetchAccounts(),
            mainStore.fetchCustomerWithInvoices(customerId).then(async ({ customer, invoices: fetchedInvoices, summary: apiSummary }) => {
                console.log('\n[Frontend] Received Customer Data:', customer);
                console.log('\n[Frontend] Received Raw Invoices:', fetchedInvoices);
                console.log('\n[Frontend] Received Summary:', apiSummary);
                
                customerData.value = customer as Customer;
                invoices.value = fetchedInvoices;

                // Fetch DeltaSIB payments if customer has deltaSibUserId
                if (customerData.value?.deltaSibUserId) {
                    try {
                        const response = await instance.get(`/api/invoices/deltasib-payments/${customerData.value.deltaSibUserId}`);
                        deltaSibPayments.value = response.data.payments;
                        // Update deltaSibBalance with currentBalance from API response
                        deltaSibBalance.value = response.data.currentBalance;
                        // Update the currentService payBalance
                        if (customerData.value.currentService) {
                            customerData.value.currentService.payBalance = response.data.currentBalance;
                        }
                    } catch (error) {
                        console.error('Error fetching DeltaSIB payments:', error);
                    }
                }

                // Transform invoices into transactions including payments, passing the summary
                const transformedTransactions = transformInvoicesToTransactions(fetchedInvoices, apiSummary);
                console.log('\n[Frontend] Transformed Transactions:', transformedTransactions);
                
                transactions.value = transformedTransactions;
            }),
            // Get next reference number and set it in the form
            getNextReferenceNumber().then(refNo => {
                if (refNo) {
                    form.value.referenceNo = refNo;
                }
            })
        ]);

    } catch (error: unknown) {
        console.error('Error fetching data:', error);
        toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Failed to fetch data',
            variant: 'destructive'
        });
    } finally {
        loading.value = false;
    }
});
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