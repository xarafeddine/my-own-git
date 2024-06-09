import { handleCommands } from "./handleCommands";

const args = process.argv.slice(2);

try {
  handleCommands(args);
} catch (error: any) {
  console.error(error.message);
  console.log("Enter a valid command");
}
