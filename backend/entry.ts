import { fixtures } from "./commands/fixtures";
import { sendmail } from "./commands/sendmail";
import { server } from "./commands/server";

const commands = {
  fixtures,
  server,
  sendmail,
};

const arg = process.argv.pop() as any;

commands[arg]();

