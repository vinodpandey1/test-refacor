/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AttendanceFacetsDto } from './AttendanceFacetsDto';
import type { CalanderAttendanceDto } from './CalanderAttendanceDto';

export type AttendancesCalendarDto = {
    joining_date: string;
    server_current_date: string;
    attendances: Array<CalanderAttendanceDto>;
    facets: AttendanceFacetsDto;
};

