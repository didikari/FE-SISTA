<script setup lang="ts">
const route = useRoute();
const guidanceId = ref<string>(
  Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
);
onMounted(async () => {});
</script>

<template>
  <NuxtLayout>
    <div>
      <h1>Helo</h1>
    </div>
  </NuxtLayout>
</template>
