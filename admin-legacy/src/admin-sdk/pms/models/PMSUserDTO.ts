/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AttendanceDto } from './AttendanceDto';
import type { RoleDto } from './RoleDto';
import type { UserDto } from './UserDto';
import type { UserLifecycleStageDto } from './UserLifecycleStageDto';

export type PMSUserDTO = {
    id: number;
    User: UserDto;
    role_id: number | null;
    Role?: RoleDto | null;
    Attendance?: AttendanceDto | null;
    LifecycleStage?: UserLifecycleStageDto | null;
};

