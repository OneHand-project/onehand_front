export interface User {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: "GUEST";
  emailVerified: false;
  phoneVerified: false;
  phoneNumber: string;
}
