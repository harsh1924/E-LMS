class NewError extends Error {
    constructor (message, statusCode) {
        super(message);
        statusCode = this.statusCode;

        Error.captureStackTrace(constructor, this.constructor);
    }
};

export default NewError;