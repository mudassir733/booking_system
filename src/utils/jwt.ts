import jwt, { type SignOptions, type Secret } from "jsonwebtoken";

export type AccessTokenPayload = {
  sub: string;
  role: "CUSTOMER" | "CSR" | "ADMIN";
  type: "access";
};

export type RefreshTokenPayload = {
  sub: string;
  type: "refresh";
};

const accessSecret = (): Secret => {
  const secret = process.env.JWT_ACCESS_SECRET ?? process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET or JWT_SECRET environment variable is not set");
  }
  return secret;
};

const refreshSecret = (): Secret => {
  const secret = process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET or JWT_SECRET environment variable is not set");
  }
  return secret;
};

export function signAccessToken(payload: Omit<AccessTokenPayload, "type">) {
  const expiresIn: SignOptions["expiresIn"] =
    (process.env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"]) ?? "15m";
  return jwt.sign({ ...payload, type: "access" }, accessSecret(), {
    expiresIn,
  });
}

export function signRefreshToken(payload: Omit<RefreshTokenPayload, "type">) {
  const expiresIn: SignOptions["expiresIn"] =
    (process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"]) ?? "7d";
  return jwt.sign({ ...payload, type: "refresh" }, refreshSecret(), {
    expiresIn,
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, accessSecret()) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, refreshSecret()) as RefreshTokenPayload;
}
