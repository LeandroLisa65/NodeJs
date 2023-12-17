import bcrypt from 'bcrypt';

export const hashData = async (data) => {
    return bcrypt.hash(data,10);
}

export const isValidPassword = async (data, hashedData) => {
    return await bcrypt.compare(data, hashedData);
}