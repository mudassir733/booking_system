import bcrypt from "bcryptjs";

import { AuthRepository } from "../repositories/auth.repository";
import { ApiErrorFactory } from "../utils/errorHandler";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { hashToken } from "../utils/tokenHash";

const REFRESH_COOKIE_NAME = "refresh_token";

export const AuthService = () => {
  const toSafeUser = (user: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    role: "CUSTOMER" | "CSR" | "ADMIN";
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date | null;
  }) => ({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLoginAt: user.lastLoginAt,
  });

  const register = async (input: {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
    role?: "CUSTOMER" | "CSR" | "ADMIN";
  }) => {
    const existing = await AuthRepository().findUserByEmail(input.email);
    if (existing) {
      throw ApiErrorFactory.conflict("Email already in use");
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await AuthRepository().createUser({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      passwordHash,
      role: input.role,
    });

    return toSafeUser(user);
  };

  const login = async (input: { email: string; password: string }) => {
    const user = await AuthRepository().findUserByEmail(input.email);
    if (!user) {
      throw ApiErrorFactory.unauthorized("Invalid credentials");
    }

    const matches = await bcrypt.compare(input.password, user.passwordHash);
    if (!matches) {
      throw ApiErrorFactory.unauthorized("Invalid credentials");
    }

    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user.id });
    const tokenHash = hashToken(refreshToken);

    const expiresAt = new Date();
    const refreshDays = parseInt(
      (process.env.JWT_REFRESH_EXPIRES_DAYS ?? "7").toString(),
      10
    );
    expiresAt.setDate(expiresAt.getDate() + refreshDays);

    await AuthRepository().createRefreshToken({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    return { user: toSafeUser(user), accessToken, refreshToken };
  };

  const refresh = async (refreshToken: string) => {
    const payload = verifyRefreshToken(refreshToken);
    if (payload.type !== "refresh") {
      throw ApiErrorFactory.unauthorized("Invalid refresh token");
    }

    const tokenHash = hashToken(refreshToken);
    const record = await AuthRepository().findRefreshToken(tokenHash);

    if (!record || record.revokedAt || record.expiresAt < new Date()) {
      throw ApiErrorFactory.unauthorized("Refresh token expired or revoked");
    }

    const user = await AuthRepository().findUserById(payload.sub);
    if (!user) {
      throw ApiErrorFactory.unauthorized("User not found");
    }

    await AuthRepository().revokeRefreshToken(tokenHash);

    const nextAccessToken = signAccessToken({ sub: user.id, role: user.role });
    const nextRefreshToken = signRefreshToken({ sub: user.id });
    const nextHash = hashToken(nextRefreshToken);

    const expiresAt = new Date();
    const refreshDays = parseInt(
      (process.env.JWT_REFRESH_EXPIRES_DAYS ?? "7").toString(),
      10
    );
    expiresAt.setDate(expiresAt.getDate() + refreshDays);

    await AuthRepository().createRefreshToken({
      userId: user.id,
      tokenHash: nextHash,
      expiresAt,
    });

    return {
      user: toSafeUser(user),
      accessToken: nextAccessToken,
      refreshToken: nextRefreshToken,
    };
  };

  const logout = async (refreshToken: string | null) => {
    if (!refreshToken) return;
    const tokenHash = hashToken(refreshToken);
    await AuthRepository().revokeRefreshToken(tokenHash).catch(() => undefined);
  };

  return {
    register,
    login,
    refresh,
    logout,
    REFRESH_COOKIE_NAME,
  };
};
