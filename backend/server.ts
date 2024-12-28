import { fixtures } from "./commands/fixtures";

const commands = {
  fixtures
}

commands[process.argv.pop()!]()
