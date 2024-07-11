export const VIEW_SETTINGS = {
  CALENDER_SETTINGS: {
    FACET_IDS: [2, 3, 4, 5, 6],
    ATTENDANCE_LIFECYCLE_STAGE_IDS: {
      PENDING: 1,
      PRESENT_FULL_DAY: 2,
      PRESENT_HALF_DAY: 3,
      ABSENT_FULL_DAY: 4,
      ABSENT_EARLY_CHECKOUT: 5,
      LEAVE: 6,
      PUNCH_IN: 7,
    },
  },
  HK_USER_SETTINGS: {
    ATTENDANCE_FACETS_ALLOWED_IDS: [2, 3, 4, 5, 6],
    ATTENDANCE_LIFECYCLE_STAGE_IDS: {
      PENDING: 1,
      PRESENT_FULL_DAY: 2,
      PRESENT_HALF_DAY: 3,
      ABSENT_FULL_DAY: 4,
      ABSENT_EARLY_CHECKOUT: 5,
      LEAVE: 6,
      PUNCH_IN: 7,
    },
    ATTENDANCE_FACETS_STATUS_CONFIG: [
      {
        id: 1,
        slug: 'pending',
        label: 'Pending',
        bg_color: 'rgb(166, 166, 166)',
        border_color: '#9d9d9d',
        text_color: '#FFFFFF',
      },
      {
        id: 2,
        slug: 'present_full_day',
        label: 'Full Day',
        bg_color: 'rgba(40, 199, 111, 0.16)',
        border_color: '#28C76F',
        text_color: '#28C76F',
      },
      {
        id: 3,
        slug: 'present_half_day',
        label: 'Half Day',
        bg_color: 'rgba(115, 103, 240, 0.16)',
        border_color: '#7367F0',
        text_color: '#7367F0',
      },
      {
        id: 4,
        slug: 'absent_full_day',
        label: 'Absent',
        bg_color: 'rgba(234, 84, 85, 0.16)',
        border_color: '#EA5455',
        text_color: '#EA5455',
      },
      {
        id: 5,
        slug: 'absent_early_checkout',
        label: 'Absent*',
        bg_color: 'rgba(234, 84, 85, 0.16)',
        border_color: '#EA5455',
        text_color: '#EA5455',
      },
      {
        id: 6,
        slug: 'leave',
        label: 'Leave',
        bg_color: 'rgba(255, 159, 67, 0.16)',
        border_color: '#FF9F43',
        text_color: '#FF9F43',
      },
      {
        id: 7,
        slug: 'punch_in',
        label: 'Punch In',
        bg_color: 'rgb(166, 166, 166)',
        border_color: '#9d9d9d',
        text_color: '#FFFFFF',
      },
      {
        id: 200,
        slug: 'default',
        label: 'Default Config',
        bg_color: 'rgb(166, 166, 166)',
        border_color: '#9d9d9d',
        text_color: '#FFFFFF',
      }
    ]
  }
}

export const ATTENDANCE_FACETS_STATUS_CONFIG_MAP_WITH_ID =
  VIEW_SETTINGS.HK_USER_SETTINGS.ATTENDANCE_FACETS_STATUS_CONFIG.reduce((acc: any, stage) => {
    acc[stage.id] = stage;

    return acc;
  }, {});
