/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UpdateAttendanceRequestBodyDto = {
    id: number;
    housekeeper_user_id: number;
    /**
     * punch_in|punch_out|leave
     */
    status: string;
    punch_in_latitude?: number;
    punch_in_longitude?: number;
    punch_out_latitude?: number;
    punch_out_longitude?: number;
};

