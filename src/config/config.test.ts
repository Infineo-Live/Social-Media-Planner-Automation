import { describe, it, expect } from 'vitest';
import { ConfigValidator } from './configValidator';
import { appConfig, AppConfig } from './appConfig';
import { ValidationError } from '../services/errorFramework';

describe('Phase 9 Configuration Audit & Validation', () => {
  it('validates production configuration successfully', () => {
    expect(ConfigValidator.validate(appConfig)).toBe(true);
  });

  it('rejects invalid configuration missing appName', () => {
    const invalidConfig: AppConfig = {
      ...appConfig,
      appName: '',
    };
    expect(() => ConfigValidator.validate(invalidConfig)).toThrow(ValidationError);
  });

  it('rejects configuration with empty series list', () => {
    const invalidConfig: AppConfig = {
      ...appConfig,
      defaultSeries: [],
    };
    expect(() => ConfigValidator.validate(invalidConfig)).toThrow(ValidationError);
  });
});
