"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVercelEnvironment = exports.trackError = exports.sendAnalyticsEvent = exports.vercelAnalytics = void 0;
/**
 * Vercel Analytics Middleware for tracking API performance and usage
 * Sends performance metrics to Vercel Analytics platform
 */
// Track if we're in a Vercel environment
const isVercelEnvironment = process.env.VERCEL === '1';
exports.isVercelEnvironment = isVercelEnvironment;
/**
 * Send analytics event to Vercel
 */
const sendAnalyticsEvent = async (eventData) => {
    // Only send if in Vercel environment
    if (!isVercelEnvironment) {
        return;
    }
    try {
        // Send to Vercel Analytics endpoint if available
        const analyticsEndpoint = process.env.VERCEL_ANALYTICS_ENDPOINT;
        if (analyticsEndpoint) {
            await fetch(analyticsEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData),
            }).catch((err) => {
                // Silently fail - don't interrupt the application for analytics
                console.debug('[Analytics] Failed to send event:', err.message);
            });
        }
    }
    catch (error) {
        // Silently fail - analytics should never interrupt the main application
        console.debug('[Analytics] Error sending analytics:', error);
    }
};
exports.sendAnalyticsEvent = sendAnalyticsEvent;
/**
 * Middleware to track API requests and performance
 */
const vercelAnalytics = () => {
    return (req, res, next) => {
        const startTime = Date.now();
        const startMark = `${req.method}-${req.path}-${Date.now()}`;
        // Override res.json and res.send to capture response data
        const originalJson = res.json.bind(res);
        const originalSend = res.send.bind(res);
        res.json = function (data) {
            const duration = Date.now() - startTime;
            // Track the response
            const eventData = {
                name: `api_${req.method.toLowerCase()}_${sanitizeRoute(req.path)}`,
                type: 'performance',
                value: duration,
                metadata: {
                    method: req.method,
                    path: req.path,
                    status: res.statusCode,
                    duration,
                    timestamp: new Date().toISOString(),
                    environment: process.env.NODE_ENV || 'development',
                },
            };
            // Fire and forget - don't wait for analytics to complete
            sendAnalyticsEvent(eventData);
            return originalJson(data);
        };
        res.send = function (data) {
            const duration = Date.now() - startTime;
            // Track the response
            const eventData = {
                name: `api_${req.method.toLowerCase()}_${sanitizeRoute(req.path)}`,
                type: 'performance',
                value: duration,
                metadata: {
                    method: req.method,
                    path: req.path,
                    status: res.statusCode,
                    duration,
                    timestamp: new Date().toISOString(),
                    environment: process.env.NODE_ENV || 'development',
                },
            };
            // Fire and forget - don't wait for analytics to complete
            sendAnalyticsEvent(eventData);
            return originalSend(data);
        };
        next();
    };
};
exports.vercelAnalytics = vercelAnalytics;
/**
 * Sanitize route paths to avoid unique values
 * Converts /api/users/123 to /api/users/:id
 */
const sanitizeRoute = (path) => {
    // Remove dynamic segments like UUIDs and numeric IDs
    return path
        .replace(/\/[a-f0-9]{24}(?:\/|$)/gi, '/:id/') // MongoDB ObjectId
        .replace(/\/[0-9]+(?:\/|$)/gi, '/:id/') // Numeric IDs
        .replace(/\/[a-f0-9-]{36}(?:\/|$)/gi, '/:uuid/') // UUIDs
        .replace(/\/$/, '') // Remove trailing slash
        .toLowerCase();
};
/**
 * Track application errors in analytics
 */
const trackError = async (error, context) => {
    const eventData = {
        name: `api_error_${context.method.toLowerCase()}`,
        type: 'event',
        metadata: {
            errorMessage: error.message,
            errorType: error.name,
            path: context.path,
            method: context.method,
            statusCode: context.statusCode,
            timestamp: new Date().toISOString(),
        },
    };
    await sendAnalyticsEvent(eventData);
};
exports.trackError = trackError;
//# sourceMappingURL=vercelAnalytics.js.map