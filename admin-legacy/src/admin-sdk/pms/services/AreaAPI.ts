/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateAreaDto } from '../models/CreateAreaDto';
import type { FindAllResponseDto } from '../models/FindAllResponseDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AreaAPI {

    /**
     * @param requestBody
     * @returns CreateAreaDto
     * @throws ApiError
     */
    public static createArea(
        requestBody: CreateAreaDto,
    ): CancelablePromise<CreateAreaDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/gateways/pms/api/areas',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns FindAllResponseDto
     * @throws ApiError
     */
    public static findAll(): CancelablePromise<FindAllResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gateways/pms/api/areas',
        });
    }

    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static deleteArea(
        id: number,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/gateways/pms/api/areas/{id}',
            path: {
                'id': id,
            },
        });
    }

}
