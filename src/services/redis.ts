import {createClient, RedisClientType} from 'redis';
import logger from "@logger";

type RedisValue = string | number;

class RedisService {
    private client: RedisClientType;

    constructor() {
        this.client = createClient({
            socket: {
                host: 'localhost',
                port: 6379,
            }
        });
        this.client.on('error', (err) => logger.error('Redis Client Error', err));
        this.client.connect().catch(err => {
            logger.error('Redis Client Connection Error', err);
        })
    }

    async set(key: string, value: RedisValue, expirationInSeconds?: number): Promise<void> {
        try {
            if (expirationInSeconds) {
                await this.client.set(key, value, {
                    EX: expirationInSeconds
                });
            } else {
                await this.client.set(key, value);
            }
        } catch (e) {
            logger.error('Redis Set Error', e);
        }
    }

    async get(key: string): Promise<RedisValue | null> {
        try {
            return await this.client.get(key);
        } catch (e) {
            logger.error('Redis Get Error', e);
            return null;
        }
    }

    async delete(key: string): Promise<void> {
        try {
            await this.client.del(key);
        } catch (e) {
            logger.error('Redis Delete Error', e);
        }
    }
}

const redisService = new RedisService();
export default redisService;