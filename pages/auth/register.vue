<script setup lang="ts">
definePageMeta({
  layout: false,
});
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { ref, watch } from "vue";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "~/components/ui/toast";

const selectedRole = ref<string>("");

const { toast } = useToast();
const router = useRouter();

const formSchema = toTypedSchema(
  z
    .object({
      full_name: z.string().min(2, "Full Name is required"),
      username: z.string().min(2, "Username must be at least 2 characters"),
      email: z.string().email("Invalid email format"),
      phone: z.string().min(10, "Phone number is too short"),
      role: z.enum(["admin", "staff", "dosen", "kaprodi", "student"], {
        errorMap: () => ({ message: "Please select a valid role" }),
      }),
      nidn: z.string().optional(),
      nim: z.string().optional(),
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirm_password: z.string(),
    })
    .refine(
      (data) => (data.role !== "dosen" && data.role !== "kaprodi") || data.nidn,
      {
        message: "NIDN is required for lecturers",
        path: ["nidn"],
      }
    )
    .refine((data) => data.role !== "student" || data.nim, {
      message: "NIM is required for students",
      path: ["nim"],
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Passwords do not match",
      path: ["confirm_password"],
    })
);

const form = useForm({
  validationSchema: formSchema,
});

watch(
  () => form.values.role,
  (newRole) => {
    selectedRole.value = newRole ?? "";
  }
);

const onSubmit = form.handleSubmit((values) => {
  console.log(values);
  toast({
    description: "Add user successfully",
  });
  router.push("/dashboard");
  console.log("Form submitted!", values);
});
</script>

<template>
  <NuxtLayout>
    <div class="flex justify-center items-center min-h-screen p-6">
      <CardContent class="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold mb-6">User Registration</h2>
        <form @submit="onSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!--Start Name-->
          <FormField v-slot="{ componentField }" name="full_name">
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Full Name"
                  v-bind="componentField"
                  class="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!--End Name-->

          <!--Start Name-->
          <FormField v-slot="{ componentField }" name="username">
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Username"
                  v-bind="componentField"
                  class="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Email Address"
                  v-bind="componentField"
                  class="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="phone">
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  v-bind="componentField"
                  class="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Role (Dropdown) -->
          <FormField v-slot="{ componentField }" name="role">
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <select
                  v-bind="componentField"
                  class="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="dosen">Dosen</option>
                  <option value="kaprodi">Kaprodi</option>
                  <option value="student">Student</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- NIDN untuk Dosen dan Kaprodi -->
          <FormField
            v-if="selectedRole === 'dosen' || selectedRole === 'kaprodi'"
            v-slot="{ componentField }"
            name="nidn"
          >
            <FormItem>
              <FormLabel>NIDN</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="NIDN"
                  v-bind="componentField"
                  class="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- NIM untuk Student -->
          <FormField
            v-if="selectedRole === 'student'"
            v-slot="{ componentField }"
            name="nim"
          >
            <FormItem>
              <FormLabel>NIM</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="NIM"
                  v-bind="componentField"
                  class="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password"
                  v-bind="componentField"
                  class="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="confirm_password">
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  v-bind="componentField"
                  class="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="col-span-1 md:col-span-2">
            <Button
              type="submit"
              class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Submit
            </Button>
          </div>
        </form>
        <p class="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <router-link
            to="/auth/login"
            class="text-blue-500 hover:text-blue-700"
            >Login</router-link
          >
        </p>
      </CardContent>
    </div>
  </NuxtLayout>
</template>
