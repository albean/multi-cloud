import { consumers } from "stream";
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
  consume,
};

EnvBasedQueueFactorySetup()
ContextSetup()

const args = [...process.argv];
args.shift(); // node
args.shift(); // script name
const arg = args.shift()!;

commands[arg](args[0]);

