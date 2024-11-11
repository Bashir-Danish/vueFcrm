<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue"; 
import { useUserStore } from "@/stores/user";
import { useMainStore } from "@/stores/main"; 
import { User } from "@/types/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  isOpen: boolean;
  user?: User;
  mode: 'add' | 'update' | 'invite';
}>();

const emit = defineEmits<{
  (e: "update:is-open", value: boolean): void;
  (e: "user-added"): void;
  (e: "user-updated"): void;
  (e: "user-invited"): void;
}>();

const userStore = useUserStore();
const mainStore = useMainStore();

const name = ref("");
const email = ref("");
const role = ref<User['role']>("installer");
const password = ref("");
const branchId = ref("");

const branches = computed(() => mainStore.branchesData.branches);

onMounted(() => {
  if (mainStore.branchesData.branches.length === 0) {
    mainStore.fetchBranches();
  }
});

watch(() => props.user, (newUser) => {
  if (newUser && props.mode === 'update') {
    name.value = newUser.name;
    email.value = newUser.email;
    role.value = newUser.role;
    branchId.value = typeof newUser.branch_id === 'object' ? newUser.branch_id._id : newUser.branch_id || "";
  } else {
    name.value = "";
    email.value = "";
    role.value = "installer";
    password.value = "";
    branchId.value = "";
  }
}, { immediate: true });

const handleSubmit = async () => {
  try {
    const userData = {
      name: name.value,
      email: email.value,
      role: role.value,
      branch_id: branchId.value,
    };

    if (props.mode === 'update' && props.user) {
      await userStore.updateUser({
        ...props.user,
        ...userData,
      });
      emit("user-updated");
    } else if (props.mode === 'add') {
      await userStore.addUser({
        ...userData,
        password: password.value,
      });
      emit("user-added");
    } else if (props.mode === 'invite') {
      await userStore.inviteUser(userData);
      emit("user-invited");
    }
    emit("update:is-open", false);
  } catch (error) {
    console.error("Error adding/updating/inviting user:", error);
  }
};

const roles: User['role'][] = ["admin", "noc", "installer", "financeAdmin", "sales", "creditChecker", "cashier"];
</script>

<template>
  <Dialog :open="isOpen" @update:open="$emit('update:is-open', $event)">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>{{ t(`users.dialog.${mode}.title`) }}</DialogTitle>
        <DialogDescription>
          {{ t(`users.dialog.${mode}.description`) }}
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleSubmit">
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="name" class="text-left rtl:text-right w-24">{{ t('users.fields.name') }}</Label>
            <Input id="name" v-model="name" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="email" class="text-left rtl:text-right w-24">{{ t('users.fields.email') }}</Label>
            <Input id="email" v-model="email" type="email" class="col-span-3" :disabled="mode === 'update'" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="role" class="text-left rtl:text-right w-24">{{ t('users.fields.role') }}</Label>
            <div class="col-span-3">
              <Select v-model="role">
                <SelectTrigger class="w-full">
                  <SelectValue :placeholder="t('users.fields.selectRole')" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="r in roles" :key="r" :value="r">
                    {{ r }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="branch" class="text-left rtl:text-right w-24">{{ t('users.fields.branch') }}</Label>
            <div class="col-span-3">
              <Select v-model="branchId">
                <SelectTrigger class="w-full">
                  <SelectValue :placeholder="t('users.fields.selectBranch')" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="branch in branches" :key="branch._id" :value="branch._id">
                    {{ branch.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div v-if="mode === 'add'" class="grid grid-cols-4 items-center gap-4">
            <Label for="password" class="text-left rtl:text-right w-24">{{ t('users.fields.password') }}</Label>
            <Input id="password" v-model="password" type="password" class="col-span-3" />
          </div>
        </div>
        <DialogFooter class="rtl:flex-row-reverse">
          <Button type="submit">
            {{ mode === 'invite' ? t('users.buttons.sendInvitation') : t('users.buttons.save') }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>