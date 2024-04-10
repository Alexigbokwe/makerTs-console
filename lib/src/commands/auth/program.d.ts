import { ORM } from "../../Types/CommandTypes";
declare class AuthProgram {
    static handle(orm: ORM): Promise<void>;
    private static handleError;
    private static generateAuthMiddleware;
    private static authMiddleware;
    private static generateAuthControllers;
    private static loginController;
    private static registerController;
    private static generateAuthValidations;
    private static loginValidation;
    private static registrationValidation;
    private static createAuthRoute;
    private static appendRoute;
    private static routeBody;
    private static createModel;
    private static nextStep;
    private static MongoDBModelBody;
    private static TypeORMModelBody;
    private static ObjectionModelBody;
}
export default AuthProgram;
//# sourceMappingURL=program.d.ts.map