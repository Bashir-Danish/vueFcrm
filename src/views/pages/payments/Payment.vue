<template>
    <div class="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Search Input with Sticky Position -->
        <div class="w-full search-container bg-background"
            style="position: sticky; top: 0; z-index: 100; padding-top: 3rem; padding-bottom: 1rem;">
            <div class="relative max-w-lg mx-auto">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search class="h-5 w-5 text-gray-400" />
                </div>
                <Input 
                    :placeholder="t('payments.search.placeholder')" 
                    :value="search" 
                    @input="handleSearchChange"
                    class="w-full pl-10 rtl:text-right ltr:text-left" 
                />
                <div v-if="loading" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div class="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
            </div>

            <div v-if="search.length > 0 && search.length < 3" class="text-sm text-muted-foreground mt-2 text-center">
                {{ t('payments.search.minChars') }}
            </div>
        </div>

        <div class="mt-4">
            <!-- Loading Spinner -->
            <div v-if="loading" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>

            <!-- Empty State when no search -->
            <div v-if="!loading && !searchResults.length && search.length === 0"
                class="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <SearchIcon class="h-16 w-16 text-muted-foreground mb-4" />
                <p class="text-lg text-muted-foreground">
                    {{ t('payments.search.startSearching') }}
                </p>
            </div>

            <!-- Results Section with Transition -->
            <Transition enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 transform translate-y-4"
                enter-to-class="opacity-100 transform translate-y-0"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 transform translate-y-0"
                leave-to-class="opacity-0 transform translate-y-4">
                <div v-if="searchResults.length > 0 && !loading" class="mt-8">
                    <ul class="space-y-3">
                        <li v-for="customer in searchResults" :key="customer._id"
                            class="w-4/5 mx-auto relative flex cursor-pointer select-none rounded-lg px-4 py-3 hover:bg-card hover:text-muted-foreground transition-all duration-200 group border border-border hover:border-primary/20">
                            <div class="flex flex-row items-center w-full gap-4">
                                <div class="flex-1 flex justify-between">
                                    <!-- Left side: Name and username -->
                                    <div class="flex flex-col w-1/3">
                                        <!-- First row: Name and Company -->
                                        <div class="flex items-center gap-2">
                                            <span class="font-medium text-base">
                                                {{ customer.custType === 'business' ? customer.companyName : customer.name }}
                                            </span>
                                            <span v-if="customer.custType === 'business'" class="text-sm text-muted-foreground">
                                                ({{ customer.fullName }})
                                            </span>
                                        </div>
                                        
                                        <!-- Second row: Username -->
                                        <div class="text-sm text-muted-foreground">
                                            <span v-if="customer.username">@{{ customer.username }}</span>
                                        </div>
                                    </div>

                                    <!-- Middle: Contact info -->
                                    <div class="flex flex-col w-1/3 text-sm text-muted-foreground">
                                        <span v-if="customer.phones">📱 {{ customer.phones }}</span>
                                        <span v-if="customer.address">📍 {{ customer.address }}</span>
                                    </div>

                                    <!-- Right side: Action button -->
                                    <div class="flex items-center">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            class="flex items-center gap-2"
                                            @click.stop="navigateToPayment(customer._id)"
                                        >
                                            <CreditCard class="h-4 w-4" />
                                            {{ t('payments.actions.pay') }}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { useToast } from '@/components/ui/toast/use-toast'
import { useI18n } from 'vue-i18n'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchIcon, Search, CreditCard } from 'lucide-vue-next'

interface Customer {
    _id: string
    id?: string
    name: string
    fullName: string
    email: string
    phones: string
    username?: string
    address?: string
    quickbooksCustomerId?: string
    custType: 'business' | 'personal'
    companyName?: string
}

const route = useRoute()
const router = useRouter()
const mainStore = useMainStore()
const { t } = useI18n()
const { toast } = useToast()

const loading = ref(false)
const search = ref('')
const searchResults = ref<Customer[]>([])
const isSearching = ref(false)

// Debounce function
const debounce = (fn: Function, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>
    return function (...args: any[]) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn.apply(null, args), delay)
    }
}

const fetchCustomers = async (searchTerm: string) => {
    if (searchTerm.length < 3) {
        searchResults.value = []
        return
    }

    loading.value = true
    isSearching.value = true

    try {
        const response = await mainStore.searchInvoiceCustomers(searchTerm ,false)
        searchResults.value = response?.customers || []
    } catch (error) {
        console.error("Error fetching customers:", error)
        toast({
            title: t('payments.search.error'),
            description: error instanceof Error ? error.message : 'Failed to search customers',
            variant: 'destructive'
        })
        searchResults.value = []
    } finally {
        loading.value = false
        isSearching.value = false
    }
}

const debouncedFetch = debounce(fetchCustomers, 300)

const handleSearchChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    search.value = target.value

    if (!search.value.trim()) {
        searchResults.value = []
        loading.value = false
        return
    }

    if (search.value.length >= 3) {
        loading.value = true
        debouncedFetch(search.value)
    } else {
        searchResults.value = []
    }
}

const navigateToPayment = (customerId: string | undefined) => {
    if (!customerId) return;
    router.push(`/payments/receive/${customerId}`)
}

// Update URL when search changes
watch(() => search.value, (newValue) => {
    if (!newValue?.trim()) {
        searchResults.value = []
        loading.value = false
        // Remove search param from URL if empty
        router.replace({
            query: { 
                ...route.query,
                search: undefined
            }
        })
        return
    }

    if (newValue.length < 3) {
        searchResults.value = []
        // Remove search param from URL if less than 3 chars
        router.replace({
            query: { 
                ...route.query,
                search: undefined
            }
        })
    } else {
        // Update URL with search term
        router.replace({
            query: { 
                ...route.query,
                search: newValue
            }
        })
    }
})

// Initialize from URL params
onMounted(() => {
    const searchParam = route.query.search as string
    if (searchParam?.trim()) {
        search.value = searchParam
        if (search.value.length >= 3) {
            fetchCustomers(search.value)
        }
    }
})
</script>

<style scoped>
/* Add all the styles from InvoicesList.vue */
.search-container {
    position: relative;
}

/* Add smooth transitions */
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.transition-all {
    transition-property: all;
}

.duration-300 {
    transition-duration: 300ms;
}

.duration-200 {
    transition-duration: 200ms;
}

.ease-out {
    transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

.ease-in {
    transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}

/* Add these new styles */
.flex-col {
    display: flex;
    flex-direction: column;
}

.items-center {
    align-items: center;
}

.justify-center {
    justify-content: center;
}

.text-center {
    text-align: center;
}

/* Optional: Add hover effect for better UX */
li:hover {
    background-color: var(--muted);
    color: var(--muted-foreground);
}

/* Optional: Add spacing between items */
li+li {
    margin-top: 0.25rem;
}

.cursor-pointer {
    cursor: pointer;
}
</style>