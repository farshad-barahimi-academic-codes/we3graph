/**
 * The ServiceResponse class
 * @constructor
 * @param {boolean} isSuccess - determines if the requested operation was successful
 * @param {string} errorMessage - optional, the error message if not successful
 * @param {object} data - optional, the returned data
 */
function ServiceResponse(isSuccess, errorMessage, data)
{
    this.isSuccess_ = isSuccess;
    this.errorMessage_ = errorMessage;
    this.data_ = data;
}

ServiceResponse.prototype.GetIsSuccess = function ()
{
    return this.isSuccess_;
};

ServiceResponse.prototype.GetErrorMessage = function ()
{
    return this.errorMessage_;
};

ServiceResponse.prototype.GetData = function ()
{
    return this.data_;
};