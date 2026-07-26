namespace Backend.Utils
{
    public class ServiceResult<T>
    {
        public bool Success { get; init; }
        public string Message { get; init; } = string.Empty;
        public int StatusCode { get; init; }
        public T? Data { get; init; }

        public static ServiceResult<T> Ok(T data, string message)
        {
            return new ServiceResult<T>
            {
                Success = true,
                Message = message,
                StatusCode = StatusCodes.Status200OK,
                Data = data
            };
        }

        public static ServiceResult<T> Fail(string message, int statusCode)
        {
            return new ServiceResult<T>
            {
                Success = false,
                Message = message,
                StatusCode = statusCode
            };
        }
    }
}
