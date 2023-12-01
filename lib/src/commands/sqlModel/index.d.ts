import { Command } from "commander";
import { ORM } from "../../Types/CommandTypes";
declare class SqlCommand {
    static handle(program: Command, orm: ORM): Promise<void>;
}
export default SqlCommand;
//# sourceMappingURL=index.d.ts.map