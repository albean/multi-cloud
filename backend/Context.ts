import { OrderMail } from './model/OrderMail';
import { queueFactory } from './services/queue/QueueFactory';

export interface Context {
  mailQueue: Queue<OrderMail>;
}

export const ContextSetup = () => {
  const newCtx: Context = {

    mailQueue: queueFactory.impl("mail"),
  }

  Object.assign(ctx, newCtx);
}

export const ctx: Context = { } as any

