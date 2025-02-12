<template>
  <div class="border border-gray-300 rounded-md p-2">
    <!-- Toolbar -->
    <div v-if="editor" class="flex flex-wrap gap-2 mb-2 border-b pb-2">
      <button
        v-for="(item, index) in toolbarItems"
        :key="index"
        @click="item.action"
        :disabled="item.disabled"
        :class="[
          'px-2 py-1 text-sm rounded-md transition',
          {
            'bg-blue-500 text-white': item.active,
            'bg-gray-100 text-gray-500': !item.active,
            'opacity-50 cursor-not-allowed': item.disabled,
          },
        ]"
      >
        {{ item.label }}
      </button>
    </div>

    <!-- Editor -->
    <EditorContent
      :editor="editor"
      class="min-h-[150px] px-2 py-1 focus:outline-none"
    />
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import { computed, defineProps, defineEmits, watch } from "vue";

const props = defineProps({ modelValue: String });
const emit = defineEmits(["update:modelValue"]);

// Inisialisasi Editor
const editor = useEditor({
  content: props.modelValue || "<p>Start typing...</p>",
  extensions: [StarterKit],
  onUpdate: ({ editor }) => {
    emit("update:modelValue", editor.getHTML());
  },
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (editor.value && newValue !== editor.value.getHTML()) {
      editor.value.commands.setContent(newValue);
    }
  }
);

const toolbarItems = computed(() => [
  {
    label: "B",
    action: () => editor.value.chain().focus().toggleBold().run(),
    active: editor.value?.isActive("bold"),
    disabled: !editor.value?.can().chain().focus().toggleBold().run(),
  },
  {
    label: "I",
    action: () => editor.value.chain().focus().toggleItalic().run(),
    active: editor.value?.isActive("italic"),
    disabled: !editor.value?.can().chain().focus().toggleItalic().run(),
  },
  {
    label: "U",
    action: () => editor.value.chain().focus().toggleStrike().run(),
    active: editor.value?.isActive("strike"),
    disabled: !editor.value?.can().chain().focus().toggleStrike().run(),
  },
  {
    label: "H1",
    action: () =>
      editor.value.chain().focus().toggleHeading({ level: 1 }).run(),
    active: editor.value?.isActive("heading", { level: 1 }),
  },
  {
    label: "H2",
    action: () =>
      editor.value.chain().focus().toggleHeading({ level: 2 }).run(),
    active: editor.value?.isActive("heading", { level: 2 }),
  },
  {
    label: "Bullet List",
    action: () => editor.value.chain().focus().toggleBulletList().run(),
    active: editor.value?.isActive("bulletList"),
  },
  {
    label: "Ordered List",
    action: () => editor.value.chain().focus().toggleOrderedList().run(),
    active: editor.value?.isActive("orderedList"),
  },
  {
    label: "Undo",
    action: () => editor.value.chain().focus().undo().run(),
    disabled: !editor.value?.can().chain().focus().undo().run(),
  },
  {
    label: "Redo",
    action: () => editor.value.chain().focus().redo().run(),
    disabled: !editor.value?.can().chain().focus().redo().run(),
  },
]);
</script>

<style scoped>
button {
  min-width: 32px;
}
</style>
