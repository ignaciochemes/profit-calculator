import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { envFilePathConfiguration } from "./Configs/EnvFilePathConfig";
import { nestEnvConfiguration } from "./Configs/NestEnvConfig";
import { DBConfigInterface } from "./Configs/DbConfigInterface";
import { APP_FILTER } from "@nestjs/core";
import { QueryFailedErrorFilter } from "./Helpers/Middlewares/QueryFailedErrorFilter";
import { PerformanceMiddleware } from "./Helpers/Middlewares/PerformanceMiddleware";
import { ApplicationModule } from "./Modules/ApplicationModule";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [envFilePathConfiguration()],
            load: [nestEnvConfiguration],
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => Object.assign(configService.get<DBConfigInterface>('DATABASE')),
        }),
        ApplicationModule,
    ],
    providers: [{ provide: APP_FILTER, useClass: QueryFailedErrorFilter }],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(PerformanceMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}