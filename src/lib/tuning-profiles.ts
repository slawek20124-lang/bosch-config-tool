/**
 * Tuning Profiles - Optimized configurations
 * Profile tuningu zoptymalizowane dla różnych zastosowań
 */

export interface TuningProfile {
  name: string;
  description: string;
  motorSettings: {
    powerCurve: string;
    maxAssist: number;
    torqueFactor: number;
  };
  smartSystemSettings: {
    aiOptimization: boolean;
    predictiveMode: boolean;
    terrainDetection: boolean;
    thermalManagement: boolean;
  };
  performanceMetrics: {
    maxSpeed: number;
    maxRange: number;
    efficiency: number;
  };
}

export class TuningProfiles {
  private profiles: Map<string, TuningProfile> = new Map();

  constructor() {
    this.initializeProfiles();
  }

  /**
   * Inicjalizuj profile tuningu
   */
  private initializeProfiles(): void {
    const ecoProfile: TuningProfile = {
      name: 'ECO',
      description: 'Maksymalna efektywność i zasięg',
      motorSettings: {
        powerCurve: 'SMOOTH',
        maxAssist: 60,
        torqueFactor: 0.8,
      },
      smartSystemSettings: {
        aiOptimization: true,
        predictiveMode: true,
        terrainDetection: true,
        thermalManagement: true,
      },
      performanceMetrics: {
        maxSpeed: 25,
        maxRange: 120,
        efficiency: 2.5,
      },
    };

    const tourProfile: TuningProfile = {
      name: 'TOUR',
      description: 'Zbalansowana wydajność i zasięg',
      motorSettings: {
        powerCurve: 'SMOOTH',
        maxAssist: 100,
        torqueFactor: 1.0,
      },
      smartSystemSettings: {
        aiOptimization: true,
        predictiveMode: true,
        terrainDetection: true,
        thermalManagement: true,
      },
      performanceMetrics: {
        maxSpeed: 25,
        maxRange: 90,
        efficiency: 1.8,
      },
    };

    const sportProfile: TuningProfile = {
      name: 'SPORT',
      description: 'Wysoka wydajność i moc',
      motorSettings: {
        powerCurve: 'AGGRESSIVE',
        maxAssist: 150,
        torqueFactor: 1.1,
      },
      smartSystemSettings: {
        aiOptimization: true,
        predictiveMode: true,
        terrainDetection: true,
        thermalManagement: true,
      },
      performanceMetrics: {
        maxSpeed: 25,
        maxRange: 60,
        efficiency: 1.2,
      },
    };

    const turboProfile: TuningProfile = {
      name: 'TURBO',
      description: 'Maksymalna moc i przyspieszenie',
      motorSettings: {
        powerCurve: 'AGGRESSIVE',
        maxAssist: 200,
        torqueFactor: 1.2,
      },
      smartSystemSettings: {
        aiOptimization: true,
        predictiveMode: true,
        terrainDetection: true,
        thermalManagement: true,
      },
      performanceMetrics: {
        maxSpeed: 25,
        maxRange: 40,
        efficiency: 0.8,
      },
    };

    this.profiles.set('ECO', ecoProfile);
    this.profiles.set('TOUR', tourProfile);
    this.profiles.set('SPORT', sportProfile);
    this.profiles.set('TURBO', turboProfile);

    console.log('✅ Wczytano 4 profile tuningu\n');
  }

  /**
   * Pobierz profil tuningu
   */
  getProfile(name: string): TuningProfile | null {
    return this.profiles.get(name.toUpperCase()) || null;
  }

  /**
   * Pokaż profil
   */
  showProfile(name: string): void {
    const profile = this.getProfile(name);
    if (!profile) {
      console.log('\n❌ Profil nie znaleziony\n');
      return;
    }

    console.log(`\n⚙️ Tuning Profile: ${profile.name}\n`);
    console.log(`Opis: ${profile.description}\n`);
    console.log('Ustawienia Motoru:');
    console.log(`   Krzywa mocy: ${profile.motorSettings.powerCurve}`);
    console.log(`   Max asystencja: ${profile.motorSettings.maxAssist}%`);
    console.log(`   Faktor momentu: ${profile.motorSettings.torqueFactor}\n`);
    console.log('Metryki wydajności:');
    console.log(`   Max prędkość: ${profile.performanceMetrics.maxSpeed} km/h`);
    console.log(`   Max zasięg: ${profile.performanceMetrics.maxRange} km`);
    console.log(`   Efektywność: ${profile.performanceMetrics.efficiency} km/Wh\n`);
  }

  /**
   * Lista wszystkich profili
   */
  listProfiles(): void {
    console.log('\n📋 Dostępne Profile Tuningu:\n');
    this.profiles.forEach((profile) => {
      console.log(`${profile.name}: ${profile.description}`);
    });
    console.log();
  }
}
