/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CronsAPI {

    /**
     * @returns string
     * @throws ApiError
     */
    public static syncForms(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/gateways/pms/crons/forms/sync',
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public static markAttendance(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/gateways/pms/crons/housekeeping/markAbsentForPendingAttendance',
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public static markPunchOutForPresentAttendance(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/gateways/pms/crons/housekeeping/markPunchOutForPresentAttendance',
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public static createAttendance(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/gateways/pms/crons/housekeeping/createUpcomingAttendance',
        });
    }

}
