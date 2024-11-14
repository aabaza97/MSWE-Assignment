import joi from 'joi';

const tokenSchema = joi.string().empty('').required();

export default tokenSchema;
