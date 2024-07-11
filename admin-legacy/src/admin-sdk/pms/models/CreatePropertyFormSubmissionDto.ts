/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IProcessedData } from './IProcessedData';

export type CreatePropertyFormSubmissionDto = {
    property_id: number;
    form_id: string;
    submission_date: string;
    checkin_date: string;
    approval_status: string;
    occupancy_status: string;
    inspector_name: string;
    ip_address: string;
    location: string;
    processed_data: Array<IProcessedData>;
    raw_data: Record<string, any>;
    submission_id: string;
};

