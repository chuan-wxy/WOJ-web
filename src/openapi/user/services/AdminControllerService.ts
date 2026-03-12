/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponseListUserVO } from '../models/BaseResponseListUserVO';
import type { BaseResponseUserVO } from '../models/BaseResponseUserVO';
import type { BaseResponseVoid } from '../models/BaseResponseVoid';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminControllerService {
    /**
     * @param arg0
     * @returns BaseResponseListUserVO OK
     * @throws ApiError
     */
    public static searchUserByGender(
        arg0: string,
    ): CancelablePromise<BaseResponseListUserVO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/amdin/search-list-by-gender',
            query: {
                'arg0': arg0,
            },
        });
    }
    /**
     * @param arg0
     * @returns BaseResponseUserVO OK
     * @throws ApiError
     */
    public static searchUserById(
        arg0: string,
    ): CancelablePromise<BaseResponseUserVO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/amdin/search-by-uuid',
            query: {
                'arg0': arg0,
            },
        });
    }
    /**
     * @param arg0
     * @returns BaseResponseVoid OK
     * @throws ApiError
     */
    public static deleteUserByUuid(
        arg0: string,
    ): CancelablePromise<BaseResponseVoid> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/amdin/delete-by-uuid',
            query: {
                'arg0': arg0,
            },
        });
    }
}
