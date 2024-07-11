/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ScriptAPI {

    /**
     * @returns string
     * @throws ApiError
     */
    public static updateJotformData(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gateways/pms/api/scripts/jotform-update-submission-data',
        });
    }

}
