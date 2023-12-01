import { Arguments } from "./Types/CommandTypes";

export function argumentChecker(data: { checker: Arguments; argument?: Arguments }) {
  if (data.argument && data.argument !== data.checker) {
    throw new Error(`error: ${data.argument} is not a valid argument`);
  }
}
