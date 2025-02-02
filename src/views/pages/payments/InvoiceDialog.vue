<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from '@/utils/formatters';

const props = defineProps<{
  invoice: any | null;
  open: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
}>();

const onOpenChange = (value: boolean) => {
  emit('update:open', value);
};
</script>

<template>
  <Dialog :open="open" @update:open="onOpenChange">
    <DialogContent class="max-w-3xl" v-if="invoice">
      <DialogHeader>
        <DialogTitle>Invoice Details - {{ invoice.docNumber }}</DialogTitle>
        <p class="text-sm text-muted-foreground">
          Customer: {{ invoice.customerName }}
        </p>
      </DialogHeader>

      <!-- Invoice Details Table -->
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead class="text-right">Amount</TableHead>
            <TableHead class="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="item in invoice.lineItems" :key="item.id">
            <TableCell>{{ item.id ? (item.description || 'No description') : 'Total' }}</TableCell>
            <TableCell class="text-right">{{ formatCurrency(item.amount) }}</TableCell>
            <TableCell class="text-right">
              <Badge :variant="invoice.status === 'paid' ? 'default' : 'secondary'" :class="{
                'bg-green-500 text-black': invoice.status === 'paid',
                'bg-yellow-500 text-black': invoice.status !== 'paid'
              }" v-if="!item.id">
                {{ invoice.status === 'paid' ? 'Paid' : 'Partially Paid' }}

              </Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <!-- Payment History -->
      <div v-if="invoice.payments?.length" class="mt-6">
        <h3 class="font-medium mb-3">Payment History</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead class="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="payment in invoice.payments" :key="payment.id">
              <TableCell>{{ formatDate(payment.date) }}</TableCell>
              <TableCell>{{ payment.referenceNo }}</TableCell>
              <TableCell class="text-right">{{ formatCurrency(payment.amount) }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </DialogContent>
  </Dialog>
</template>