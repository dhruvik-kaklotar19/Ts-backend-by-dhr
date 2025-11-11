import { Request, Response, NextFunction } from "express";
import { AuthService } from '../../services';
import { forgotPassword_mail } from '../../utils/emailService';
import { sendApiResponse, STATUS_CODES, responseMessage } from "../../common";

/**
 * Admin Sign Up
 */
export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        // Check if user already exists
        const userExists = await AuthService.checkUserExists(email);
        if (userExists) {
            return sendApiResponse(
                res,
                STATUS_CODES.BAD_REQUEST,
                responseMessage.alreadyEmail,
                null
            );
        }

        // Create new user
        const user = await AuthService.createUser(req.body);
        const sanitizedUser = AuthService.sanitizeUser(user);

        return sendApiResponse(
            res,
            STATUS_CODES.CREATED,
            responseMessage.signupSuccess,
            sanitizedUser
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Admin Login
 */
export const admin_login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // Verify credentials
        const { isValid, user } = await AuthService.verifyCredentials(email, password);

        if (!isValid || !user) {
            return sendApiResponse(
                res,
                STATUS_CODES.BAD_REQUEST,
                responseMessage.invalidAdminPasswordEmail,
                null
            );
        }

        // Generate token
        const token = AuthService.generateAuthToken(user._id);
        const sanitizedUser = AuthService.sanitizeUser(user);

        return sendApiResponse(
            res,
            STATUS_CODES.OK,
            responseMessage.loginSuccess,
            { user: sanitizedUser, token }
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Forgot Password
 */
export const forgot_password = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        // Find user
        const user = await AuthService.findActiveUserByEmail(email);
        if (!user) {
            return sendApiResponse(
                res,
                STATUS_CODES.BAD_REQUEST,
                responseMessage.invalidEmail,
                {}
            );
        }

        // Generate OTP
        const otp = AuthService.generateOTP();
        const otpExpireTime = AuthService.getOTPExpiryTime(1);

        // Send email
        const emailSent = await forgotPassword_mail({
            email: user.email,
            fullName: user.fullName,
            otp: otp
        });

        if (!emailSent) {
            return sendApiResponse(
                res,
                STATUS_CODES.INTERNAL_SERVER_ERROR,
                responseMessage.addDataError,
                {}
            );
        }

        // Update user with OTP
        const updated = await AuthService.updateUserOTP(email, otp, otpExpireTime);
        if (updated) {
            return sendApiResponse(
                res,
                STATUS_CODES.OK,
                "OTP sent successfully!",
                {}
            );
        }

        return sendApiResponse(
            res,
            STATUS_CODES.FORBIDDEN,
            responseMessage.updateDataError("otp"),
            {}
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Forgot Password OTP Verification
 */
export const forgot_password_otp_verification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp } = req.body;

        // Verify OTP
        const { isValid, user, expired } = await AuthService.verifyOTP(email, otp);

        if (!isValid) {
            if (expired) {
                return sendApiResponse(
                    res,
                    STATUS_CODES.PARTIAL_CONTENT,
                    responseMessage.expireOTP,
                    null
                );
            }
            return sendApiResponse(
                res,
                STATUS_CODES.NOT_FOUND,
                responseMessage.invalidOTP,
                null
            );
        }

        const sanitizedUser = AuthService.sanitizeUser(user);
        return sendApiResponse(
            res,
            STATUS_CODES.OK,
            responseMessage.OTPverified,
            sanitizedUser
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Reset Password
 */
export const reset_password = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, confirmPassword } = req.body;

        // Validate passwords match
        if (password !== confirmPassword) {
            return sendApiResponse(
                res,
                STATUS_CODES.BAD_REQUEST,
                "Passwords do not match",
                {}
            );
        }

        // Reset password
        const updated = await AuthService.resetPassword(email, password);
        if (updated) {
            return sendApiResponse(
                res,
                STATUS_CODES.OK,
                responseMessage.resetPasswordSuccess,
                { action: "Please go to login page" }
            );
        }

        return sendApiResponse(
            res,
            STATUS_CODES.NOT_IMPLEMENTED,
            responseMessage.resetPasswordError,
            {}
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Admin Logout
 */
export const admin_LogOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user }: any = req.headers;
        const { deviceToken } = req.body;

        if (!user || !user._id) {
            return sendApiResponse(
                res,
                STATUS_CODES.UNAUTHORIZED,
                responseMessage.invalidToken,
                {}
            );
        }

        const result = await AuthService.removeDeviceToken(user._id, deviceToken);
        if (result) {
            return sendApiResponse(
                res,
                STATUS_CODES.OK,
                responseMessage.logout,
                {}
            );
        }

        return sendApiResponse(
            res,
            STATUS_CODES.BAD_REQUEST,
            "Logout failed",
            {}
        );
    } catch (error) {
        next(error);
    }
};