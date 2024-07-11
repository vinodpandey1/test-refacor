/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePropertyFormSubmissionDto } from '../models/CreatePropertyFormSubmissionDto';
import type { UpdatePropertyFormSubmissionDto } from '../models/UpdatePropertyFormSubmissionDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class JotformPropertySubmissionAPI {

    /**
     * @param requestBody
     * @returns CreatePropertyFormSubmissionDto
     * @returns any
     * @throws ApiError
     */
    public static create(
        requestBody: CreatePropertyFormSubmissionDto,
    ): CancelablePromise<CreatePropertyFormSubmissionDto | Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/gateways/pms/api/property-form-submission',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param propertyId Property Id, Format eg: 23
     * @param submissionDate Property Form Submission, Format eg: 2023-08-06
     * @returns any
     * @throws ApiError
     */
    public static findOne(
        propertyId: number,
        submissionDate: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gateways/pms/api/property-form-submission',
            query: {
                'property_id': propertyId,
                'submission_date': submissionDate,
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
        requestBody: UpdatePropertyFormSubmissionDto,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/gateways/pms/api/property-form-submission/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
