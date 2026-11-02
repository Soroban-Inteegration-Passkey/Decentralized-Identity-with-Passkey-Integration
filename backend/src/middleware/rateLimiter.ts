import { RateLimiterMemory } from 'rate-limiter-flexible'
import { Request, Response, NextFunction } from 'express'
import { createError } from './errorHandler'

// Create rate limiters for different endpoints
const authLimiter = new RateLimiterMemory({
  points: 5, // Number of requests
  duration: 900, // Per 15 minutes
  blockDuration: 900, // Block for 15 minutes
})

const generalLimiter = new RateLimiterMemory({
  points: 100, // Number of requests
  duration: 60, // Per 1 minute
  blockDuration: 60, // Block for 1 minute
})

const passkeyLimiter = new RateLimiterMemory({
  points: 3, // Number of requests
  duration: 300, // Per 5 minutes
  blockDuration: 300, // Block for 5 minutes
})

export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  const limiter = getLimiterForRoute(req.path)
  const clientKey = req.ip || req.socket.remoteAddress || '127.0.0.1'
  
  limiter.consume(clientKey)
    .then(() => next())
    .catch((rejRes) => {
      const secs = Math.round(rejRes.msBeforeNext / 1000) || 1
      res.set('Retry-After', String(secs))
      next(createError('Too Many Requests', 429))
    })
}

function getLimiterForRoute(path: string): RateLimiterMemory {
  if (path.startsWith('/api/auth')) {
    return authLimiter
  }
  if (path.startsWith('/api/passkey')) {
    return passkeyLimiter
  }
  return generalLimiter
}
