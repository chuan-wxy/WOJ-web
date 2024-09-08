<template>
  <div id="problem">
    <div class="panel-body">
      <h2>在线题库</h2>
      <div id="searchBox">
        <a-space direction="vertical" size="large">
          <a-input-search
            :style="{ width: '320px' }"
            placeholder="搜索题目"
            v-model="searchValue"
          />
        </a-space>
      </div>
      <el-table class="list" :data="tableData" style="width: 100%">
        <el-table-column fixed prop="id" label="id" width="100" />
        <el-table-column prop="title" label="题目" width="200" />
        <el-table-column prop="tags" label="标签" width="250">
          <template #default="scope">
            <div v-for="(item, index) in scope.row.tags" :key="index">
              <el-tag type="success">{{ item }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="difficulty" label="难度" width="100">
          <template #default="scope">
            <div v-if="scope.row.difficulty === '简单'">
              <el-tag type="success">简单</el-tag>
            </div>
            <div v-else-if="scope.row.difficulty === '适中'">
              <el-tag type="warning">适中</el-tag>
            </div>
            <div v-else>
              <el-tag type="danger">困难</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="20">
          <template #default="scope">
            <el-button type="primary" @click="gotoContentById(scope.row.id)">
              学习
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script setup lang="ts">
const tableData = [
  {
    id: 0,
    title: "Tom",
    tags: ["扩展欧几里得算法", "数学问题"],
    difficulty: "简单",
  },
  {
    id: 1,
    title: "Tom",
    tags: ["扩展欧", "二分"],
    difficulty: "困难",
  },
];
import { ref } from "vue";
import { useRouter } from "vue-router";

const searchValue = ref("");

const columns = ref([
  {
    title: "Id",
    dataIndex: "id",
  },
  {
    title: "标题",
    dataIndex: "title",
    slotName: "title",
  },
  {
    title: "标签",
    dataIndex: "tags",
    slotName: "tags",
  },
  {
    title: "难度",
    dataIndex: "difficulty",
    slotName: "difficulty",
  },
]);
const router = useRouter();
const data = ref([]);
const gotoContentById = (id: string) => {
  router.push({
    path: "/problem/content",
    query: {
      id: id,
    },
  });
};

// const questionQueryData = reactive({
//   current: 1,
//   pageSize: 10,
// } as QuestionQueryRequest);
//
// const listPage = async () => {
//   const result = await QuestionControllerService.listQuestionVoByPageUsingPost(
//     questionQueryData
//   );
//   data.value = result.data.records;
// };
// listPage();
</script>
<style scoped>
#problem {
  height: 800px;
  width: 75%;
  margin: auto auto;
  justify-content: center;
}

h2 {
  text-align: center;
}

hr {
  color: #aaaaaa;
  margin-top: 32px;
}

.panel-body {
  padding: 15px;
}

#searchBox {
  margin-left: 29%;
}

#problem >>> .el-table tr,
#problem >>> .el-table th,
#problem >>> .el-table__body tr.hover-row > td.el-table__cell,
#problem >>> .el-table {
  color: var(--theme-color);
  background-color: var(--content-bg);
}
</style>
