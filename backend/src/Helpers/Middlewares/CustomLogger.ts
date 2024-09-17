import { Injectable, LoggerService } from '@nestjs/common';
import * as logger from 'better-console-log-plus';

@Injectable()
export class CustomLogger implements LoggerService {
    
    log(message: any, context?: string) {
        logger.log(message, context || '');
    }

    error(message: any, trace?: string, context?: string) {
        logger.error(message, trace || '', context || '');
    }

    warn(message: any, context?: string) {
        logger.warn(message, context || '');
    }

    debug?(message: any, context?: string) {
        logger.debug(message, context || '');
    }
}