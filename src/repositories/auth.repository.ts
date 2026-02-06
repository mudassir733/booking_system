import prisma from "../database/db";

export const AuthRepository = () => {
  const findUserByEmail = async (email: string) =>
    prisma.user.findUnique({ where: { email } });

  const findUserById = async (id: string) =>
    prisma.user.findUnique({ where: { id } });

  const createUser = async (data: {
    fullName: string;
    email: string;
    phone?: string | null;
    passwordHash: string;
    role?: "CUSTOMER" | "CSR" | "ADMIN";
  }) =>
    prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone ?? null,
        passwordHash: data.passwordHash,
        role: data.role ?? "CSR",
      },
    });

  const createRefreshToken = async (data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }) =>
    prisma.refreshToken.create({
      data: {
        userId: data.userId,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
      },
    });

  const findRefreshToken = async (tokenHash: string) =>
    prisma.refreshToken.findUnique({ where: { tokenHash } });

  const revokeRefreshToken = async (tokenHash: string) =>
    prisma.refreshToken.update({
      where: { tokenHash },
      data: { revokedAt: new Date() },
    });

  const revokeAllRefreshTokens = async (userId: string) =>
    prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

  return {
    findUserByEmail,
    findUserById,
    createUser,
    createRefreshToken,
    findRefreshToken,
    revokeRefreshToken,
    revokeAllRefreshTokens,
  };
};
