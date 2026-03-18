import request from '@/utils/http'
import { Api } from '@/types/api/api'
import { UserSearchDTO } from '@api/user'
import { AnnouncementSearchDTO, ProblemSearchDTO } from '@api/web'

// 获取用户列表
export function fetchGetUserList(params: UserSearchDTO & Api.Common.CommonSearchParams) {
  return request.post<Api.SystemManage.UserList>({
    url: '/user/admin/user-list',
    params
  })
}

// 获取公告列表
export function fetchGetAnnouncementList(
  params: AnnouncementSearchDTO & Api.Common.CommonSearchParams
) {
  return request.post<Api.SystemManage.AnnouncementList>({
    url: '/web/announcement/admin/announcement-list',
    params
  })
}

// 获取公告列表
export function fetchGetProblemTitleList(params: ProblemSearchDTO & Api.Common.CommonSearchParams) {
  return request.post<Api.SystemManage.ProblemTitleList>({
    url: '/web/problem/problemtitle-list',
    params
  })
}
