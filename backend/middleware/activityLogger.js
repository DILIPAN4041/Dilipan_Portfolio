import ActivityLog from '../models/ActivityLog.js';

export const logActivity = (action, resource) => {
    return async (req, res, next) => {
        // Store original methods
        const originalJson = res.json;
        const originalSend = res.send;

        // Override res.json to log after successful response
        res.json = function (data) {
            // Only log if request was successful (2xx status code)
            if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
                logToDatabase(req, action, resource, data);
            }
            return originalJson.call(this, data);
        };

        res.send = function (data) {
            if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
                logToDatabase(req, action, resource, data);
            }
            return originalSend.call(this, data);
        };

        next();
    };
};

const logToDatabase = async (req, action, resource, responseData) => {
    try {
        const logData = {
            userId: req.user.id,
            userEmail: req.user.email,
            action,
            resource,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent')
        };

        // Extract resource ID from response if available
        if (responseData && responseData.data && responseData.data._id) {
            logData.resourceId = responseData.data._id;
        } else if (req.params.id) {
            logData.resourceId = req.params.id;
        }

        // Add details based on action
        if (action === 'create') {
            logData.details = `Created new ${resource}`;
        } else if (action === 'update') {
            logData.details = `Updated ${resource}`;
        } else if (action === 'delete') {
            logData.details = `Deleted ${resource}`;
        }

        await ActivityLog.create(logData);
    } catch (error) {
        // Don't fail the request if logging fails
        console.error('Activity logging error:', error);
    }
};

// Manual logging function for special cases
export const createActivityLog = async (userId, userEmail, action, resource, details = '', resourceId = null) => {
    try {
        await ActivityLog.create({
            userId,
            userEmail,
            action,
            resource,
            details,
            resourceId
        });
    } catch (error) {
        console.error('Activity logging error:', error);
    }
};
