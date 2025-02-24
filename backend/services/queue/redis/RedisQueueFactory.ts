import { getEnv } from 'common/utils';
import { createClient, RedisClientType } from 'redis';

let connection: Promise<RedisClientType>;

export const RedisQueueFactory = (queueName: string) => {
  const host = getEnv("QUEUE_HOST");
  const port = 6379;

  console.log("Redis", { host, port });

  if (!connection) {
    connection = new Promise<RedisClientType>((resolve, reject) => {
      const client = createClient({ url: `redis://${host}:${port}` });

      client.connect();
      client.on("ready", () => resolve(client as RedisClientType));
      client.on("error", (err) => reject(err));
    });
  }

  return {
    send: async (msg) => {
      console.log("REDIS: publishing...", { queueName });
      await (await connection).rPush(queueName, JSON.stringify(msg));
      console.log("REDIS: SENT");
    },
    consume: async (cb) => {
      console.log("REDIS: Consuming....", { queueName })
      const processMessage = async () => {
        const msg = await (await connection).blPop(queueName, 60);
        console.log("REDIS: BRPOP", {msg})
        console.log("REDIS V1")
        if (msg) {
          console.log("REDIS: Got message")
          try {
            await cb(JSON.parse(msg.element));
          } catch (e) {
            console.error("REDIS: Error during processing message", e)
          }
        }
        processMessage();
      };

      processMessage();
    }
  };
};

const sleep = (ms: number) => new Promise(cb => setTimeout(cb, ms))
