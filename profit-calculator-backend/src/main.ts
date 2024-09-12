import helmet from 'helmet';
import * as BodyParser from 'body-parser';
import { AppModule } from './AppModule';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { CustomLogger } from './Helpers/Middlewares/CustomLogger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );
    app.useLogger(app.get(CustomLogger));
    app.use(helmet());

    app.use(BodyParser.json())
    app.use(BodyParser.urlencoded({ extended: true }))
    app.setGlobalPrefix('api/v1/carta-online');
    app.enableCors();

    await app.listen(configService.get<string>('PORT'));
}
bootstrap();
