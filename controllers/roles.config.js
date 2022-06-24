const rolesConfig = {
  leaves: {
    CANCELLED: 0,
    APPLIED: 1,
    APPROVED: 2,
    REJECTED: 3,
  },
  users: {
    OWNER: 1,
    ADMIN_HR: 2,
    MANAGER: 3,
    EMPLOYEE: 4,
  },
  attendance: {
    PRESENT: 0,
    ABSENT: 1,
    HALFDAY: 2,
  },
};

module.exports = rolesConfig;
