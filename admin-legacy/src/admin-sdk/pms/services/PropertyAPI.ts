/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateAddressDto } from '../models/CreateAddressDto';
import type { CreatePropertyBusinessModelDto } from '../models/CreatePropertyBusinessModelDto';
import type { CreatePropertyDto } from '../models/CreatePropertyDto';
import type { PropertyDetailResponseDto } from '../models/PropertyDetailResponseDto';
import type { UpdatePropertyDto } from '../models/UpdatePropertyDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PropertyAPI {

    /**
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static createAddress(
        id: number,
        requestBody: CreateAddressDto,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/gateways/pms/api/properties/{id}/addresses',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static create(
        requestBody: CreatePropertyDto,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/gateways/pms/api/properties',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param limit
     * @param propertyNameSearchText
     * @param ownerNameSearchText
     * @param orderBy
     * @returns any
     * @throws ApiError
     */
    public static findAll(
        limit?: number,
        propertyNameSearchText?: string,
        ownerNameSearchText?: string,
        orderBy?: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gateways/pms/api/properties',
            query: {
                'limit': limit,
                'propertyNameSearchText': propertyNameSearchText,
                'ownerNameSearchText': ownerNameSearchText,
                'order_by': orderBy,
            },
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public static getAddressAreas(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gateways/pms/api/properties/addresses/areas',
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public static lifecycleStages(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gateways/pms/api/properties/lifecycleStages',
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public static businessModels(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gateways/pms/api/properties/businessModels',
        });
    }

    /**
     * @param id
     * @returns PropertyDetailResponseDto
     * @throws ApiError
     */
    public static findOne(
        id: number,
    ): CancelablePromise<PropertyDetailResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gateways/pms/api/properties/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static update(
        id: string,
        requestBody: UpdatePropertyDto,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/gateways/pms/api/properties/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static createOrUpdateBusinessModel(
        id: number,
        requestBody: CreatePropertyBusinessModelDto,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/gateways/pms/api/properties/{id}/businessmodel',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
