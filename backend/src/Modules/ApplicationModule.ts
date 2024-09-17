import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { importAllFromRequireContext } from "src/Helpers/Utils/RequireContext";
import { CustomLogger } from "src/Helpers/Middlewares/CustomLogger";

@Module({
    imports: [
        TypeOrmModule.forFeature(importAllFromRequireContext(require.context('../Models/Entities/', true, /Entity\.ts$/))),
        JwtModule.register({}),
    ],
    providers: [
        ...importAllFromRequireContext(require.context('../Services/', true)),
        ...importAllFromRequireContext(require.context('../Daos/', true)),
        CustomLogger,
    ],
    controllers: importAllFromRequireContext(require.context('../Controllers/', true)),
    exports: [TypeOrmModule, CustomLogger],
})
export class ApplicationModule { }