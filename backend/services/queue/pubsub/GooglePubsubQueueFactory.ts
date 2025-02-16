import { PubSub } from '@google-cloud/pubsub';
import express, { Request, Response } from 'express';
import { getEnv } from 'common/utils';

export const GooglePubsubQueueFactory = (queueId: string): Queue<any> => {
  const pubSubClient = new PubSub();

  const topicName = getEnv(`QUEUE_${queueId.toUpperCase()}_ID`)

  return {
    send: async (msg) => {
      const dataBuffer = Buffer.from(JSON.stringify(msg));
      await pubSubClient.topic(topicName).publish(dataBuffer);
    },
    consume: async cb => {
      const app = express();

      // This middleware is available in Express v4.16.0 onwards
      app.use(express.json());

      app.post('/', (req, res) => {
        if (!req.body) {
          const msg = 'no Pub/Sub message received';
          console.error(`error: ${msg}`);
          res.status(400).send(`Bad Request: ${msg}`);
          return;
        }
        if (!req.body.message) {
          const msg = 'invalid Pub/Sub message format';
          console.error(`error: ${msg}`);
          res.status(400).send(`Bad Request: ${msg}`);
          return;
        }

        const pubSubMessage = req.body.message;

        const message = JSON.parse(Buffer.from(pubSubMessage.data, 'base64').toString().trim())

        cb(message)
          .then(() => {
            res.status(204).send();
          })
          .catch(e => {
            console.error(e);
            res.status(500).send();
          })
      });

      const PORT = parseInt(process.env.PORT ?? "0") || 8080;

      app.listen(PORT, () =>
        console.log(`Consumer ready at ${PORT}`)
      );
    }
  };
};
