<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ref } from "vue";
import Modal from "@/components/Modal.vue";
import { useModalStore } from "@/stores/modal";
import { data, type NavItem } from "@/data/navigation";
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-vue-next";
import { useUserStore } from "~/stores/user/userStore";

const activeTeam = ref(data.teams[0]);
const route = useRoute();
const userStore = useUserStore();
const authStore = useAuthStore();
// const isActive = (item: { url: string }) => {
//   return route.path === item.url || route.path.startsWith(item.url + "/");
// };

const isActive = (item: { url: string; items?: NavItem[] }) => {
  return (
    route.path.startsWith(item.url) ||
    item.items?.some((subItem) => route.path.startsWith(subItem.url))
  );
};

const userRoles = ref(userStore.roles);

const roleAccessMap: Record<string, string[]> = {
  Users: ["admin", "dosen"],
  Grades: ["admin", "dosen"],
  Documentation: ["admin"],
  Settings: ["admin"],
};

const hasAccess = (title: string) => {
  return roleAccessMap[title]
    ? userRoles.value.some((role) => roleAccessMap[title].includes(role))
    : true;
};

const filteredNavMain = computed(() =>
  data.navMain.filter((item) => hasAccess(item.title))
);

const modalStore = useModalStore();

const isLogoutModalOpen = computed(
  () => modalStore.isOpen && modalStore.modalContent.type === "logout"
);

const currentPageName = route.meta.name || "Default Page";

const isSidebarOpen = ref(true);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const logout = () => {
  modalStore.openModal({
    title: "Confirm Logout",
    description:
      "Are you sure you want to logout? This action cannot be undone.",
    type: "logout",
  });
};

const confirmLogout = () => {
  if (authStore.token) {
    authStore.logout();
  }
  modalStore.closeModal();
};
</script>

<template>
  <SidebarProvider>
    <Sidebar
      collapsible="icon"
      :class="{ 'group-sidebar-hidden': !isSidebarOpen }"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
              >
                <component :is="activeTeam.logo" class="size-4" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{
                  activeTeam.name
                }}</span>
                <span class="truncate text-xs">{{ activeTeam.plan }}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <!--start menu sidebar-->
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            <template v-for="item in filteredNavMain" :key="item.title">
              <!-- Jika ada submenu, gunakan Collapsible -->
              <Collapsible
                v-if="item.items"
                as-child
                :default-open="isActive(item)"
                class="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger as-child>
                    <SidebarMenuButton
                      :tooltip="item.title"
                      :class="{ active: isActive(item) }"
                    >
                      <component :is="item.icon" />
                      <span>{{ item.title }}</span>
                      <!-- ChevronRight hanya ditampilkan jika ada submenu -->
                      <ChevronRight
                        class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem
                        v-for="subItem in item.items"
                        :key="subItem.title"
                      >
                        <SidebarMenuSubButton as-child>
                          <router-link
                            :to="subItem.url"
                            :class="{ active: isActive(subItem) }"
                          >
                            <span>{{ subItem.title }}</span>
                          </router-link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <!-- Jika tidak ada submenu, gunakan SidebarMenuItem biasa -->
              <SidebarMenuItem v-else :class="{ active: isActive(item) }">
                <SidebarMenuButton :tooltip="item.title" as-child>
                  <router-link :to="item.url" class="flex items-center w-full">
                    <component :is="item.icon" />
                    <span>{{ item.title }}</span>
                  </router-link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <!-- Jika tidak ada submenu, gunakan SidebarMenuItem biasa -->
            </template>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <!--end menu-->

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <SidebarMenuButton
                  size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar class="h-8 w-8 rounded-lg">
                    <AvatarImage
                      :src="data.user.avatar"
                      :alt="data.user.name"
                    />
                    <AvatarFallback class="rounded-lg"> CN </AvatarFallback>
                  </Avatar>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">{{
                      data.user.name
                    }}</span>
                    <span class="truncate text-xs">{{ data.user.email }}</span>
                  </div>
                  <ChevronsUpDown class="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                :side-offset="4"
              >
                <DropdownMenuLabel class="p-0 font-normal">
                  <div
                    class="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
                  >
                    <Avatar class="h-8 w-8 rounded-lg">
                      <AvatarImage
                        :src="data.user.avatar"
                        :alt="data.user.name"
                      />
                      <AvatarFallback class="rounded-lg"> CN </AvatarFallback>
                    </Avatar>
                    <div class="grid flex-1 text-left text-sm leading-tight">
                      <span class="truncate font-semibold">{{
                        data.user.name
                      }}</span>
                      <span class="truncate text-xs">{{
                        data.user.email
                      }}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="logout">
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
    <SidebarInset>
      <header
        class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
      >
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" @click="toggleSidebar" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="#"> Dashboard </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{{ currentPageName }}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <!--Content pages-->
      <main class="flex flex-1 flex-col gap-4 p-4 pt-6">
        <slot />
      </main>
      <!--End Content pages-->
    </SidebarInset>
  </SidebarProvider>
  <Modal
    :isOpen="isLogoutModalOpen"
    :onClose="modalStore.closeModal"
    :onConfirm="confirmLogout"
    :title="modalStore.modalContent.title"
    :description="modalStore.modalContent.description"
  />
</template>

<style scoped>
.active {
  @apply relative flex items-center gap-2 px-4 py-2 rounded-lg 
         bg-gray-100 dark:bg-gray-800 text-blue-600 font-semibold;
  transition: padding 0.7s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.group-sidebar-hidden .active {
  @apply px-0 py-0;
  transition: padding 0.7s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.active::before {
  content: "";
  @apply absolute left-0 top-1/2 h-3/4 w-1 bg-blue-500 rounded-r-md 
         transform -translate-y-1/2;
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1),
    left 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
