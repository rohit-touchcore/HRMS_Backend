const routeConfig = {
  // Auth
  SIGN_IN: "/signin",
  SIGN_UP: "/signup",
  // Users
  GET_LEAVES: "/get-leaves",
  GET_ALL_MANAGERS:"/get-all-managers",
  GET_APPROVED_LEAVES: "/get-approved-leaves",
  GET_LEAVES_TO_APPROVE: "/get-leaves-to-approve",
  GET_PROFILE_BY_ID: "/get-profile-by-id",
  GET_ALL_USERS: "/get-all-users",
  EDIT_PROFILE: "/edit-profile",
  EDIT_PROFILE_PICTURE: "/edit-profile-pic",
  DELETE_PROFILE: "/delete-profile",
  // Leaves
  APPLY_LEAVE: "/apply",
  UPDATE_LEAVE: "/update",
  APPROVE_LEAVE: "/approve",
  CANCEL_LEAVE: "/cancel",
  // Attendance
  CHECKIN: "/checkin",
  CHECKOUT: "/checkout",
  APPROVE_CHECKOUT: "/approve-checkout",
};

module.exports = routeConfig;
