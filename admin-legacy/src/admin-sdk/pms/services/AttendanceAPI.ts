/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttendancesCalendarResponseDto } from '../models/AttendancesCalendarResponseDto';
import type { CreateAttendanceRequestBodyDto } from '../models/CreateAttendanceRequestBodyDto';
import type { UpdateAttendanceRequestBodyDto } from '../models/UpdateAttendanceRequestBodyDto';
import type { UpdateAttendanceResponseDto } from '../models/UpdateAttendanceResponseDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AttendanceAPI {

    /**
     * @param requestBody
     * @returns UpdateAttendanceResponseDto
     * @returns any
     * @throws ApiError
     */
    public static createAttendance(
        requestBody: CreateAttendanceRequestBodyDto,
    ): CancelablePromise<UpdateAttendanceResponseDto | Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/gateways/pms/api/attendance/function/createAttendance',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody
     * @returns UpdateAttendanceResponseDto
     * @throws ApiError
     */
    public static markAttendance(
        requestBody: UpdateAttendanceRequestBodyDto,
    ): CancelablePromise<UpdateAttendanceResponseDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/gateways/pms/api/attendance/function/markAttendance',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param month
     * @param userId
     * @returns AttendancesCalendarResponseDto
     * @throws ApiError
     */
    public static getAttendanceCalendar(
        month: string,
        userId: number,
    ): CancelablePromise<AttendancesCalendarResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gateways/pms/api/attendance/function/getAttendanceCalendar',
            query: {
                'month': month,
                'user_id': userId,
            },
        });
    }

}
