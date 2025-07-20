interface CacheEntry {
  timestamp: number;
  record: string | number;
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

  has(record: string): boolean {
    const entry = this.cache.get(record);
    if (!entry) return false;

    if (Date.now() - entry.timestamp > this.cacheTtl) {
      this.delete(record);
      return false;
    }

    this.moveToEnd(record);
    return true;
  }

  add(record: string): void {
    if (this.cache.has(record)) this.delete(record);

    while (this.cache.size >= this.cacheMaxSize) {
      const oldestEmail = this.accessOrder.shift();
      if (oldestEmail) this.cache.delete(oldestEmail);
    }

    this.cache.set(record, {
      timestamp: Date.now(),
      record
    });

    this.accessOrder.push(record);
  }

  private delete(record: string) {
    this.cache.delete(record);
    const index = this.accessOrder.indexOf(record);
    if (index > -1) this.accessOrder.splice(index, 1);
  }

  private moveToEnd(record: string) {
    const index = this.accessOrder.indexOf(record);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
      this.accessOrder.push(record);
    }
  }

  cleanup() {
    const now = Date.now();
    for (const [record, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.cacheTtl) this.delete(record);
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
