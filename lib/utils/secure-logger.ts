/**
 * Logger seguro para Radio Community
 * Controla logging basado en entorno y nivel
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

class SecureLogger {
  private level: LogLevel;
  private isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.level = this.isProduction ? LogLevel.ERROR : LogLevel.DEBUG;
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.level;
  }

  private sanitizeData(data: any): any {
    if (typeof data === 'string') {
      // Remover información sensible
      return data
        .replace(/password[=:]\s*[^\s&]+/gi, 'password=***')
        .replace(/token[=:]\s*[^\s&]+/gi, 'token=***')
        .replace(/secret[=:]\s*[^\s&]+/gi, 'secret=***')
        .replace(/key[=:]\s*[^\s&]+/gi, 'key=***')
        .replace(/\b\d{16,19}\b/g, '****-****-****-****') // Números de tarjeta
        .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '***-**-****'); // SSN
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...data };
      
      // Remover campos sensibles
      const sensitiveFields = [
        'password', 'token', 'secret', 'key', 'auth', 'credential',
        'email', 'telefono', 'phone', 'address', 'creditCard'
      ];
      
      for (const field of sensitiveFields) {
        if (field in sanitized) {
          sanitized[field] = '***';
        }
      }
      
      return sanitized;
    }

    return data;
  }

  error(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(`❌ [ERROR] ${message}`, data ? this.sanitizeData(data) : '');
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(`⚠️ [WARN] ${message}`, data ? this.sanitizeData(data) : '');
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(`ℹ️ [INFO] ${message}`, data ? this.sanitizeData(data) : '');
    }
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(`🔍 [DEBUG] ${message}`, data ? this.sanitizeData(data) : '');
    }
  }

  // Métodos específicos para operaciones críticas
  security(message: string, data?: any): void {
    // Logs de seguridad siempre se registran (pero sanitizados)
    console.error(`🔒 [SECURITY] ${message}`, data ? this.sanitizeData(data) : '');
  }

  payment(message: string, data?: any): void {
    if (this.isProduction) {
      // En producción, solo logear sin datos sensibles
      console.info(`💳 [PAYMENT] ${message}`);
    } else {
      console.info(`💳 [PAYMENT] ${message}`, data ? this.sanitizeData(data) : '');
    }
  }

  auth(message: string, data?: any): void {
    if (this.isProduction) {
      // En producción, solo logear sin datos sensibles
      console.info(`🔑 [AUTH] ${message}`);
    } else {
      console.info(`🔑 [AUTH] ${message}`, data ? this.sanitizeData(data) : '');
    }
  }
}

// Instancia singleton
export const logger = new SecureLogger();

// Helpers para compatibilidad con console.log existente
export const secureLog = {
  error: (message: string, data?: any) => logger.error(message, data),
  warn: (message: string, data?: any) => logger.warn(message, data),
  info: (message: string, data?: any) => logger.info(message, data),
  debug: (message: string, data?: any) => logger.debug(message, data),
  security: (message: string, data?: any) => logger.security(message, data),
  payment: (message: string, data?: any) => logger.payment(message, data),
  auth: (message: string, data?: any) => logger.auth(message, data)
};
