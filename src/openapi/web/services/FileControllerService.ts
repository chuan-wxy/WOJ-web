/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponseListJudgeCaseFileVO } from '../models/BaseResponseListJudgeCaseFileVO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FileControllerService {
    /**
     * @param pid
     * @param requestBody
     * @returns BaseResponseListJudgeCaseFileVO OK
     * @throws ApiError
     */
    public static uploadJudgeCase(
        pid: string,
        requestBody?: {
            file: Blob;
        },
    ): CancelablePromise<BaseResponseListJudgeCaseFileVO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/file/admin/upload-judgecase',
            query: {
                'pid': pid,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param fileName
     * @param problemId
     * @returns BaseResponseListJudgeCaseFileVO OK
     * @throws ApiError
     */
    public static deleteJudgeCase(
        fileName: string,
        problemId: string,
    ): CancelablePromise<BaseResponseListJudgeCaseFileVO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/file/admin/delete-judgecase',
            query: {
                'fileName': fileName,
                'problemId': problemId,
            },
        });
    }
}
