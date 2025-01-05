<script setup lang="ts">
import HeaderMenu from "@/components/HeaderMenu.vue";
import WojFooter from "@/components/WojFooter.vue";
</script>

<template>
  <div id="layout" style="min-height: 100vh; position: relative">
    <el-container>
      <el-header>
        <HeaderMenu />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
      <el-footer style="width: 100%">
        <WojFooter />
      </el-footer>
    </el-container>
  </div>
</template>

<style scoped>
#layout {
  padding: 0;
  margin: 0;
}
</style>
