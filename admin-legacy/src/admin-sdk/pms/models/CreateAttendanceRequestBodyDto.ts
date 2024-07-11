/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CreateAttendanceRequestBodyDto = {
    housekeeper_user_id: number;
    /**
     * punch_in|leave|pending
     */
    status: string;
    attendance_date: string;
    punch_in_at?: string;
    punch_in_latitude?: number;
    punch_in_longitude?: number;
    punch_out_latitude?: number;
    punch_out_longitude?: number;
};

