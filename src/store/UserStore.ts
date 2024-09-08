import { defineStore } from "pinia";
import { UserControllerService } from "../../generated";
import { ElMessage } from "element-plus";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      userInfo: {
        jwt: "",
        userAccount: null,
        userName: "",
        userProfile: "",
        school: "",
        course: "",
        number: "",
        gender: "",
        github: "",
        blog: "",
        avatar: "",
        signature: "",
        titleName: "",
        titleColor: "",
        createTime: "",
      },
      userRole: null,
    };
  },
  persist: {
    afterRestore: (ctx) => {
      const userStore = useUserStore();
      userStore.checkJWT(userStore.userInfo.jwt);
    },
  },
  getters: {},
  actions: {
    clearUserInfo() {
      (this.userInfo.jwt = ""),
        (this.userInfo.userAccount = null),
        (this.userInfo.userName = ""),
        (this.userInfo.userProfile = ""),
        (this.userInfo.school = ""),
        (this.userInfo.course = ""),
        (this.userInfo.number = ""),
        (this.userInfo.gender = ""),
        (this.userInfo.github = ""),
        (this.userInfo.blog = ""),
        (this.userInfo.avatar = ""),
        (this.userInfo.signature = ""),
        (this.userInfo.titleName = ""),
        (this.userInfo.titleColor = ""),
        (this.userInfo.createTime = ""),
        (this.userRole = null);
    },
    async checkJWT(JWT: string) {
      const res = await UserControllerService.checkJwt(JWT);
      if (res && res.code === 0) {
        if (res.data) {
          localStorage.removeItem("user");
          this.clearUserInfo();
        }
      } else {
        ElMessage.error("系统错误");
      }
    },
    async getLoginUser() {
      const res = await UserControllerService.getLoginUser();
      if (res && res.code === 0) {
        this.userInfo = res.data as any;
      }
    },
  },
});
