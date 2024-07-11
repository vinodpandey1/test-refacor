/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FindAllResponseDto } from '../models/FindAllResponseDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MasterBusinessModelAPI {

    /**
     * @returns FindAllResponseDto
     * @throws ApiError
     */
    public static findAll(): CancelablePromise<Array<FindAllResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gateways/pms/api/master-business-models',
        });
    }

}
