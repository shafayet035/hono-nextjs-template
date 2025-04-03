interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: number;
        message: string;
    };
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        timestamp: string;
    };
}

export const createSuccessResponse = <T>(data: T, meta?: Omit<ApiResponse<T>['meta'], 'timestamp'>): ApiResponse<T> => {
    return {
        success: true,
        data,
        meta: {
            ...meta,
            timestamp: new Date().toISOString(),
        },
    };
};

export const createErrorResponse = (message: string, details?: any): ApiResponse<never> => {
    return {
        success: false,
        error: {
            message,
            ...(details && { details }),
        },
        meta: {
            timestamp: new Date().toISOString(),
        },
    };
};

export const createPaginatedResponse = <T>(data: T[], page: number, limit: number, total: number): ApiResponse<T[]> => {
    return {
        success: true,
        data,
        meta: {
            page,
            limit,
            total,
            timestamp: new Date().toISOString(),
        },
    };
};
