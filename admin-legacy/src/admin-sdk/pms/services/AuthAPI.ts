/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthenticateRequest } from '../models/AuthenticateRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuthAPI {

    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static authenticate(
        requestBody: AuthenticateRequest,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/gateways/pms/api/auth/authenticate',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns string
     * @throws ApiError
     */
    public static throwError(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gateways/pms/api/auth/throw',
        });
    }

}
