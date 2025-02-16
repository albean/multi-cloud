export type QueueFactory = <T>(queueName: string) => Queue<T>

export const queueFactory = {} as { impl: QueueFactory }
