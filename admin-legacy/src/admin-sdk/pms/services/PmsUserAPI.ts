/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttendanceUsersFacetsResponseDto } from '../models/AttendanceUsersFacetsResponseDto';
import type { CreateHousekeeperDto } from '../models/CreateHousekeeperDto';
import type { UpdateHousekeeperDto } from '../models/UpdateHousekeeperDto';
import type { UpdatePMSUserDto } from '../models/UpdatePMSUserDto';
import type { UsersResponseDTO } from '../models/UsersResponseDTO';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PmsUserAPI {

    /**
     * @param limit
     * @param roleIds for multiple role ids send comma(,) seperated values eg: 7,8,9
     * @param includeAttendance enter 1 or 0
     * @param startDate for single date data send start and end date same, these fields for housekeeper staff listing
     * @param endDate
     * @returns UsersResponseDTO
     * @throws ApiError
     */
    public static findAll(
        limit?: number,
        roleIds?: string,
        includeAttendance?: number,
        startDate?: string,
        endDate?: string,
    ): CancelablePromise<UsersResponseDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gateways/pms/api/pms_users',
            query: {
                'limit': limit,
                'role_ids': roleIds,
                'include_attendance': includeAttendance,
                'start_date': startDate,
                'end_date': endDate,
            },
        });
    }

    /**
     * @param startDate for single date data send start and end date same, these fields for housekeeper staff listing
     * @param endDate
     * @returns AttendanceUsersFacetsResponseDto
     * @throws ApiError
     */
    public static getAttendanceUsersFacets(
        startDate: string,
        endDate: string,
    ): CancelablePromise<AttendanceUsersFacetsResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gateways/pms/api/pms_users/getAttendanceUsersFacets',
            query: {
                'start_date': startDate,
                'end_date': endDate,
            },
        });
    }

    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static createHouseKeeper(
        requestBody: CreateHousekeeperDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/gateways/pms/api/pms_users/createHousekeeper',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static updateHouseKeeper(
        requestBody: UpdateHousekeeperDto,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/gateways/pms/api/pms_users/updateHousekeeper',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static getHousekeeper(
        id: number,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gateways/pms/api/pms_users/getHousekeeper',
            query: {
                'id': id,
            },
        });
    }

    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static findOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gateways/pms/api/pms_users/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @deprecated
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static update(
        id: string,
        requestBody: UpdatePMSUserDto,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/gateways/pms/api/pms_users/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static sendHousekeeperCreationEmail(
        id: number,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gateways/pms/api/pms_users/functions/sendHousekeeperCreationEmail',
            query: {
                'id': id,
            },
        });
    }

    /**
     * @param extension
     * @returns any
     * @throws ApiError
     */
    public static presignedPutUrl(
        extension: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gateways/pms/api/pms_users/profile_photo/presignedPutUrl',
            query: {
                'extension': extension,
            },
        });
    }

}
