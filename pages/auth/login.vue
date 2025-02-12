<script setup lang="ts">
definePageMeta({
  layout: false,
});
import { useNuxtApp } from "#app";
import { ref, onMounted } from "vue";
import { useToast } from "~/components/ui/toast";
import { useAuthStore } from "~/stores/authStore";
import { NuxtLayout } from "#components";

const { $apiClient } = useNuxtApp();

const { toast } = useToast();
const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");

onMounted(() => {
  if (authStore.token) {
    navigateTo(authStore.redirectPath || "/dashboard");
  }
});

const login = async () => {
  try {
    const response = await $apiClient<{ access_token: string }>("/auth/login", {
      method: "POST",
      body: { email: email.value, password: password.value },
    });

    authStore.setToken(response.access_token);
    navigateTo(authStore.redirectPath || "/dashboard");
  } catch (error) {
    console.error("Login gagal:", error);
  }
};
</script>

<template>
  <NuxtLayout>
    <div
      v-if="!authStore.token"
      class="flex justify-center items-center min-h-screen bg-gray-100"
    >
      <div class="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold text-center text-gray-700 mb-6">
          Login
        </h2>

        <form @submit.prevent="login">
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-600"
              >Email</label
            >
            <input
              type="email"
              id="email"
              v-model="email"
              class="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div class="mb-6">
            <label
              for="password"
              class="block text-sm font-medium text-gray-600"
              >Password</label
            >
            <input
              type="password"
              id="password"
              v-model="password"
              class="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <input
                type="checkbox"
                id="remember"
                class="form-checkbox text-blue-500"
              />
              <label for="remember" class="ml-2 text-sm text-gray-600"
                >Remember me</label
              >
            </div>
            <a href="#" class="text-sm text-blue-500 hover:text-blue-700"
              >Forgot password?</a
            >
          </div>

          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Login
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-gray-600">
          Don't have an account?
          <router-link
            to="/auth/register"
            class="text-blue-500 hover:text-blue-700"
            >Sign up</router-link
          >
        </p>
      </div>
    </div>
  </NuxtLayout>
</template>
