<template>
  <div id="problem-content">
    <div class="panel-body">
      <h2>{{ form.title }}</h2>
      <div class="content">
        <Viewer :value="form.description" />
      </div>
      <br />
      <div>
        <CodeEditor ref="codeEditor" :value="submitData.code" />
      </div>
      <div>
        <a-button @click="submit">提交</a-button>
      </div>
      <div :class="[isHide == true ? 'cardIsHide' : 'cardNoHide']">
        代码提交状态：
        <a-spin :class="[isState == true ? 'isHide' : 'noHide']" />
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { ProblemControllerService } from "../../../generated/services/ProblemControllerService";
import { ElMessage } from "element-plus";
import CodeEditor from "@/components/CodeEditor.vue";
import { ProblemSubmitControllerService } from "../../../generated/services/ProblemSubmitControllerService";
import { Viewer } from "@bytemd/vue-next";

const value = ref(
  "给定你一个长度为 n 的整数数列。\n" +
    "\n" +
    "请你使用快速排序对这个数列按照从小到大进行排序。\n" +
    "\n" +
    "并将排好序的数列按顺序输出。\n" +
    "\n" +
    "#### 输入格式\n" +
    "\n" +
    "输入共两行，第一行包含整数 n 。\n" +
    "\n" +
    "第二行包含 n 个整数（所有整数均在 1∼109\n" +
    " 范围内），表示整个数列。"
);
const route = useRoute();
const isState = ref(true);
const isHide = ref(true);
const message = ref("");
const codeEditor = ref();

