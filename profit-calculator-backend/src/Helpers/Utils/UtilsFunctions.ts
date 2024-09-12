import * as bcrypt from 'bcrypt';

export default class UtilsFunctions {
    /**
     * Generates a verification code.
     * @returns A Promise that resolves to a string representing the verification code.
     * @throws None
     */
    public static async generateVerificationCode(): Promise<string> {
        try {
            const min = 100000;
            const max = 999999;
            const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
            return randomNumber.toString();
        } catch (error) {
            throw new Error(`Error generating verification code: ${error}`);
        }
    }

    /**
     * Splits the JWT token by space and returns the second part, which is the token itself.
     * @param token - The JWT token to be split.
     * @returns The second part of the JWT token split by space.
     */
    public static async jwtSplitter(token: string): Promise<string> {
        const jwtSplitter: string = token.split(' ')[1];
        return jwtSplitter;
    }

    /**
     * Encrypts the given data with a salt.
     * @param data - The data to encrypt. Must be a non-null string.
     * @returns A Promise that resolves to the encrypted data as a string.
     * @throws TypeError - If `data` is not a string.
     * @throws Error - If `data` is null, or if the encryption fails.
     */
    public static async getEncryptData(data: string): Promise<string> {
        if (data === null) {
            throw new TypeError('Data cannot be null');
        }

        if (typeof data !== 'string') {
            throw new TypeError('Data must be a string');
        }

        try {
            const salt: string = await bcrypt.genSalt(10);
            const encryptedData: string = bcrypt.hashSync(data, salt);

            return encryptedData;
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(`Bcrypt generate password error: ${e.message}`);
            } else {
                throw new Error('Bcrypt generate password error');
            }
        }
    }

    /**
     * Compares the given plaintext data to the given encrypted data.
     * @param data - The plaintext data to compare. Must be a non-null string.
     * @param encryptedData - The encrypted data to compare. Must be a non-null string.
     * @returns A Promise that resolves to a boolean indicating whether the comparison was successful.
     */
    public static async getEncryptCompare(data: string, encryptedData: string): Promise<boolean> {
        if (data === null || encryptedData === null) {
            throw new TypeError('Both data and encryptedData must be non-null strings');
        }

        try {
            const dataValidation = await bcrypt.compare(data, encryptedData);
            return dataValidation;
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(`Bcrypt compare error: ${e.message}`);
            }
            throw new Error('Bcrypt compare error');
        }
    }
}