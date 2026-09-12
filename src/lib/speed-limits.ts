/**
 * Speed Limits Manager for Bosch Performance Line
 * Zarządzanie limitami prędkości dla różnych regionów
 */

export interface RegionConfig {
  code: string;
  name: string;
  defaultLimit: number;
  maxLimit: number;
  unlimitedSupported: boolean;
}

export interface SpeedConfig {
  region: string;
  currentLimit: number;
  unlimited: boolean;
  customLimit: number | null;
}

export class SpeedLimitsManager {
  private static readonly REGIONS: Record<string, RegionConfig> = {
    DE: {
      code: 'DE',
      name: '🇩🇪 Germany',
      defaultLimit: 25,
      maxLimit: 45, // S-Pedelec
      unlimitedSupported: true,
    },
    GB: {
      code: 'GB',
      name: '🇬🇧 UK',
      defaultLimit: 25,
      maxLimit: 25,
      unlimitedSupported: true,
    },
    FR: {
      code: 'FR',
      name: '🇫🇷 France',
      defaultLimit: 25,
      maxLimit: 25,
      unlimitedSupported: true,
    },
    ES: {
      code: 'ES',
      name: '🇪🇸 Spain',
      defaultLimit: 25,
      maxLimit: 25,
      unlimitedSupported: true,
    },
    IT: {
      code: 'IT',
      name: '🇮🇹 Italy',
      defaultLimit: 25,
      maxLimit: 25,
      unlimitedSupported: true,
    },
    PL: {
      code: 'PL',
      name: '🇵🇱 Poland',
      defaultLimit: 25,
      maxLimit: 25,
      unlimitedSupported: true,
    },
    NL: {
      code: 'NL',
      name: '🇳🇱 Netherlands',
      defaultLimit: 25,
      maxLimit: 25,
      unlimitedSupported: true,
    },
    SE: {
      code: 'SE',
      name: '🇸🇪 Sweden',
      defaultLimit: 25,
      maxLimit: 25,
      unlimitedSupported: true,
    },
    CH: {
      code: 'CH',
      name: '🇨🇭 Switzerland',
      defaultLimit: 25,
      maxLimit: 25,
      unlimitedSupported: true,
    },
    AT: {
      code: 'AT',
      name: '🇦🇹 Austria',
      defaultLimit: 25,
      maxLimit: 25,
      unlimitedSupported: true,
    },
  };

  private currentConfig: SpeedConfig = {
    region: 'DE',
    currentLimit: 25,
    unlimited: false,
    customLimit: null,
  };

  /**
   * Pobierz konfigurację regionu
   */
  static getRegion(code: string): RegionConfig | null {
    return this.REGIONS[code] || null;
  }

  /**
   * Pobierz listę wszystkich regionów
   */
  static listRegions(): RegionConfig[] {
    return Object.values(this.REGIONS);
  }

  /**
   * Ustaw region
   */
  setRegion(code: string): boolean {
    const region = SpeedLimitsManager.getRegion(code);
    if (!region) {
      console.error(`❌ Nieznany region: ${code}`);
      return false;
    }

    this.currentConfig.region = code;
    this.currentConfig.currentLimit = region.defaultLimit;
    this.currentConfig.unlimited = false;
    this.currentConfig.customLimit = null;

    console.log(`✅ Region zmieniony na: ${region.name}`);
    console.log(`   Domyślny limit: ${region.defaultLimit} km/h`);
    return true;
  }

  /**
   * Aktywuj tryb bez limitu
   */
  enableUnlimited(): boolean {
    const region = SpeedLimitsManager.getRegion(this.currentConfig.region);

    if (!region || !region.unlimitedSupported) {
      console.error('❌ Tryb bez limitu nie jest dostępny dla tego regionu');
      return false;
    }

    this.currentConfig.unlimited = true;
    this.currentConfig.currentLimit = 999; // Virtually unlimited
    this.currentConfig.customLimit = null;

    console.log('🚀 Tryb bez limitu aktywowany!');
    console.log('   Maksymalna prędkość: ∞ km/h');
    console.log('\n⚠️  OSTRZEŻENIE: Funkcja bez limitu może być nielegalna w Twoim kraju!');
    return true;
  }

  /**
   * Wyłącz tryb bez limitu
   */
  disableUnlimited(): boolean {
    const region = SpeedLimitsManager.getRegion(this.currentConfig.region);

    if (!region) {
      return false;
    }

    this.currentConfig.unlimited = false;
    this.currentConfig.currentLimit = region.defaultLimit;
    this.currentConfig.customLimit = null;

    console.log(`✅ Tryb bez limitu wyłączony`);
    console.log(`   Przywrócono domyślny limit: ${region.defaultLimit} km/h`);
    return true;
  }

  /**
   * Ustaw custom limit
   */
  setCustomLimit(limit: number): boolean {
    const region = SpeedLimitsManager.getRegion(this.currentConfig.region);

    if (!region) {
      return false;
    }

    if (limit < 10 || limit > 200) {
      console.error('❌ Limit musi być między 10 a 200 km/h');
      return false;
    }

    if (limit > region.maxLimit) {
      console.warn(
        `⚠️  Limit ${limit} km/h przekracza maksimum dla regionu (${region.maxLimit} km/h)`
      );
    }

    this.currentConfig.unlimited = false;
    this.currentConfig.currentLimit = limit;
    this.currentConfig.customLimit = limit;

    console.log(`✅ Custom limit ustawiony na: ${limit} km/h`);
    return true;
  }

  /**
   * Pokaż obecną konfigurację
   */
  showCurrent(): void {
    const region = SpeedLimitsManager.getRegion(this.currentConfig.region);

    console.log('\n📊 Obecna konfiguracja prędkości:\n');
    console.log(`Region: ${region?.name}`);
    console.log(`Status: ${this.currentConfig.unlimited ? '🚀 BEZ LIMITU' : '🔒 Z LIMITEM'}`);

    if (this.currentConfig.unlimited) {
      console.log(`Maksymalna prędkość: ∞ km/h`);
    } else if (this.currentConfig.customLimit) {
      console.log(`Custom limit: ${this.currentConfig.customLimit} km/h`);
    } else {
      console.log(`Limit: ${this.currentConfig.currentLimit} km/h (domyślny)`);
    }

    if (region) {
      console.log(`Maksimum dla regionu: ${region.maxLimit} km/h`);
    }
    console.log();
  }

  /**
   * Pobierz obecną konfigurację
   */
  getConfig(): SpeedConfig {
    return { ...this.currentConfig };
  }

  /**
   * Wyeksportuj konfigurację do JSON
   */
  export(): string {
    return JSON.stringify(this.currentConfig, null, 2);
  }

  /**
   * Importuj konfigurację z JSON
   */
  import(json: string): boolean {
    try {
      const config = JSON.parse(json);
      const region = SpeedLimitsManager.getRegion(config.region);

      if (!region) {
        console.error('❌ Nieznany region w konfiguracji');
        return false;
      }

      this.currentConfig = config;
      console.log('✅ Konfiguracja załadowana');
      return true;
    } catch (error) {
      console.error(`❌ Błąd importu: ${error}`);
      return false;
    }
  }
}
