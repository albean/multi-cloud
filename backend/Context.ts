import { OrderMail } from './model/OrderMail';
import { queueFactory } from './services/queue/QueueFactory';

export interface Context {
  renderQueue: Queue<OrderMail>;
}

export const ContextSetup = () => {
  const newCtx: Context = {
    renderQueue: queueFactory.impl("render"),
  }

  Object.assign(ctx, newCtx);
}

export const ctx: Context = { } as any

