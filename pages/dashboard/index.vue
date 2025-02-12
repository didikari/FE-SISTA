<script setup lang="ts">
import { useUser } from "@/composables/api/useUser";

const { user } = useUser();
const authStore = useAuthStore();

const logout = () => {
  authStore.logout();
};

const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>

<template>
  <NuxtLayout>
    <div>
      <h1>Data Pengguna</h1>

      <!-- Menampilkan data hanya jika 'user' ada -->
      <div v-if="user?.id">
        <p><strong>ID:</strong> {{ user.id }}</p>
        <p><strong>Nama:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
      </div>

      <!-- Tampilkan loading jika data belum ada -->
      <div v-else>
        <p>Loading data pengguna...</p>
      </div>
      <button @click="logout" v-if="isAuthenticated">Logout</button>
    </div>
  </NuxtLayout>
</template>
