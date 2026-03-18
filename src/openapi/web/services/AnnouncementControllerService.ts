/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnouncementAddDTO } from '../models/AnnouncementAddDTO';
import type { AnnouncementSearchDTO } from '../models/AnnouncementSearchDTO';
import type { BaseResponseAnnouncementContentVO } from '../models/BaseResponseAnnouncementContentVO';
import type { BaseResponseListAnnouncementTitleVO } from '../models/BaseResponseListAnnouncementTitleVO';
import type { BaseResponsePageAnnouncementContentVO } from '../models/BaseResponsePageAnnouncementContentVO';
import type { BaseResponseString } from '../models/BaseResponseString';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AnnouncementControllerService {
    /**
     * @param current
     * @param size
     * @param requestBody
     * @returns BaseResponsePageAnnouncementContentVO OK
     * @throws ApiError
     */
    public static getAnnouncementList(
        current: number,
        size: number,
        requestBody: AnnouncementSearchDTO,
    ): CancelablePromise<BaseResponsePageAnnouncementContentVO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/announcement/admin/announcement-list',
            query: {
                'current': current,
                'size': size,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns BaseResponseString OK
     * @throws ApiError
     */
    public static addAnnouncement(
        requestBody: AnnouncementAddDTO,
    ): CancelablePromise<BaseResponseString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/announcement/admin/add',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns BaseResponseAnnouncementContentVO OK
     * @throws ApiError
     */
    public static getLastAnnouncement(): CancelablePromise<BaseResponseAnnouncementContentVO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/announcement/get-last-announcement',
        });
    }
    /**
     * @param id
     * @returns BaseResponseAnnouncementContentVO OK
     * @throws ApiError
     */
    public static getAnnouncement(
        id: number,
    ): CancelablePromise<BaseResponseAnnouncementContentVO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/announcement/get-announcement',
            query: {
                'id': id,
            },
        });
    }
    /**
     * @returns BaseResponseListAnnouncementTitleVO OK
     * @throws ApiError
     */
    public static getAnnouncementTitleList(): CancelablePromise<BaseResponseListAnnouncementTitleVO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/announcement/get-announcement-list',
        });
    }
}
