class ApiError extends Error{
    constructor(statusCode , msg = "Something went wrong" , errors = [] , stack = "") {
        super(msg);
        this.statusCode = statusCode;
        this.message = msg;
        this.data = null;
        this.success = false;
        this.error = errors;

        if(stack){
            this.stack = stack;
        }
        else{
            Error.captureStackTrace(this , this.constructor)
        }
    }
}

export {ApiError};