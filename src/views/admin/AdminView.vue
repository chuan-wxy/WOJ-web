<template>
  <div id="adminview">
    <el-container>
      <el-aside>
        <SideBarView />
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import SideBarView from "@/components/SideBar.vue";
import { reactive } from "vue";

const barData = reactive([
  {
    title: "用户管理",
    index: "1",
    child: [
      {
        title: "增删改查",
        child: [
          {
            title: "查找用户",
            index: "/admin/addteacherquestion",
          },
          {
            title: "添加用户",
            index: "/admin/tianjia",
          },
        ],
      },
    ],
  },
  {
    title: "题目管理",
    index: "2",
    child: [
      {
        title: "增删改查",
        child: [
          {
            title: "查找题目",
            index: "1-1",
            path: "/add",
          },
          {
            title: "新建课程",
            index: "1-1",
            path: "/add",
          },
          {
            title: "添加题目",
            index: "1-1",
            path: "/add",
          },
        ],
      },
    ],
  },
]);
</script>
<style scoped>
#adminview {
  height: 800px;
  width: 75%;
  padding-top: 0px;
}
</style>
