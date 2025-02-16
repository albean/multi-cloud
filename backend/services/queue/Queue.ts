interface Queue<Message> {
  send(message: Message): Promise<any>;
  consume(callback: (msg: Message) => Promise<any>): Promise<any>;
}
