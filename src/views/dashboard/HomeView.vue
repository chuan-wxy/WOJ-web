<template>
  <div id="home">
    <el-row :gutter="10" style="margin: auto; max-width: 1500px">
      <el-col :span="24" :xs="24" :sm="24" :md="16">
        <el-card class="woj-box-card" shadow="hover">
          <template #header>
            <div class="card-header">公告栏</div>
          </template>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column label="标题">
              <template #default="scope">
                <router-link
                  style="font-weight: 500"
                  class="rlink"
                  :to="{
                    name: 'Announcement',
                    query: { id: scope.row.id }
                  }"
                  >{{ scope.row.title }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="发布时间" />
          </el-table>
        </el-card>
        <!--        <el-card class="woj-box-card" shadow="hover">-->
        <!--          <e-charts class="chart" :option="option" />-->
        <!--        </el-card>-->
      </el-col>
      <el-col :span="24" :xs="24" :sm="24" :md="8">
        <el-card class="woj-box-card" shadow="hover">
          <template #header>
            <div class="card-header"
              >一言
              <el-button type="primary" plain color="#626aef">
                <span class="">
                  <i data-v-37479d80="" class="el-icon el-icon--left">
                    <svg
                      data-v-37479d80=""
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 1024 1024"
                    >
                      <path
                        fill="currentColor"
                        d="M771.776 794.88A384 384 0 0 1 128 512h64a320 320 0 0 0 555.712 216.448H654.72a32 32 0 1 1 0-64h149.056a32 32 0 0 1 32 32v148.928a32 32 0 1 1-64 0v-50.56zM276.288 295.616h92.992a32 32 0 0 1 0 64H220.16a32 32 0 0 1-32-32V178.56a32 32 0 0 1 64 0v50.56A384 384 0 0 1 896.128 512h-64a320 320 0 0 0-555.776-216.384z"
                      ></path>
                    </svg>
                  </i>
                  再来一个
                </span>
              </el-button>
            </div>
          </template>
          <div style="font-size: 14px">不管风吹浪打，胜似闲庭信步。</div>
          <div style="font-size: 12px; color: grey; float: right; margin: 10px">from 毛泽东</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import { AnnouncementControllerService, AnnouncementTitleVO } from '@/openapi/web'
  import { onMounted, ref } from 'vue'
  import { ElMessage } from 'element-plus'

  const tableData = ref([] as AnnouncementTitleVO[])
  const loadData = async () => {
    const res = await AnnouncementControllerService.getAnnouncementTitleList()

    if (res.code === 200) {
      tableData.value = res.data as AnnouncementTitleVO[]
    } else {
      ElMessage.error('加载公告栏失败')
    }
  }

  // const option = ref({
  //   tooltip: {
  //     trigger: 'item'
  //   },
  //   legend: {
  //     top: '5%',
  //     left: 'center'
  //   },
  //   series: [
  //     {
  //       name: 'Access From',
  //       type: 'pie',
  //       radius: ['40%', '70%'],
  //       avoidLabelOverlap: false,
  //       itemStyle: {
  //         borderRadius: 10,
  //         borderColor: '#fff',
  //         borderWidth: 2
  //       },
  //       label: {
  //         show: false,
  //         position: 'center'
  //       },
  //       emphasis: {
  //         label: {
  //           show: true,
  //           fontSize: 40,
  //           fontWeight: 'bold'
  //         }
  //       },
  //       labelLine: {
  //         show: false
  //       },
  //       data: [
  //         { value: 1048, name: 'Search Engine' },
  //         { value: 735, name: 'Direct' },
  //         { value: 580, name: 'Email' },
  //         { value: 484, name: 'Union Ads' },
  //         { value: 300, name: 'Video Ads' }
  //       ]
  //     }
  //   ]
  // })

  onMounted(() => {
    loadData()
  })
</script>

<style scoped>
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 20px;
    font-weight: bolder;
  }
  .chart {
    height: 400px;
  }
</style>
