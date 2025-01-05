/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProblemSubmitVO } from '../models/ProblemSubmitVO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class JudgeInnerControllerService {
    /**
     * @param problemSubmitId
     * @returns ProblemSubmitVO OK
     * @throws ApiError
     */
    public static doJudge(
        problemSubmitId: number,
    ): CancelablePromise<ProblemSubmitVO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/inner/dojudge',
            query: {
                'problemSubmitId': problemSubmitId,
            },
        });
    }
}
