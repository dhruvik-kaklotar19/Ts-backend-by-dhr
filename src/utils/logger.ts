

import morgan from 'morgan';
import chalk from 'chalk';

export const logger = {
    body: (data: unknown) => {
        console.log(`body--------------->>`, data);
    },
    info: (label: string) => {
        console.log(`${label} `);
    },
    error: (data: unknown) => {
        console.error(`error--------------->>`, data);
    },
};

export const morganLogger = morgan((tokens, req, res) => {
    const currentDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const status = tokens.status(req, res);
    const statusCode = status ? Number(status) : 200;

    let emoji = '🟢';
    let message = '✔';

    if (statusCode >= 400 && statusCode < 500) {
        emoji = '⚠️ ';
        message = '❌ client errors';
    } else if (statusCode >= 500) {
        emoji = '😡';
        message = '❌ server errors';
    }

    return chalk.whiteBright(`${emoji} --> `) +
        chalk.greenBright.italic(currentDate) +
        ' ' + chalk.magentaBright.bold(tokens.method(req, res)) +
        ' ' + chalk.yellowBright(tokens.url(req, res)) +
        ' ' + chalk.cyanBright(tokens.status(req, res)) +
        ' ' + chalk.whiteBright(`${tokens['response-time'](req, res)} ms ${chalk[statusCode >= 400 ? 'redBright' : 'greenBright'](message)}`);
});
