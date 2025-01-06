import { createpdf } from "./commands/createpdf";
import { fixtures } from "./commands/fixtures";
import { sendmail } from "./commands/sendmail";
import { server } from "./commands/server";

const commands = {
  fixtures,
  server,
  sendmail,
  createpdf,
};

const arg = process.argv.pop() as any;

commands[arg]();

