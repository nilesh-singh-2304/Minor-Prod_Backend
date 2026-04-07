class ApiErrorResponse{
    constructor(statusCode , message="Request Rejected"){
        this.statusCode = statusCode,
        this.message = message
    }
}

export {ApiErrorResponse};