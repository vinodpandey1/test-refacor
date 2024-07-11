/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrganizationDto } from '../models/CreateOrganizationDto';
import type { FindAllBusinessPartnershipsResponseDto } from '../models/FindAllBusinessPartnershipsResponseDto';
import type { FindAllOrganizationsDTO } from '../models/FindAllOrganizationsDTO';
import type { InsertOrganizationsOneResponseDto } from '../models/InsertOrganizationsOneResponseDto';
import type { IOrganizationUserDto } from '../models/IOrganizationUserDto';
import type { PMSOrganizationDto } from '../models/PMSOrganizationDto';
import type { UpdateOrganizationDto } from '../models/UpdateOrganizationDto';
import type { UpdateOrganizationResponseDto } from '../models/UpdateOrganizationResponseDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class OrganizationAPI {

    /**
     * @param requestBody
     * @returns InsertOrganizationsOneResponseDto
     * @returns any
     * @throws ApiError
     */
    public static createOrganization(
        requestBody: CreateOrganizationDto,
    ): CancelablePromise<InsertOrganizationsOneResponseDto | Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/gateways/pms/api/organizations',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns FindAllOrganizationsDTO
     * @throws ApiError
     */
    public static findAll(): CancelablePromise<Array<FindAllOrganizationsDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gateways/pms/api/organizations',
        });
    }

    /**
     * @returns FindAllBusinessPartnershipsResponseDto
     * @throws ApiError
     */
    public static getAllBusinessPartnerships(): CancelablePromise<Array<FindAllBusinessPartnershipsResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gateways/pms/api/organizations/business-partnerships',
        });
    }

    /**
     * @param id
     * @returns PMSOrganizationDto
     * @throws ApiError
     */
    public static findOne(
        id: number,
    ): CancelablePromise<PMSOrganizationDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gateways/pms/api/organizations/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id
     * @param requestBody
     * @returns UpdateOrganizationResponseDto
     * @throws ApiError
     */
    public static update(
        id: number,
        requestBody: UpdateOrganizationDto,
    ): CancelablePromise<UpdateOrganizationResponseDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/gateways/pms/api/organizations/{id}',
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
    public static addMultipleOrganizationUsers(
        id: string,
        requestBody: Array<IOrganizationUserDto>,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/gateways/pms/api/organizations/{id}/users/add',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
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
            url: '/gateways/pms/api/organizations/logo/presignedPutUrl',
            query: {
                'extension': extension,
            },
        });
    }

}
