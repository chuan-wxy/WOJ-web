<template>
  <div class="art-card h-82 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>分布</h4>
      </div>
    </div>

    <RingChart
      :data="charData"
      :colors="['#67C23A', '#F56C6C', '#E6A23C', '#FF8C00', '#8E44AD', '#ABB2BF', '#4E5969']"
      :radius="['46%', '60%']"
    />
  </div>
</template>

<script setup lang="ts">
  import { CharDataVO } from '@api/web'
  import { PieDataItem } from '@/types/component/chart'

  interface Props {
    data: CharDataVO
  }
  const props = withDefaults(defineProps<Props>(), {
    data: () => ({}) as CharDataVO
  })

  const charData = computed((): PieDataItem[] => {
    const stats = props.data ?? {}

    const nameMap: Record<string, string> = {
      acCount: 'AC',
      waCount: 'WA',
      tleCount: 'TLE',
      mleCount: 'MLE',
      reCount: 'RE',
      ceCount: 'CE',
      seCount: 'SE'
    }

    return Object.entries(stats).map(([key, value]) => {
      return {
        name: nameMap[key] || key,
        value: value
      }
    })
  })
</script>
