class ApiResponse {
    constructor(statusCode , message = "Request Successful" , data = null){
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400;
    }
}

export {ApiResponse};