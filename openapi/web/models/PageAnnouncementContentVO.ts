/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnouncementContentVO } from './AnnouncementContentVO';
import type { OrderItem } from './OrderItem';
export type PageAnnouncementContentVO = {
    records?: Array<AnnouncementContentVO>;
    total?: number;
    size?: number;
    current?: number;
    orders?: Array<OrderItem>;
    optimizeCountSql?: PageAnnouncementContentVO;
    searchCount?: PageAnnouncementContentVO;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
};

