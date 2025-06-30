type TokenPayload = {
  sub: string; // user ID or subject
  userId: string;
  email?: string;
  exp: number; // expiration timestamp
  roles?: string;
};

export type { TokenPayload };
