import type { Request, Response } from "express";

import { AuthService } from "../services/auth.service";
import { sendErrorResponse, sendSuccessResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/errorHandler";

const cookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 1000 * 60 * 60 * 24 * 7,
});

export const AuthController = () => {
  const me = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
      return sendErrorResponse(res, 401, "Unauthorized", "Unauthorized");
    }
    return sendSuccessResponse(res, 200, { user }, "Profile fetched");
  };

  const register = async (req: Request, res: Response) => {
    try {
      const { fullName, email, phone, password, role } = req.body;
      const user = await AuthService().register({
        fullName,
        email,
        phone,
        password,
        role,
      });

      return sendSuccessResponse(res, 201, { user }, "User registered");
    } catch (error: any) {
      if (error instanceof ApiError) {
        return sendErrorResponse(res, error.statusCode, "Error", error.message);
      }
      return sendErrorResponse(res, 500, "Internal server error", error.message);
    }
  };

  const login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await AuthService().login({
        email,
        password,
      });

      res.cookie(AuthService().REFRESH_COOKIE_NAME, refreshToken, cookieOptions());
      return sendSuccessResponse(
        res,
        200,
        { user, accessToken },
        "Login successful"
      );
    } catch (error: any) {
      if (error instanceof ApiError) {
        return sendErrorResponse(res, error.statusCode, "Unauthorized", error.message);
      }
      return sendErrorResponse(res, 500, "Internal server error", error.message);
    }
  };

  const refresh = async (req: Request, res: Response) => {
    try {
      const tokenFromBody = req.body?.refreshToken as string | undefined;
      const tokenFromCookie = req.cookies?.[AuthService().REFRESH_COOKIE_NAME] as
        | string
        | undefined;
      const refreshToken = tokenFromBody ?? tokenFromCookie;

      if (!refreshToken) {
        return sendErrorResponse(res, 401, "Unauthorized", "Missing refresh token");
      }

      const { user, accessToken, refreshToken: nextRefreshToken } =
        await AuthService().refresh(refreshToken);

      res.cookie(AuthService().REFRESH_COOKIE_NAME, nextRefreshToken, cookieOptions());
      return sendSuccessResponse(
        res,
        200,
        { user, accessToken },
        "Token refreshed"
      );
    } catch (error: any) {
      if (error instanceof ApiError) {
        return sendErrorResponse(res, error.statusCode, "Unauthorized", error.message);
      }
      return sendErrorResponse(res, 500, "Internal server error", error.message);
    }
  };

  const logout = async (req: Request, res: Response) => {
    try {
      const tokenFromBody = req.body?.refreshToken as string | undefined;
      const tokenFromCookie = req.cookies?.[AuthService().REFRESH_COOKIE_NAME] as
        | string
        | undefined;
      const refreshToken = tokenFromBody ?? tokenFromCookie ?? null;

      await AuthService().logout(refreshToken);
      res.clearCookie(AuthService().REFRESH_COOKIE_NAME, cookieOptions());
      return sendSuccessResponse(res, 200, null, "Logged out");
    } catch (error: any) {
      return sendErrorResponse(res, 500, "Internal server error", error.message);
    }
  };

  return {
    me,
    register,
    login,
    refresh,
    logout,
  };
};
