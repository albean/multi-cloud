import { consumers } from "stream";
import { createpdf } from "./commands/createpdf";
import { fixtures } from "./commands/fixtures";
import { sendmail } from "./commands/sendmail";
import { server } from "./commands/server";
import { consume } from "./commands/consume";

import { EnvBasedQueueFactorySetup } from "./services/queue/EnvBasedQueueFactory";
import { ContextSetup } from "./Context";

const commands = {
  fixtures,
  server,
  sendmail,
  createpdf,
  consume,
};

EnvBasedQueueFactorySetup()
ContextSetup()

const arg = process.argv.pop() as any;

commands[arg]();

