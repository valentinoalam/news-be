export type JwtPayload = {
  sub: string;
  username: string;
  roles: string[];
  iat?: any;
  exp?: any;
};
