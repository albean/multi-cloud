import { getEnv } from 'common/utils';
import { createClient } from 'redis';

export const RedisQueueFactory = (queueName: string) => {
  const host = getEnv("QUEUE_HOST");
  const port = 6379;

  console.log("Redis", { host, port });

  const client = createClient({ url: `redis://${host}:${port}` });

  client.connect();

  return {
    send: async (msg) => {
      console.log("Redis: publishing...", { queueName });
      await client.rPush(queueName, JSON.stringify(msg));
      console.log("SENT");
    },
    consume: async (cb) => {
      const processMessage = async () => {
        const msg = await client.lPop(queueName);
        if (msg) {
          console.log("REDIS: Got message")
          try {
            await cb(JSON.parse(msg));
          } catch (e) {
            console.error("REDIS: Error during processing message", e)
          }
        }
        await sleep(100)
        processMessage();
      };

      processMessage();
    }
  };
};

const sleep = (ms: number) => new Promise(cb => setTimeout(cb, ms))
