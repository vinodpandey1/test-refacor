/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AttendanceHousekeeperUserDto } from './AttendanceHousekeeperUserDto';
import type { AttendanceLifecycleStageDto } from './AttendanceLifecycleStageDto';

export type CalanderAttendanceDto = {
    id: number;
    punch_in_at: string;
    punch_out_at: string;
    lifecycle_stage_id: number;
    punch_in_latitude: number;
    punch_in_longitude: number;
    punch_out_latitude: number;
    punch_out_longitude: number;
    attendance_date: string;
    LifecycleStage: AttendanceLifecycleStageDto;
    AttendanceHousekeeperUser: AttendanceHousekeeperUserDto;
};

