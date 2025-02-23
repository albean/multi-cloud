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
          console.log("REDIS: listneing", { queueName })
        if (msg) {
          console.log("REDIS: Got message")
          await cb(JSON.parse(msg));
          processMessage();
        }
      };

      processMessage();
    }
  };
};
