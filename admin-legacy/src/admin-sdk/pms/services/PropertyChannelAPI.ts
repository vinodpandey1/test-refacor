/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePropertyChannelsDto } from '../models/CreatePropertyChannelsDto';
import type { CreatePropertyChannelsDtoMultipleDto } from '../models/CreatePropertyChannelsDtoMultipleDto';
import type { UpdatePropertyChannelsDto } from '../models/UpdatePropertyChannelsDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PropertyChannelAPI {

    /**
     * @param propertyId
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static create(
        propertyId: string,
        requestBody: CreatePropertyChannelsDto,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/gateways/pms/api/properties/{propertyId}/channels',
            path: {
                'propertyId': propertyId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param propertyId
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static createMutltiple(
        propertyId: string,
        requestBody: CreatePropertyChannelsDtoMultipleDto,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/gateways/pms/api/properties/{propertyId}/channels/multiple',
            path: {
                'propertyId': propertyId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id
     * @param propertyId
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static update(
        id: string,
        propertyId: string,
        requestBody: UpdatePropertyChannelsDto,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/gateways/pms/api/properties/{propertyId}/channels/{id}',
            path: {
                'id': id,
                'propertyId': propertyId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
