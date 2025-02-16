import { getEnv } from "common/utils";
import { queueFactory, QueueFactory } from "./QueueFactory";
import { NsqQueueFactory } from "./nsq/NsqQueueFactory";
import { GooglePubsubQueueFactory } from "./pubsub/GooglePubsubQueueFactory";

export const EnvBasedQueueFactorySetup = () => {
  console.log("Setupping....")
  const queueBackend = getEnv("QUEUE_BACKEND");
  if (queueBackend === "nsq") {
    queueFactory.impl = NsqQueueFactory;
  } else if (queueBackend === "pubsub") {
    queueFactory.impl = GooglePubsubQueueFactory;
  } else {
    throw new Error(`${queueBackend} backend for queue is not supported.`)
  }
};

// if (queueBackend === "gcloud/pubsub") {
//   // queueFactory.impl = NsqQueueFactory;
// }

