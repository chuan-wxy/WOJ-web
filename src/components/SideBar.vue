<template>
  <div id="sidebar">
      <el-row class="tac" style="height: 100vh">
        <el-col :span="12">
          <h5 class="mb-2" style="font-size: 20px">控制面板</h5>
          <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              router
              @open="handleOpen"
              @close="handleClose"
          >
            <el-menu-item index="/admin/dashboard">
              <el-icon><icon-menu /></el-icon>
              <span>仪表盘</span>
            </el-menu-item>
            <el-sub-menu open index="1">
              <template #title>
                <el-icon><location /></el-icon>
                <span>网站管理</span>
              </template>
              <el-menu-item index="/admin/addcourse">新建课程</el-menu-item>
              <el-menu-item index="/admin/addproblem">新建题目</el-menu-item>
              <el-menu-item index="/admin/addannouncement">新建公告</el-menu-item>
              <el-menu-item index="/admin/addactivity">新建活动</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon><location /></el-icon>
                <span>用户管理</span>
              </template>
              <el-menu-item index="2-1">用户列表</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="3">
              <el-icon><setting /></el-icon>
              <span>Navigator Four</span>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>


<!--    <el-row class="tac">-->
<!--      <el-col :span="12">-->
<!--        <el-menu router default-active="1" class="el-menu-vertical-demo">-->
<!--          <el-sub-menu-->
<!--            v-for="(item, index) in barData"-->
<!--            :key="index"-->
<!--            :index="index"-->
<!--          >-->
<!--            <template #title>-->
<!--              <el-icon>-->
<!--                <location />-->
<!--              </el-icon>-->
<!--              <span>{{ item.title }}</span>-->
<!--            </template>-->
<!--            <el-menu-item-group-->
<!--              v-for="(item2, index2) in item.child"-->
<!--              :key="index2"-->
<!--              :title="item2.title"-->
<!--            >-->
<!--              <el-menu-item-->
<!--                v-for="(item3, index3) in item2.child"-->
<!--                :key="index3"-->
<!--                :index="item3.index"-->
<!--              >-->
<!--                {{ item3.title }}-->
<!--              </el-menu-item>-->
<!--            </el-menu-item-group>-->
<!--          </el-sub-menu>-->
<!--        </el-menu>-->
<!--      </el-col>-->
<!--    </el-row>-->
  </div>
</template>

<script lang="ts" setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
import router from "@/router";
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

console.log(router.getRoutes());

</script>

<!--<script setup lang="ts">-->
<!--import { reactive } from "vue";-->

<!--const barData = reactive([-->
<!--  {-->
<!--    title: "用户管理",-->
<!--    index: "1",-->
<!--    child: [-->
<!--      {-->
<!--        title: "增删改查",-->
<!--        child: [-->
<!--          {-->
<!--            title: "用户列表",-->
<!--            index: "/admin/userlist",-->
<!--          },-->
<!--          {-->
<!--            title: "添加管理",-->
<!--            index: "/admin/addmanager",-->
<!--          },-->
<!--        ],-->
<!--      },-->
<!--    ],-->
<!--  },-->
<!--  {-->
<!--    title: "题目管理",-->
<!--    index: "2",-->
<!--    child: [-->
<!--      {-->
<!--        title: "增删改查",-->
<!--        child: [-->
<!--          {-->
<!--            title: "新建课程",-->
<!--            index: "/admin/addcourse",-->
<!--          },-->
<!--          {-->
<!--            title: "新建题目",-->
<!--            index: "/admin/addproblem",-->
<!--          },-->
<!--          {-->
<!--            title: "新建活动",-->
<!--            index: "/admin/addactivity",-->
<!--          },-->
<!--          {-->
<!--            title: "新建公告",-->
<!--            index: "/admin/addannouncement",-->
<!--          },-->
<!--        ],-->
<!--      },-->
<!--    ],-->
<!--  },-->
<!--]);-->
<!--</script>-->

<style scoped>
#sidebar{
  height: 100vh;
}

:deep(.el-col) {
  max-width: 100%;
}
</style>
