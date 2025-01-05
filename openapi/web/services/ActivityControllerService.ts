/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActivityAddDTO } from '../models/ActivityAddDTO';
import type { BaseResponseActivityContentVO } from '../models/BaseResponseActivityContentVO';
import type { BaseResponseListActivityTitleVO } from '../models/BaseResponseListActivityTitleVO';
import type { BaseResponseString } from '../models/BaseResponseString';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ActivityControllerService {
    /**
     * @param requestBody
     * @returns BaseResponseString OK
     * @throws ApiError
     */
    public static addActivity(
        requestBody: ActivityAddDTO,
    ): CancelablePromise<BaseResponseString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/activity/add',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param arg0
     * @returns BaseResponseActivityContentVO OK
     * @throws ApiError
     */
    public static getActivity(
        arg0: number,
    ): CancelablePromise<BaseResponseActivityContentVO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/activity/get-activity',
            query: {
                'arg0': arg0,
            },
        });
    }
    /**
     * @returns BaseResponseListActivityTitleVO OK
     * @throws ApiError
     */
    public static getActivityList(): CancelablePromise<BaseResponseListActivityTitleVO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/activity/get-activity-list',
        });
    }
}
