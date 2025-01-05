<template>
  <div id="admin-layout" style="min-height: 100vh; position: relative">
    <el-container>
      <el-aside width="200px">
        <side-bar/>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import SideBar from "@/components/SideBar.vue";
</script>

<style scoped>
#admin-layout {
  width: 100vw;
}
.left-side {
  flex-basis: 120px;
  border-right: 1px solid var(--border-color);
  padding: 26px;
  overflow: auto;
  flex-shrink: 0;
}

.main-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  //max-height: 900px;
  padding: 0px;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  color: var(--theme-color);
  padding-top: 20px;
  padding-bottom: 20px;
  height: 100%;
  width: 100%;
  overflow: auto;
  background-color: var(--theme-bg-color);
  max-height: 760px;
}

.content-wrapper .el-form-item__content {
  background-color: #4cae4c;
}

@media screen and (max-width: 510px) {
  .content-wrapper {
    padding: 20px;
  }
}
</style>
