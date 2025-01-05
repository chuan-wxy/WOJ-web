<template>
  <div id="problem-content">
    <el-row :gutter="10" style="margin: auto; max-width: 1500px; min-width: 600px;">
      <el-col :span="24" :xs="24" :sm="24" :md="17">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header" style="height: 35px">
              <p class="title">{{ problemData.title }}</p>
            </div>
          </template>
          <Viewer :value="problemData.description" :plugins="plugins"/>
          <div>
            <WojCodeEditor ref="codeEditor"/>
          </div>
          <div>
            <a-button @click="submit">提交</a-button>
          </div>
          <div :class="[isHide == true ? 'cardIsHide' : 'cardNoHide']">
            代码提交状态：
            <a-spin :class="[isState == true ? 'isHide' : 'noHide']"/>
            {{ message }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="24" :xs="24" :sm="24" :md="7">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <div class="stat-item clickable">
                <div class="stat-number">6</div>
                <div class="stat-label">通过</div>
              </div>
              <div data-v-22ef7511="" class="stat-divider"></div>
              <div class="stat-item clickable">
                <div class="stat-number">16</div>
                <div class="stat-label">提交</div>
              </div>
            </div>
          </template>
        </el-card>
      </el-col>

    </el-row>


    <!--    <div class="panel-body" style="display: flex">-->
    <!--      <div-->
    <!--        class="panel-right"-->
    <!--        style="background-color: blue; height: calc(100vh - 80px); width: 42%"-->
    <!--      >-->
    <!--        <el-tabs-->
    <!--          type="border-card"-->
    <!--          style="height: calc(100vh - 80px)"-->
    <!--          class="demo-tabs"-->
    <!--        >-->
    <!--          <el-tab-pane>-->
    <!--            <template #label>-->
    <!--              <span class="custom-tabs-label">-->
    <!--                <el-icon><calendar /></el-icon>-->
    <!--                <span>题目描述</span>-->
    <!--              </span>-->
    <!--            </template>-->
    <!--            <h2>{{ problemData.title }}</h2>-->
    <!--            <div class="content" draggable="true">-->
    <!--              <Viewer :value="problemData.description" :plugins="plugins" />-->
    <!--            </div>-->
    <!--          </el-tab-pane>-->
    <!--          <el-tab-pane label="题目信息">题目信息</el-tab-pane>-->
    <!--          <el-tab-pane label="提交记录">提交记录</el-tab-pane>-->
    <!--        </el-tabs>-->
    <!--      </div>-->
    <!--      <div-->
    <!--        class="panel-right"-->
    <!--        style="background-color: blue; height: calc(100vh - 80px); width: 42%"-->
    <!--      >-->
    <!--        <el-tabs-->
    <!--          type="border-card"-->
    <!--          style="height: calc(100vh - 80px)"-->
    <!--          class="demo-tabs"-->
    <!--        >-->
    <!--          <el-tab-pane label="题目信息">-->
    <!--            <div>-->
    <!--              <WojCodeEditor ref="codeEditor" />-->
    <!--            </div>-->
    <!--            <div>-->
    <!--              <a-button @click="submit">提交</a-button>-->
    <!--            </div>-->
    <!--            <div :class="[isHide == true ? 'cardIsHide' : 'cardNoHide']">-->
    <!--              代码提交状态：-->
    <!--              <a-spin :class="[isState == true ? 'isHide' : 'noHide']" />-->
    <!--              {{ message }}-->
    <!--            </div>-->
    <!--          </el-tab-pane>-->
    <!--          <el-tab-pane label="提交记录">提交记录</el-tab-pane>-->
    <!--        </el-tabs>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import {Viewer} from "@bytemd/vue-next";
import {useRoute} from "vue-router";
import {
  ProblemControllerService,
  ProblemSubmitControllerService,
} from "../../../openapi/web";
import {ElMessage} from "element-plus";
import gfm from "@bytemd/plugin-gfm";
import math from "@bytemd/plugin-math-ssr";
import highlight from "@bytemd/plugin-highlight-ssr";
import gemoji from "@bytemd/plugin-gemoji"
import WojCodeEditor from "@/components/WojCodeEditor.vue";
import {Calendar} from "@element-plus/icons-vue";
import MdEditor from "@/components/MdEditor.vue";

const route = useRoute();
const isState = ref(true);
const isHide = ref(true);
const message = ref("");
const codeEditor = ref();

const plugins = [
  gfm(),
  math(),
  highlight(),
  gemoji()
];

const problemData = ref({
  id: 0,
  problemId: 0,
  title: 0,
  author: "",
  tagList: [],
  description: "",
  input: "",
  output: "",
  source: "",
  difficulty: 0,
  auth: 0,
});

const submitData = ref({
  language: "c++",
  code: "",
  pid: 0,
});

const submit = async () => {
  if (
      codeEditor.value.codeEditorData === null ||
      codeEditor.value.codeEditorData === ""
  ) {
    ElMessage.error("代码不能为空");
    return;
  }
  isState.value = false;
  isHide.value = false;
  //先清空以前的数据
  message.value = "";
  submitData.value.code = codeEditor.value.codeEditorData;
  const result = await ProblemSubmitControllerService.doSubmit(
      submitData.value
  );
  isState.value = true;
  if (result.code === 0) {
    message.value = result.data.judgeInfo.message ?? "";
    ElMessage.success("提交成功");
  } else {
    ElMessage.error("提交失败：" + result.message);
  }
};

const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await ProblemControllerService.getProblem(id);
  if (res.code === 0) {
    problemData.value = res.data as any;
  } else {
    ElMessage.error("加载失败：" + res.message);
  }
};
onBeforeMount(() => {
  loadData();
  submitData.value.pid = route.query.id as any;
});
</script>

<style scoped>
#problem-content {
  margin: auto auto;
  background: rgba(0, 0, 0, 0%);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-weight: bolder;
  color: #3f3f3f;
}

.title {
  margin: 0;
  font-size: 25px;
}

.clickable {
  cursor: pointer;
  transition: background-color .3s;
  border-radius: 5px;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-divider {
  width: 1px;
  height: 60px;
  background-color: #e0e0e0;
  margin: 0 20px;
}


.panel-body {
  justify-content: center;
}

.cardIsHide {
  display: none;
}

.cardNoHide {
  display: block;
}

.isHide {
  display: none;
}

.noHide {
  display: block;
}
</style>