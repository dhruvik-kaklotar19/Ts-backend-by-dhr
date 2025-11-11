/**
 * Environment Variable Validator
 * Validates all required environment variables at startup
 */

const requiredEnvVars: string[] = [
    'DB_URL',
    'JWT_TOKEN_SECRET'
];

const optionalEnvVars: { [key: string]: string } = {
    'PORT': '8082',
    'NODE_ENV': 'development'
};

/**
 * Validate environment variables
 */
export function validateEnv(): void {
    const missing: string[] = [];
    const invalid: string[] = [];

    // Check required variables
    requiredEnvVars.forEach(varName => {
        if (!process.env[varName]) {
            missing.push(varName);
        }
    });

    // Set optional variables with defaults
    Object.keys(optionalEnvVars).forEach(varName => {
        if (!process.env[varName]) {
            process.env[varName] = optionalEnvVars[varName];
        }
    });

    // Validate format
    if (process.env.DB_URL && !process.env.DB_URL.startsWith('mongodb')) {
        invalid.push('DB_URL must be a valid MongoDB connection string');
    }

    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:');
        missing.forEach(varName => console.error(`   - ${varName}`));
        process.exit(1);
    }

    if (invalid.length > 0) {
        console.error('❌ Invalid environment variables:');
        invalid.forEach(msg => console.error(`   - ${msg}`));
        process.exit(1);
    }

    console.log('✅ All environment variables validated');
}
