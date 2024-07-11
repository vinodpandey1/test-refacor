/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePropertyFormsMappingDto } from '../models/CreatePropertyFormsMappingDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class JotformPropertyMappingAPI {

    /**
     * @param requestBody
     * @returns CreatePropertyFormsMappingDto
     * @returns any
     * @throws ApiError
     */
    public static create(
        requestBody: CreatePropertyFormsMappingDto,
    ): CancelablePromise<CreatePropertyFormsMappingDto | Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/gateways/pms/api/property-forms-mapping',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public static findAll(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gateways/pms/api/property-forms-mapping',
        });
    }

    /**
     * @param propertyId
     * @returns any
     * @throws ApiError
     */
    public static findOneByPropertyId(
        propertyId: number,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gateways/pms/api/property-forms-mapping/{property_id}',
            path: {
                'property_id': propertyId,
            },
        });
    }

}
