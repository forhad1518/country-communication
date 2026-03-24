export const successResponse = (data) => {
    return Response.json({
        success: true,
        data,
    });
};

export const errorResponse = (message) => {
    return Response.json({
        success: false,
        message,
    });
};