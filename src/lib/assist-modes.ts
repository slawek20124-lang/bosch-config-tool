/**
 * Assist Modes Manager for Bosch Performance CX
 * Zarządzanie trybami wspomagania pedałów
 */

export interface AssistMode {
  id: string;
  name: string;
  power: number; // 0-200%
  maxRange: number; // km (dodatkowo)
  description: string;
  emoji: string;
}

export interface CustomMode extends AssistMode {
  custom: true;
  createdAt: Date;
}

export class AssistModesManager {
  private static readonly DEFAULT_MODES: Record<string, AssistMode> = {
    OFF: {
      id: 'OFF',
      name: 'Off',
      power: 0,
      maxRange: 0,
      description: 'Brak wspomagania - jazda bez asysty',
      emoji: '🔇',
    },
    ECO: {
      id: 'ECO',
      name: 'Eco',
      power: 50,
      maxRange: 40,
      description: 'Oszczędny tryb - długie trasy',
      emoji: '🌱',
    },
    TOUR: {
      id: 'TOUR',
      name: 'Tour',
      power: 100,
      maxRange: 25,
      description: 'Standardowy tryb - codzienna jazda',
      emoji: '🚴',
    },
    SPORT: {
      id: 'SPORT',
      name: 'Sport',
      power: 150,
      maxRange: 15,
      description: 'Agresywny tryb - szybka jazda',
      emoji: '🏃',
    },
    TURBO: {
      id: 'TURBO',
      name: 'Turbo',
      power: 200,
      maxRange: -20,
      description: 'Maksymalna moc - krótkie trasy',
      emoji: '🚀',
    },
  };

  private currentMode: AssistMode = AssistModesManager.DEFAULT_MODES.TOUR;
  private customModes: Map<string, CustomMode> = new Map();

  /**
   * Pobierz tryb domyślny
   */
  static getDefaultMode(id: string): AssistMode | null {
    return this.DEFAULT_MODES[id] || null;
  }

  /**
   * Pobierz listę wszystkich trybów domyślnych
   */
  static listDefaultModes(): AssistMode[] {
    return Object.values(this.DEFAULT_MODES);
  }

  /**
   * Ustaw aktualny tryb
   */
  setMode(modeId: string): boolean {
    const mode = AssistModesManager.getDefaultMode(modeId) || this.customModes.get(modeId);

    if (!mode) {
      console.error(`❌ Nieznany tryb: ${modeId}`);
      return false;
    }

    this.currentMode = mode;
    console.log(`✅ Tryb zmieniony na: ${mode.emoji} ${mode.name}`);
    console.log(`   Moc: ${mode.power}%`);
    console.log(`   Zasięg: ${mode.maxRange > 0 ? '+' : ''}${mode.maxRange} km\n`);
    return true;
  }

  /**
   * Utwórz custom tryb
   */
  createCustomMode(
    name: string,
    power: number,
    description?: string
  ): boolean {
    if (power < 0 || power > 200) {
      console.error('❌ Moc musi być między 0 a 200%');
      return false;
    }

    const id = `CUSTOM_${Date.now()}`;
    const maxRange = 50 - (power / 4); // Kalkulacja zasięgu

    const customMode: CustomMode = {
      id,
      name,
      power,
      maxRange,
      description: description || `Custom tryb - ${power}% mocy`,
      emoji: '⚡',
      custom: true,
      createdAt: new Date(),
    };

    this.customModes.set(id, customMode);
    console.log(`✅ Custom tryb utworzony: ${name}`);
    console.log(`   Moc: ${power}%`);
    console.log(`   Zasięg: +${Math.round(maxRange)} km\n`);
    return true;
  }

  /**
   * Usuń custom tryb
   */
  deleteCustomMode(id: string): boolean {
    if (!this.customModes.has(id)) {
      console.error(`❌ Custom tryb nie istnieje: ${id}`);
      return false;
    }

    const mode = this.customModes.get(id);
    this.customModes.delete(id);
    console.log(`✅ Custom tryb usunięty: ${mode?.name}\n`);
    return true;
  }

  /**
   * Pokaż bieżący tryb
   */
  showCurrent(): void {
    console.log(`\n📊 Obecny tryb wspomagania:\n`);
    console.log(`${this.currentMode.emoji} ${this.currentMode.name}`);
    console.log(`Moc: ${this.currentMode.power}%`);
    console.log(`Zasięg: ${this.currentMode.maxRange > 0 ? '+' : ''}${this.currentMode.maxRange} km`);
    console.log(`Opis: ${this.currentMode.description}\n`);
  }

  /**
   * Pokaż wszystkie tryby
   */
  listAllModes(): void {
    console.log(`\n🎛️  Dostępne tryby wspomagania:\n`);

    console.log('Tryby domyślne:');
    AssistModesManager.listDefaultModes().forEach((mode) => {
      const current = mode.id === this.currentMode.id ? ' ⭐' : '';
      console.log(
        `  ${mode.emoji} ${mode.name.padEnd(10)} Moc: ${mode.power}%  Zasięg: ${mode.maxRange > 0 ? '+' : ''}${mode.maxRange} km${current}`
      );
    });

    if (this.customModes.size > 0) {
      console.log('\nCustom tryby:');
      this.customModes.forEach((mode) => {
        const current = mode.id === this.currentMode.id ? ' ⭐' : '';
        console.log(
          `  ${mode.emoji} ${mode.name.padEnd(10)} Moc: ${mode.power}%  Zasięg: +${Math.round(mode.maxRange)} km${current}`
        );
      });
    }
    console.log();
  }

  /**
   * Pobierz bieżący tryb
   */
  getCurrentMode(): AssistMode {
    return { ...this.currentMode };
  }

  /**
   * Wyeksportuj konfigurację trybów
   */
  export(): string {
    return JSON.stringify(
      {
        currentMode: this.currentMode.id,
        customModes: Array.from(this.customModes.values()),
      },
      null,
      2
    );
  }

  /**
   * Importuj konfigurację trybów
   */
  import(json: string): boolean {
    try {
      const data = JSON.parse(json);
      this.currentMode = AssistModesManager.getDefaultMode(data.currentMode) || this.currentMode;

      this.customModes.clear();
      if (data.customModes) {
        data.customModes.forEach((mode: CustomMode) => {
          this.customModes.set(mode.id, mode);
        });
      }

      console.log('✅ Konfiguracja trybów załadowana\n');
      return true;
    } catch (error) {
      console.error(`❌ Błąd importu: ${error}\n`);
      return false;
    }
  }
}
