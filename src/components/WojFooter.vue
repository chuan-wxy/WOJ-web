<template>
  <div id="footer">
    <div style="font-weight: 600; color: rgb(116, 118, 122)">
      WOJ powered by
      <a href="https://github.com/chuan-wxy/woj" target="_blank" class="rainbow"
        >WOJ</a
      >
      Developed by <span style="color: black">chuan-wxy</span>
    </div>
    <div>
      <a href="https://beian.miit.gov.cn/" target="_blank" class="rainbow">
        鲁ICP备2024119533号-1</a
      >
    </div>
  </div>
</template>

<style scoped>
#footer {
  text-align: center;
  min-width: 1200px;
  width: 100%;
  display: block;
  position: absolute;
  bottom: 0; /* 4. 设置页脚position为absolute之后，再将其bottom值设为0，即可使其处于页面的底部 */
  font-weight: 600;
}

.rainbow {
  margin: 10px;
  text-decoration: none;
  background-image: linear-gradient(92deg, #26f35d, #feab3a);
  color: #2652f3;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
  animation: hue 10s linear 0s infinite normal none running;
}

@keyframes hue {
  0% {
    -webkit-filter: hue-rotate(0deg);
  }
  100% {
    -webkit-filter: hue-rotate(-1turn);
  }
}
</style>
<script setup></script>
