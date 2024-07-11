/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IBusinessPartnershipDTO } from './IBusinessPartnershipDTO';
import type { PMSOrganizationUserDto } from './PMSOrganizationUserDto';

export type PMSOrganizationDto = {
    id: number;
    name: string | null;
    business_partnership_id: number;
    logo_url: string;
    BusinessPartnership: IBusinessPartnershipDTO;
    PMSOrganizationUsers: Array<PMSOrganizationUserDto>;
    logo_presigned_url: string;
};

