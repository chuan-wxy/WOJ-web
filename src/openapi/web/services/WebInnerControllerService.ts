/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProblemSubmit } from '../models/ProblemSubmit';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WebInnerControllerService {
    /**
     * @param requestBody
     * @returns boolean OK
     * @throws ApiError
     */
    public static updateProblemSubmitById(
        requestBody: ProblemSubmit,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/inner/update/problemsubmit/by/id',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
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
}
