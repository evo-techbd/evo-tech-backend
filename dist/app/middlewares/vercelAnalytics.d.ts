import { Request, Response, NextFunction } from 'express';
/**
 * Vercel Analytics Middleware for tracking API performance and usage
 * Sends performance metrics to Vercel Analytics platform
 */
declare const isVercelEnvironment: boolean;
/**
 * Send analytics event to Vercel
 */
declare const sendAnalyticsEvent: (eventData: {
    name: string;
    type: "event" | "performance";
    value?: number;
    metadata?: Record<string, any>;
}) => Promise<void>;
/**
 * Middleware to track API requests and performance
 */
declare const vercelAnalytics: () => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Track application errors in analytics
 */
declare const trackError: (error: Error, context: {
    method: string;
    path: string;
    statusCode: number;
}) => Promise<void>;
export { vercelAnalytics, sendAnalyticsEvent, trackError, isVercelEnvironment };
//# sourceMappingURL=vercelAnalytics.d.ts.map