/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Problem } from '../models/Problem';
import type { ProblemSubmit } from '../models/ProblemSubmit';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WebInnerControllerService {
    /**
     * @param problemSubmitId
     * @returns ProblemSubmit OK
     * @throws ApiError
     */
    public static getProblemSubmitById(
        problemSubmitId: number,
    ): CancelablePromise<ProblemSubmit> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/inner/get/problemsubmit/by/id',
            query: {
                'problemSubmitId': problemSubmitId,
            },
        });
    }
    /**
     * @param problemId
     * @returns Problem OK
     * @throws ApiError
     */
    public static getProblemById(
        problemId: number,
    ): CancelablePromise<Problem> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/inner/get/problem/by/id',
            query: {
                'problemId': problemId,
            },
        });
    }
}
