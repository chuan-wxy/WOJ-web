/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponsePageUserAdminVO } from '../models/BaseResponsePageUserAdminVO';
import type { BaseResponseVoid } from '../models/BaseResponseVoid';
import type { UserSearchDTO } from '../models/UserSearchDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminControllerService {
    /**
     * @param requestBody
     * @returns BaseResponsePageUserAdminVO OK
     * @throws ApiError
     */
    public static getUserList(
        requestBody: UserSearchDTO,
    ): CancelablePromise<BaseResponsePageUserAdminVO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/user-list',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns BaseResponseVoid OK
     * @throws ApiError
     */
    public static deleteUserByid(
        id: string,
    ): CancelablePromise<BaseResponseVoid> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/delete-by-uuid',
            query: {
                'id': id,
            },
        });
    }
}
