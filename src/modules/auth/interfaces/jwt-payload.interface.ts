export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

export interface JwtPayloadWithRt extends JwtPayload {
  refreshToken: string;
}
