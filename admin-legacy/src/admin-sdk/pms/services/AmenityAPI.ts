/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmailDTO } from '../models/EmailDTO';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AmenityAPI {

    /**
     * @param propertyId
     * @param priority Filter by asset priority
     * @param type Filter by asset type
     * @returns any
     * @throws ApiError
     */
    public static getAmenitiesGroupedByLocation(
        propertyId: number,
        priority?: string,
        type?: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gateways/pms/api/amenity/grouped/{propertyId}',
            path: {
                'propertyId': propertyId,
            },
            query: {
                'priority': priority,
                'type': type,
            },
        });
    }

    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static sendEmail(
        requestBody: EmailDTO,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/gateways/pms/api/amenity/sendUpgradeEmail',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
