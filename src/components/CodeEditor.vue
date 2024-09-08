<template>
  <div id="code-editor" ref="codeEditorRef" style="min-height: 500px" />
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor";
import { defineProps, onMounted, ref, toRaw, withDefaults } from "vue";
import { useCommonStore } from "@/store/CommonStore";

const codeEditorRef = ref();
const codeEditor = ref();
const commonStore = useCommonStore();

const n = ref(commonStore.webStyle);

// editor.updateOptions({
//   theme: n.value === 0 ? "vs-dark" : "vs",
// });

const props = withDefaults(
  defineProps<{
    codeValue: string;
    handleChange: (v: string) => void;
  }>(),
  {
    codeValue: "",
    handleChange: (v: string) => {
      console.log(v);
    },
  }
);
onMounted(() => {
  if (!codeEditorRef.value) {
    return;
  }
  const editor = monaco.editor.create(codeEditorRef.value, {
    value: props.codeValue,
    language: "c", // 语言
    automaticLayout: true, // 宽度自适应
    lineNumbers: "on", // 行号
    roundedSelection: false,
    scrollBeyondLastLine: false,
    readOnly: false,
    theme: "vs-dark",
  });
  if (editor) {
    editor.onDidChangeModelContent((e) => {
      props.handleChange(editor.getValue());
    });
  }
});
</script>

<style scoped></style>
