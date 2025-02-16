import { connect, Reader, Writer } from 'nsqjs';


export const NsqQueueFactory = (queueName: string): Queue<any> => {
  const writer = new Promise<Writer>((cb, err) => {
    const writer = new Writer('127.0.0.1', 4150);
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
      (await writer).publish(queueName, JSON.stringify(msg));

      console.log("SENT")
    },
    consume: async cb => {
      const reader = new Reader(queueName, "main", {
        nsqdTCPAddresses: '127.0.0.1:4150'
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
