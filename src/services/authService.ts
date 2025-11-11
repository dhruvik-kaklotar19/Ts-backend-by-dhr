import { userModel } from '../database/model';
import { userStatus } from '../common';
import { generatePasswordHash, comparePassword, generateToken } from '../utils/authUtils';
import { logger } from '../utils/logger';

interface UserData {
    email: string;
    password: string;
    fullName?: string;
    [key: string]: any;
}

interface CredentialsResult {
    isValid: boolean;
    user: any | null;
}

interface OTPResult {
    isValid: boolean;
    user: any | null;
    expired: boolean;
}

/**
 * Authentication Service
 * Handles all authentication business logic
 */
export class AuthService {
    /**
     * Check if user exists by email
     */
    static async checkUserExists(email: string): Promise<boolean> {
        try {
            const user = await userModel.findOne({ email });
            return !!user;
        } catch (error) {
            logger.error({ message: 'Error checking user existence', error });
            throw error;
        }
    }

    /**
     * Create new user
     */
    static async createUser(userData: UserData): Promise<any> {
        try {
            const hashPassword = await generatePasswordHash(userData.password);
            const newUser = new userModel({
                ...userData,
                password: hashPassword,
                userType: userStatus.admin
            });
            return await newUser.save();
        } catch (error) {
            logger.error({ message: 'Error creating user', error });
            throw error;
        }
    }

    /**
     * Find active user by email
     */
    static async findActiveUserByEmail(email: string): Promise<any> {
        try {
            return await userModel.findOne({ email, isActive: true });
        } catch (error) {
            logger.error({ message: 'Error finding user', error });
            throw error;
        }
    }

    /**
     * Verify user credentials
     */
    static async verifyCredentials(email: string, password: string): Promise<CredentialsResult> {
        try {
            const user = await this.findActiveUserByEmail(email);
            if (!user) {
                return { isValid: false, user: null };
            }

            const passwordMatch = await comparePassword(password, user.password);
            return {
                isValid: passwordMatch,
                user: passwordMatch ? user : null
            };
        } catch (error) {
            logger.error({ message: 'Error verifying credentials', error });
            throw error;
        }
    }

    /**
     * Generate authentication token
     */
    static generateAuthToken(userId: any): string {
        return generateToken({
            _id: userId,
            status: "Login",
            generatedOn: new Date().getTime()
        });
    }

    /**
     * Generate OTP
     */
    static generateOTP(): number {
        return Math.floor(300000 + Math.random() * 500000);
    }

    /**
     * Calculate OTP expiry time
     */
    static getOTPExpiryTime(minutes: number = 1): Date {
        return new Date(new Date().setMinutes(new Date().getMinutes() + minutes));
    }

    /**
     * Update user OTP
     */
    static async updateUserOTP(email: string, otp: number, otpExpireTime: Date): Promise<any> {
        try {
            return await userModel.findOneAndUpdate(
                { email, isActive: true },
                { otp, otpExpireTime },
                { new: true }
            );
        } catch (error) {
            logger.error({ message: 'Error updating OTP', error });
            throw error;
        }
    }

    /**
     * Verify OTP
     */
    static async verifyOTP(email: string, otp: number): Promise<OTPResult> {
        try {
            const user = await userModel.findOne({
                email,
                otp,
                isActive: true
            });

            if (!user) {
                return { isValid: false, user: null, expired: false };
            }

            const timeDiff = new Date().getTime() - new Date(user.otpExpireTime).getTime();
            if (timeDiff > 0) {
                return { isValid: false, user: null, expired: true };
            }

            // Clear OTP after verification
            await userModel.findOneAndUpdate(
                { email, otp, isActive: true },
                { otp: null, otpExpireTime: null }
            );

            return { isValid: true, user, expired: false };
        } catch (error) {
            logger.error({ message: 'Error verifying OTP', error });
            throw error;
        }
    }

    /**
     * Reset user password
     */
    static async resetPassword(email: string, newPassword: string): Promise<any> {
        try {
            const bcryptjs = require("bcryptjs");
            const salt = bcryptjs.genSaltSync(10);
            const hashPassword = bcryptjs.hashSync(newPassword, salt);

            return await userModel.findOneAndUpdate(
                { email, isActive: true },
                { password: hashPassword },
                { new: true }
            );
        } catch (error) {
            logger.error({ message: 'Error resetting password', error });
            throw error;
        }
    }

    /**
     * Remove device token on logout
     */
    static async removeDeviceToken(userId: any, deviceToken: string): Promise<any> {
        try {
            return await userModel.updateOne(
                { _id: userId, isActive: true },
                { $pull: { deviceToken } }
            );
        } catch (error) {
            logger.error({ message: 'Error removing device token', error });
            throw error;
        }
    }

    /**
     * Sanitize user object (remove sensitive data)
     */
    static sanitizeUser(user: any): any {
        if (!user) return null;
        const userObj = user.toObject ? user.toObject() : { ...user };
        delete userObj.password;
        delete userObj.otp;
        delete userObj.otpExpireTime;
        return userObj;
    }
}
