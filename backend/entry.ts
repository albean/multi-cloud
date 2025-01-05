import { fixtures } from "./commands/fixtures";
import { server } from "./commands/server";

const commands = {
  fixtures,
  server,
};

const arg = process.argv.pop() as any;

commands[arg]();

