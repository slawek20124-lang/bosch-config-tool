/**
 * Offline Configuration Manager
 */

import { OfflineStorage } from './offline-storage';

export interface AppConfig {
  motorType: string;
  smartSystemEnabled: boolean;
  userPreferences: Record<string, unknown>;
  lastSync: Date;
}

const createDefaultConfig = (): AppConfig => ({
  motorType: 'PERFORMANCE_CX_GEN4',
  smartSystemEnabled: false,
  userPreferences: {},
  lastSync: new Date(),
});

export class ConfigManager {
  private storage: OfflineStorage;
  private config: AppConfig = createDefaultConfig();

  constructor() {
    this.storage = new OfflineStorage();
    this.loadConfig();
  }

  /**
   * Load configuration
   */
  private loadConfig(): void {
    const stored = this.storage.load('config');

    this.config = (stored as AppConfig) || createDefaultConfig();
  }

  /**
   * Save configuration
   */
  saveConfig(): void {
    this.config.lastSync = new Date();
    this.storage.save('config', this.config);
    console.log('💾 Configuration saved');
  }

  /**
   * Get configuration
   */
  getConfig(): AppConfig {
    return this.config;
  }

  /**
   * Update configuration
   */
  updateConfig(partial: Partial<AppConfig>): void {
    this.config = { ...this.config, ...partial };
    this.saveConfig();
  }
}