const form = ref({
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

const plugins = [gfm(), highlight()];

const submitData = ref({
  language: "c++",
  code: "",
  pid: 0,
});

const submit = async () => {
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
    message.value = result.message ?? "";
    ElMessage.success("添加成功");
  } else {
    ElMessage.error("添加失败：" + result.message);
  }
};

const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await ProblemControllerService.getProblem(id as any);
  if (res.code === 0) {
    form.value = res.data as any;
    console.log(form.value);
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
  background: rgba(0, 0, 0, 0%);
  width: 95%;
  margin: auto;
}

.panel-body {
  padding: 15px;
}

.isHide {
  display: none;
}

.noHide {
  display: block;
}

.cardIsHide {
  display: none;
}

.cardNoHide {
  display: block;
}

.bytemd {
  background-color: rgba(0, 0, 0, 0%);
  border-color: var(--border-color);
  height: calc(100vh - 350px);
}
</style>
<!--<template>-->
<!--  <el-row style="margin: auto; max-width: 1500px; min-width: 600px">-->
<!--    <el-col :xs="24" :sm="24" :md="17">-->
<!--      <el-card class="box-card" shadow="hover">-->
<!--        <template #header>-->
<!--          <div class="card-header" style="height: 35px">-->
<!--            <p class="title">-->
<!--              #{{ problemInfo.pid }}、{{ problemInfo.title }}-->
<!--              <el-icon id="hidden" v-if="!problemInfo.isPublic">-->
<!--                <Hide />-->
<!--              </el-icon>-->
<!--            </p>-->
<!--          </div>-->
<!--        </template>-->
<!--        <div v-if="isSubmit">-->
<!--          <monacoEditor :value="code" @update:value="code = $event" />-->
<!--          <el-divider />-->
<!--          <div style="text-align: center">-->
<!--            <el-button type="primary" @click="submit">-->
<!--              <el-icon class="el-icon&#45;&#45;left">-->
<!--                <Upload />-->
<!--              </el-icon>-->
<!--              确认提交-->
<!--            </el-button>-->
<!--          </div>-->
<!--        </div>-->
<!--        <v-md-preview-->
<!--          v-show="!isSubmit"-->
<!--          :text="problemInfo.description"-->
<!--        ></v-md-preview>-->
<!--      </el-card>-->
<!--    </el-col>-->
<!--    <el-col :xs="24" :sm="24" :md="7">-->
<!--      <el-card class="box-card" shadow="hover">-->
<!--        <template #header>-->
<!--          <div class="card-header">-->
<!--            <div-->
<!--              class="stat-item clickable"-->
<!--              @click="-->
<!--                this.$router.push({-->
<!--                  path: '/submission',-->
<!--                  query: { pid: pid, res: 4, queryAll: true },-->
<!--                })-->
<!--              "-->
<!--            >-->
<!--              <div class="stat-number">{{ problemInfo.acCnt }}</div>-->
<!--              <div class="stat-label">通过</div>-->
<!--            </div>-->
<!--            <div class="stat-divider"></div>-->
<!--            <div-->
<!--              class="stat-item clickable"-->
<!--              @click="-->
<!--                this.$router.push({-->
<!--                  path: '/submission',-->
<!--                  query: { pid: pid, queryAll: true },-->
<!--                })-->
<!--              "-->
<!--            >-->
<!--              <div class="stat-number">{{ problemInfo.submitCnt }}</div>-->
<!--              <div class="stat-label">提交</div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </template>-->
<!--        <el-descriptions direction="vertical" :column="1" border>-->
<!--          <el-descriptions-item label="时间限制">-->
<!--            {{ problemInfo.timeLimit }} ms</el-descriptions-item-->
<!--          >-->
<!--          <el-descriptions-item label="空间限制">-->
<!--            {{ problemInfo.memoryLimit }} MB</el-descriptions-item-->
<!--          >-->
<!--          <el-descriptions-item label="题目类型">-->
<!--            {{ problemInfo.type }}</el-descriptions-item-->
<!--          >-->
<!--          <el-descriptions-item label="题目标签">-->
<!--            <el-tag-->
<!--              type="info"-->
<!--              v-for="tag in problemInfo.tags"-->
<!--              :key="tag"-->
<!--              :color="getTagColor(tag)"-->
<!--              @click="-->
<!--                this.$router.push({-->
<!--                  path: '/problem',-->
<!--                  query: { tags: JSON.stringify([tag]) },-->
<!--                })-->
<!--              "-->
<!--            >-->
<!--              <span class="tag-text">{{ tag }} </span>-->
<!--            </el-tag>-->
<!--          </el-descriptions-item>-->
<!--          <el-descriptions-item label="难度评级">-->
<!--            <el-button-->
<!--              size="small"-->
<!--              :color="levels[problemInfo.level]?.color ?? '#BFBFBF'"-->
<!--              :dark="true"-->
<!--              @click="-->
<!--                this.$router.push({-->
<!--                  path: '/problem',-->
<!--                  query: { level: problemInfo.level },-->
<!--                })-->
<!--              "-->
<!--            >-->
<!--              <span style="color: white; font-weight: 600; font-size: 14px">-->
<!--                {{ levels[problemInfo.level]?.label ?? "未知难度" }}-->
<!--              </span>-->
<!--            </el-button>-->
<!--          </el-descriptions-item>-->
<!--          <el-descriptions-item label="出题人">-->
<!--            <router-link-->
<!--              class="rlink"-->
<!--              :to="'/user/' + problemInfo.publisherUid"-->
<!--            >-->
<!--              {{ problemInfo.publisher }}-->
<!--            </router-link>-->
<!--          </el-descriptions-item>-->
<!--          <el-descriptions-item label="发布时间">-->
<!--            {{ problemInfo.time }}</el-descriptions-item-->
<!--          >-->
<!--        </el-descriptions>-->
<!--        <el-divider style="margin-top: 20px; margin-bottom: 20px" />-->
<!--        <div style="text-align: center">-->
<!--          <el-button-->
<!--            v-if="!this.isSubmit"-->
<!--            type="primary"-->
<!--            @click="this.isSubmit = true"-->
<!--          >-->
<!--            <el-icon class="el-icon&#45;&#45;left">-->
<!--              <Upload />-->
<!--            </el-icon>-->
<!--            提交代码-->
<!--          </el-button>-->
<!--          <el-button-->
<!--            v-if="this.isSubmit"-->
<!--            type="success"-->
<!--            @click="this.isSubmit = false"-->
<!--          >-->
<!--            <el-icon class="el-icon&#45;&#45;left">-->
<!--              <RefreshLeft />-->
<!--            </el-icon>-->
<!--            查看题目-->
<!--          </el-button>-->
<!--          <el-button-->
<!--            color="#626aef"-->
<!--            @click="this.$router.push('/problem/stat/' + problemInfo.pid)"-->
<!--          >-->
<!--            <el-icon class="el-icon&#45;&#45;left">-->
<!--              <Histogram />-->
<!--            </el-icon>-->
<!--            数据统计-->
<!--          </el-button>-->
<!--          <el-button-->
<!--            v-if="this.gid > 1"-->
<!--            type="danger"-->
<!--            @click="this.$router.push('/problem/edit/' + problemInfo.pid)"-->
<!--          >-->
<!--            <el-icon class="el-icon&#45;&#45;left">-->
<!--              <Operation />-->
<!--            </el-icon>-->
<!--            题目管理-->
<!--          </el-button>-->
<!--        </div>-->
<!--      </el-card>-->
<!--    </el-col>-->
<!--  </el-row>-->
<!--</template>-->

<!--<script>-->
<!--import axios from "axios";-->
<!--import { ElMessage } from "element-plus";-->
<!--import monacoEditor from "@/components/monacoEditor.vue";-->

<!--export default {-->
<!--  name: "problemView",-->
<!--  data() {-->
<!--    return {-->
<!--      pid: 0,-->
<!--      gid: 1,-->
<!--      problemInfo: {},-->
<!--      code: "",-->
<!--      isSubmit: false,-->
<!--      levels: [-->
<!--        {-->
<!--          label: "暂未评级",-->
<!--          color: "#BFBFBF",-->
<!--        },-->
<!--        {-->
<!--          label: "入门",-->
<!--          color: "#FE4C61",-->
<!--        },-->
<!--        {-->
<!--          label: "普及",-->
<!--          color: "#FFC116",-->
<!--        },-->
<!--        {-->
<!--          label: "提高",-->
<!--          color: "#52C41A",-->
<!--        },-->
<!--        {-->
<!--          label: "省选",-->
<!--          color: "#3498DB",-->
<!--        },-->
<!--        {-->
<!--          label: "NOI / NOI+",-->
<!--          color: "#0E1D69",-->
<!--        },-->
<!--      ],-->
<!--      tagColorList: [-->
<!--        "#2d8cf0",-->
<!--        "#3f51b5",-->
<!--        "#9c27b0",-->
<!--        "#009688",-->
<!--        "#19be6b",-->
<!--        "#689f38",-->
<!--        "#ff9900",-->
<!--        "#E91E63",-->
<!--        "#ed4014",-->
<!--      ],-->
<!--    };-->
<!--  },-->
<!--  components: {-->
<!--    monacoEditor,-->
<!--  },-->
<!--  methods: {-->
<!--    submit() {-->
<!--      axios-->
<!--        .post("/api/judge/submit", {-->
<!--          pid: this.pid,-->
<!--          code: this.code,-->
<!--        })-->
<!--        .then((res) => {-->
<!--          if (res.status === 200) {-->
<!--            this.$router.push("/submission/" + res.data.sid);-->
<!--          } else {-->
<!--            ElMessage({-->
<!--              message: "提交失败" + res.data.message,-->
<!--              type: "error",-->
<!--              duration: 2000,-->
<!--            });-->
<!--          }-->
<!--        });-->
<!--    },-->
<!--    hash(str) {-->
<!--      let t = 0;-->
<!--      for (let i = 0; i < str.length; i++) t = 31 * t + str.charCodeAt(i);-->
<!--      return t;-->
<!--    },-->
<!--    getTagColor(tag) {-->
<!--      return this.tagColorList[this.hash(tag) % this.tagColorList.length];-->
<!--    },-->
<!--  },-->
<!--  async mounted() {-->
<!--    this.pid = this.$route.params.pid;-->
<!--    this.gid = this.$store.state.gid;-->
<!--    await axios-->
<!--      .post("/api/problem/getProblemInfo", { pid: this.pid })-->
<!--      .then((res) => {-->
<!--        if (res.status === 200) {-->
<!--          this.problemInfo = res.data.data;-->
<!--          this.problemInfo.isPublic = res.data.data.isPublic ? true : false;-->
<!--        } else {-->
<!--          this.$router.push({ path: "/" });-->
<!--        }-->
<!--      });-->
<!--    document.title = "题目 — " + this.problemInfo.title;-->
<!--  },-->
<!--};-->
<!--</script>-->

<!--<style scoped>-->
<!--.box-card {-->
<!--  margin: 10px;-->
<!--  text-align: left;-->
<!--}-->

<!--.card-header {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: space-around;-->
<!--}-->

<!--.stat-item {-->
<!--  text-align: center;-->
<!--  flex: 1;-->
<!--}-->

<!--.clickable {-->
<!--  cursor: pointer;-->
<!--  transition: background-color 0.3s;-->
<!--  border-radius: 5px;-->
<!--}-->

<!--.clickable:hover {-->
<!--  background-color: #f5f7fa;-->
<!--}-->

<!--.stat-number {-->
<!--  font-size: 28px;-->
<!--  font-weight: bold;-->
<!--  color: #303133;-->
<!--}-->

<!--.stat-label {-->
<!--  font-size: 14px;-->
<!--  color: #909399;-->
<!--  margin-top: 3px;-->
<!--}-->

<!--.stat-divider {-->
<!--  width: 1px;-->
<!--  height: 60px;-->
<!--  background-color: #e0e0e0;-->
<!--  margin: 0 20px;-->
<!--}-->

<!--.title {-->
<!--  margin: 0;-->
<!--  font-size: 25px;-->
<!--}-->

<!--.el-tag {-->
<!--  cursor: pointer;-->
<!--  margin-right: 5px;-->
<!--}-->

<!--.tag-text {-->
<!--  color: white;-->
<!--  font-weight: 600;-->
<!--  font-size: 14px;-->
<!--}-->

<!--#hidden {-->
<!--  vertical-align: -4px;-->
<!--  color: #312b2b;-->
<!--}-->
<!--</style>-->
