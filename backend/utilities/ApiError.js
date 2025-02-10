class ApiError extends Error{
    // own constructor;
    constructor(
        statusCode,
        message="something went wrong",
        errors=[],
        stack=""
    ){
        //used for over writing;
        super(message)
        this.statusCode=statusCode
        this.data=null
        this.message=message
        this.success=false;
        this.errors=errors
        if(stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}
export {ApiError}