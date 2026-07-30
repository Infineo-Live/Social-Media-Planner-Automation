import { AppConfig, appConfig } from './appConfig';
import { ValidationError } from '../services/errorFramework';

export class ConfigValidator {
  static validate(config: AppConfig): boolean {
    if (!config.appName || !config.appName.trim()) {
      throw new ValidationError('Config Error: VITE_APP_NAME is required.');
    }

    if (!config.companyName || !config.companyName.trim()) {
      throw new ValidationError('Config Error: VITE_COMPANY_NAME is required.');
    }

    if (!config.timezone || !config.timezone.trim()) {
      throw new ValidationError('Config Error: VITE_TIMEZONE is required.');
    }

    if (!Array.isArray(config.defaultSeries) || config.defaultSeries.length === 0) {
      throw new ValidationError('Config Error: At least one Series must be configured.');
    }

    return true;
  }
}

// Perform initialization check
ConfigValidator.validate(appConfig);
