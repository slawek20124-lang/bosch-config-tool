/**
 * System Integration - Bike + Motor + Smart System
 * Integracja wszystkich komponentów w jeden system
 */

import { BikeDatabase } from './bike-database';
import { TuningProfiles } from './tuning-profiles';
import { SmartSystemCore } from './smart-system-core';

export interface BikeSystemConfig {
  bikeModel: string;
  motorType: string;
  batteryCapacity: number;
  tuningProfile: string;
  smartSystemEnabled: boolean;
}

export class SystemIntegration {
  private bikeDb: BikeDatabase;
  private tuningProfiles: TuningProfiles;
  private smartSystem: SmartSystemCore;
  private config: BikeSystemConfig | null = null;

  constructor() {
    this.bikeDb = new BikeDatabase();
    this.tuningProfiles = new TuningProfiles();
    this.smartSystem = new SmartSystemCore();
  }

  /**
   * Skonfiguruj cały system
   */
  configureSystem(config: BikeSystemConfig): void {
    this.config = config;
    console.log('\n🔧 Konfigurowanie systemu...\n');
    console.log(`🚲 Rower: ${config.bikeModel}`);
    console.log(`⚙️ Motor: ${config.motorType}`);
    console.log(`🔋 Bateria: ${config.batteryCapacity}Wh`);
    console.log(`📊 Profil: ${config.tuningProfile}`);
    console.log(`🧠 Smart System: ${config.smartSystemEnabled ? '✅ ENABLED' : '❌ DISABLED'}\n`);
  }

  /**
   * Pokaż pełny status systemu
   */
  showSystemStatus(): void {
    if (!this.config) {
      console.log('\n❌ System nie skonfigurowany\n');
      return;
    }

    console.log('\n🔧 System Status:\n');
    this.bikeDb.showBikeInfo(this.config.bikeModel);
    this.tuningProfiles.showProfile(this.config.tuningProfile);
  }

  /**
   * Exportuj konfigurację
   */
  exportConfig(): string {
    if (!this.config) {
      return '{}';
    }
    return JSON.stringify(this.config, null, 2);
  }

  /**
   * Pobierz konfigurację
   */
  getConfig(): BikeSystemConfig | null {
    return this.config;
  }
}
