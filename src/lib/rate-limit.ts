import { LRUCache } from 'lru-cache'

type RateLimitContext = {
  ip: string
  limit: number
  windowMs: number
}

const tokenCache = new Map<string, { count: number, expiry: number }>();

export const rateLimit = async (ip: string, limit: number, windowMs: number) => {
  const now = Date.now();
  const token = tokenCache.get(ip);
  
  // Clean up expired
  if (token && now > token.expiry) {
     tokenCache.delete(ip);
  }

  const currentUsage = tokenCache.get(ip) || { count: 0, expiry: now + windowMs };
  
  if (now > currentUsage.expiry) {
      currentUsage.count = 0;
      currentUsage.expiry = now + windowMs;
  }
  
  const isRateLimited = currentUsage.count >= limit;
  
  if (!isRateLimited) {
    currentUsage.count++;
    tokenCache.set(ip, currentUsage);
  } else {
     // Optional: Extend ban on repeated offenses
  }
  
  return {
    success: !isRateLimited,
    limit,
    remaining: isRateLimited ? 0 : limit - currentUsage.count,
    reset: currentUsage.expiry
  };
};
