import { getEnv } from 'common/utils';
import { connect, Reader, Writer } from 'nsqjs';


export const NsqQueueFactory = (queueName: string): Queue<any> => {

  const host = getEnv("QUEUE_HOST")
  const port = 4160

  console.log("NSQ", { host, port })

  const writer = new Promise<Writer>((cb, err) => {
    const writer = new Writer(host, port);
    writer.connect()

    writer.on('ready', () => {
      console.log("READY")
      cb(writer);
    });

    writer.on('error', error => {
      console.log("ERROR")
      err(error);
    });
  });

  return {
    send: async (msg) => {
      console.log("NSQ: publishing...", { queueName });
      (await writer).publish(queueName, JSON.stringify(msg));

      console.log("SENT")
    },
    consume: async cb => {
      const reader = new Reader(queueName, "main", {
        nsqdTCPAddresses: `${host}:${port}`
      });

      reader.connect();

      reader.on('message', msg => {
        cb(JSON.parse(msg.body)).finally(() => msg.finish())
      });

      reader.on('ready', msg => {
        console.log(`Can read`);
      });
    }
  };
};


