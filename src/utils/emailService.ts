import nodemailer from 'nodemailer';
import config from 'config';
import { logger } from './logger';

const mail: any = config.get('nodeMail');

const option = {
    host: 'smtp.gmail.com',
    port: 465,
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user: mail.mail,
        pass: mail.password
    }
};

const transporter = nodemailer.createTransport(option);

export const signUp_verification_mail = async (mail_data: any) => {
    try {
        return new Promise((resolve, reject) => {
            const mailOption = {
                from: mail.mail,
                to: mail_data?.email,
                subject: "Ts-server Otp Here",
                html: `<html lang="en-US">
                <head>
                    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                    <title>Ts-server OTP</title>
                    <meta fullName="description" content="Ts-server SignUp Otp.">
                    <style type="text/css">
                        a:hover {
                            text-decoration: underline !important;
                        }
                    </style>
                </head>
                <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                        <tr>
                            <td>
                                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                    align="center" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:0 35px;">
                                                    <h1 > Ts-server</h1>
                                                        <h1
                                                            style="color:#1e1e2d; font-weight:600; margin:0;font-size:25px;font-family:'Rubik',sans-serif;">
                                                            Otp Verification</h1>
                                                        <span
                                                            style="display:inline-block; vertical-align:middle; margin:10px 0 26px 0; border-bottom:1px solid #cecece; width:100px;"></span>
                                                        <p
                                                            style="color:#455056; font-size:15px;line-height:24px;text-align:left; margin:0;">
                                                            Hi Dear,
                                                            <br><br>
                                                            Thank you for using Ts-server. Your Otp is <span style="font-weight:700; color: #1e1e2d;">${mail_data.otp} </span> for <span style="font-weight:700; color: #1e1e2d;">${mail_data.email} </span>. Please keep this information secure.
                                                            <br><br>
                                                            Thanks & Regards<br>
                                                            Team Ts-server
                                                        </p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                            </table>
                                        </td>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                          </tr>
                        </tr>
                    </table>
                    </td>
                    </tr>
                    </table>
                </body>
                
                </html>`,
            };
            transporter.sendMail(mailOption, (err, data) => {
                if (err) {
                    logger.error({ message: 'Email send error', error: err });
                    reject(err);
                }
                else {
                    resolve(`Email has been sent to ${mail_data?.email}, kindly follow the instruction`);
                }
            });
        });
    }
    catch (error) {
        logger.error({ message: 'Email service error', error });
        throw error;
    }
};

export const forgotPassword_mail = async (mail_data: any) => {
    try {
        return new Promise((resolve, reject) => {
            const mailOption = {
                from: mail.mail,
                to: mail_data?.email,
                subject: "Ts-server-app ForgotPassword OTP Here",
                html: `<html lang="en-US">
                <head>
                    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                    <title>Ts-server-app OTP</title>
                    <meta fullName="description" content="Ts-server-app OTP.">
                    <style type="text/css">
                        a:hover {
                            text-decoration: underline !important;
                        }
                    </style>
                </head>
                <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                        <tr>
                            <td>
                                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                    align="center" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:0 35px;">
                                                    <h1 > Fit Flush</h1>
    
                                                        <h1
                                                            style="color:#1e1e2d; font-weight:600; margin:0;font-size:25px;font-family:'Rubik',sans-serif;">
                                                            OTP Verification</h1>
                                                        <span
                                                            style="display:inline-block; vertical-align:middle; margin:10px 0 26px 0; border-bottom:1px solid #cecece; width:100px;"></span>
                                                        <p
                                                            style="color:#455056; font-size:15px;line-height:24px;text-align:left; margin:0;">
                                                            Hi <span style="font-weight:600; color: #1e1e2d;">${mail_data.fullName}</span>,
                                                            <br><br>
                                                            Your Verification OTP For Ts-server-app is <span style="font-weight:700; color: #1e1e2d;">${mail_data.otp}. </span>Please keep this information secure.
                                                            <br><br>
                                                            Thanks & Regards<br>
                                                            Team Ts-server-app
                                                        </p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                            </table>
                                        </td>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                          </tr>
                        </tr>
                    </table>
                    </td>
                    </tr>
                    </table>
                </body>
                
                </html>`,
            };
            transporter.sendMail(mailOption, (err, data) => {
                if (err) {
                    logger.error({ message: 'Email send error', error: err });
                    reject(err);
                }
                else {
                    resolve(`Email has been sent to ${mail_data?.email}, kindly follow the instruction`);
                }
            });
        });
    }
    catch (error) {
        logger.error({ message: 'Email service error', error });
        throw error;
    }
};
