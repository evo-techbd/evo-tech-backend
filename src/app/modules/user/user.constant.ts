export const USER_ROLE = {
  ADMIN: "admin",
  EMPLOYEE: "employee",
  USER: "user",
} as const;

export const UserStatus = ["active", "blocked"];

export const UserSearchableFields = ["email", "firstname", "lastname", "phone"];
