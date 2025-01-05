/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserInnerControllerService {
    /**
     * @returns string OK
     * @throws ApiError
     */
    public static test(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/inner/test',
        });
    }
    /**
     * @param userAccount
     * @returns User OK
     * @throws ApiError
     */
    public static getOneByUserAccount(
        userAccount: string,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/inner/get/one/by/useraccount',
            query: {
                'userAccount': userAccount,
            },
        });
    }
    /**
     * @param id
     * @returns User OK
     * @throws ApiError
     */
    public static getById(
        id: string,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/inner/get/by/id',
            query: {
                'id': id,
            },
        });
    }
}
