import { getEnv } from "common/utils";
import { queueFactory, QueueFactory } from "./QueueFactory";
import { NsqQueueFactory } from "./nsq/NsqQueueFactory";
import { GooglePubsubQueueFactory } from "./pubsub/GooglePubsubQueueFactory";
import { RedisQueueFactory } from "./redis/RedisQueueFactory";

export const EnvBasedQueueFactorySetup = () => {
  const queueBackend = getEnv("QUEUE_BACKEND");
  console.log("Setuping Queue", { queueBackend })
  if (queueBackend === "nsq") {
    queueFactory.impl = NsqQueueFactory;
  } else if (queueBackend === "redis") {
    queueFactory.impl = RedisQueueFactory;
  } else if (queueBackend === "pubsub") {
    queueFactory.impl = GooglePubsubQueueFactory;
  } else {
    throw new Error(`${queueBackend} backend for queue is not supported.`)
  }
};

// if (queueBackend === "gcloud/pubsub") {
//   // queueFactory.impl = NsqQueueFactory;
// }

