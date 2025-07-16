interface CacheEntry {
  timestamp: number;
  email: string;
}

const CACHE_MAX_SIZE = 1000;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

export class Cache {
  private cache: Map<string, CacheEntry> = new Map();
  private accessOrder: string[] = [];
  private cacheMaxSize: number = CACHE_MAX_SIZE;
  private cacheTtl: number = CACHE_TTL;

  constructor(cacheMaxSize: number = CACHE_MAX_SIZE, cacheTtl: number = CACHE_TTL) {
    this.cacheMaxSize = cacheMaxSize;
    this.cacheTtl = cacheTtl;
  }

  has(email: string): boolean {
    const entry = this.cache.get(email);
    if (!entry) return false;

    if (Date.now() - entry.timestamp > this.cacheTtl) {
      this.delete(email);
      return false;
    }

    this.moveToEnd(email);
    return true;
  }

  add(email: string): void {
    if (this.cache.has(email)) this.delete(email);

    while (this.cache.size >= this.cacheMaxSize) {
      const oldestEmail = this.accessOrder.shift();
      if (oldestEmail) this.cache.delete(oldestEmail);
    }

    this.cache.set(email, {
      timestamp: Date.now(),
      email
    });

    this.accessOrder.push(email);
  }

  private delete(email: string) {
    this.cache.delete(email);
    const index = this.accessOrder.indexOf(email);
    if (index > -1) this.accessOrder.splice(index, 1);
  }

  private moveToEnd(email: string) {
    const index = this.accessOrder.indexOf(email);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
      this.accessOrder.push(email);
    }
  }

  cleanup() {
    const now = Date.now();
    for (const [email, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.cacheTtl) this.delete(email);
    }
  }

  getStats(): { size: number; maxSize: number; ttl: number } {
    return {
      size: this.cache.size,
      maxSize: this.cacheMaxSize,
      ttl: this.cacheTtl
    };
  }
}
