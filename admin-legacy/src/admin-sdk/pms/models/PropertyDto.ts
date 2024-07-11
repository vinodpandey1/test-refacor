/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AddressDto } from './AddressDto';
import type { KeyAccountManagerDto } from './KeyAccountManagerDto';
import type { LifecycleStageDto } from './LifecycleStageDto';
import type { PrimaryOwnerDto } from './PrimaryOwnerDto';
import type { PropertyBusinessModelDto } from './PropertyBusinessModelDto';
import type { PropertyChannelDto } from './PropertyChannelDto';
import type { PropertyJotfromMappingDto } from './PropertyJotfromMappingDto';

export type PropertyDto = {
    id: number;
    name: string;
    code: string;
    primary_owner_id: number;
    lifecycle_stage_id: number;
    key_account_manager_id: number;
    PrimaryOwner: PrimaryOwnerDto;
    Address: AddressDto;
    KeyAccountManager: KeyAccountManagerDto;
    PropertyChannels: Array<PropertyChannelDto>;
    PropertyBusinessModel: PropertyBusinessModelDto;
    created_at: string;
    updated_at: string;
    LifecycleStage: LifecycleStageDto;
    PropertyJotfromMapping: PropertyJotfromMappingDto;
};

