import { OrderMail } from './model/OrderMail';
import { SendMail } from './model/SendMail';
import { queueFactory } from './services/queue/QueueFactory';

export interface Context {
  mailQueue: Queue<SendMail>;
  renderQueue: Queue<OrderMail>;
}

export const ContextSetup = () => {
  const newCtx: Context = {
    mailQueue: queueFactory.impl("mail"),
    renderQueue: queueFactory.impl("render"),
  }

  Object.assign(ctx, newCtx);
}

export const ctx: Context = { } as any

