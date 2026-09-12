/**
 * Profile Management for Bosch eBike
 * Zarządzanie profilami konfiguracji i quick-switch
 */

export interface BikeProfile {
  id: string;
  name: string;
  description: string;
  assistMode: string;
  speedLimit: number;
  motorPower: number;
  customSettings: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export class ProfileManager {
  private profiles: Map<string, BikeProfile> = new Map();
  private currentProfile: BikeProfile | null = null;

  constructor() {
    this.createDefaultProfiles();
  }

  /**
   * Utwórz profile domyślne
   */
  private createDefaultProfiles(): void {
    const defaults = [
      {
        name: 'Eco',
        description: 'Oszczędzanie baterii - długie trasy',
        assistMode: 'ECO',
        speedLimit: 30,
        motorPower: 50,
      },
      {
        name: 'City',
        description: 'Miasto - normalny tryb',
        assistMode: 'TOUR',
        speedLimit: 30,
        motorPower: 100,
      },
      {
        name: 'Sport',
        description: 'Sportowy - szybkie przejazdy',
        assistMode: 'SPORT',
        speedLimit: 45,
        motorPower: 150,
      },
      {
        name: 'Mountain',
        description: 'Górskie tereny - max moc',
        assistMode: 'TURBO',
        speedLimit: 45,
        motorPower: 200,
      },
    ];

    defaults.forEach((profile, index) => {
      this.createProfile(profile.name, profile.description, {
        assistMode: profile.assistMode,
        speedLimit: profile.speedLimit,
        motorPower: profile.motorPower,
      });
    });
  }

  /**
   * Utwórz nowy profil
   */
  createProfile(
    name: string,
    description: string = '',
    customSettings: Record<string, unknown> = {}
  ): boolean {
    const id = `PROFILE_${Date.now()}`;

    const profile: BikeProfile = {
      id,
      name,
      description,
      assistMode: (customSettings.assistMode as string) || 'TOUR',
      speedLimit: (customSettings.speedLimit as number) || 30,
      motorPower: (customSettings.motorPower as number) || 100,
      customSettings,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.profiles.set(id, profile);
    console.log(`✅ Profil utworzony: ${name}\n`);
    return true;
  }

  /**
   * Przełącz profil
   */
  switchProfile(profileName: string): boolean {
    const profile = Array.from(this.profiles.values()).find((p) => p.name === profileName);

    if (!profile) {
      console.error(`❌ Profil nie znaleziony: ${profileName}`);
      return false;
    }

    this.currentProfile = profile;
    profile.updatedAt = new Date();

    console.log(`\n⚡ Przełączono profil: ${profile.name}`);
    console.log(`   Tryb asysty: ${profile.assistMode}`);
    console.log(`   Limit prędkości: ${profile.speedLimit} km/h`);
    console.log(`   Moc silnika: ${profile.motorPower}%\n`);

    return true;
  }

  /**
   * Usuń profil
   */
  deleteProfile(profileName: string): boolean {
    const entry = Array.from(this.profiles.entries()).find((e) => e[1].name === profileName);

    if (!entry) {
      console.error(`❌ Profil nie znaleziony: ${profileName}`);
      return false;
    }

    if (this.currentProfile?.id === entry[0]) {
      console.error('❌ Nie możesz usunąć aktywnego profilu');
      return false;
    }

    this.profiles.delete(entry[0]);
    console.log(`✅ Profil usunięty: ${profileName}\n`);
    return true;
  }

  /**
   * Pokaż wszystkie profile
   */
  listProfiles(): void {
    if (this.profiles.size === 0) {
      console.log('\n❌ Brak profili\n');
      return;
    }

    console.log('\n📋 Dostępne profile:\n');

    Array.from(this.profiles.values()).forEach((profile) => {
      const isCurrent = profile.id === this.currentProfile?.id ? ' ⭐' : '';
      console.log(`${profile.name}${isCurrent}`);
      console.log(`  ${profile.description}`);
      console.log(`  Tryb: ${profile.assistMode} | Limit: ${profile.speedLimit} km/h | Moc: ${profile.motorPower}%\n`);
    });
  }

  /**
   * Pokaż obecny profil
   */
  showCurrentProfile(): void {
    if (!this.currentProfile) {
      console.log('\n❌ Brak aktywnego profilu\n');
      return;
    }

    console.log('\n⭐ Obecny profil:\n');
    console.log(`Nazwa: ${this.currentProfile.name}`);
    console.log(`Opis: ${this.currentProfile.description}`);
    console.log(`Tryb asysty: ${this.currentProfile.assistMode}`);
    console.log(`Limit prędkości: ${this.currentProfile.speedLimit} km/h`);
    console.log(`Moc silnika: ${this.currentProfile.motorPower}%\n`);
  }

  /**
   * Export profili
   */
  exportProfiles(): string {
    const profileList = Array.from(this.profiles.values());
    return JSON.stringify(
      {
        count: profileList.length,
        currentProfile: this.currentProfile?.name || null,
        profiles: profileList,
      },
      null,
      2
    );
  }

  /**
   * Import profili
   */
  importProfiles(json: string): boolean {
    try {
      const data = JSON.parse(json);

      if (data.profiles && Array.isArray(data.profiles)) {
        this.profiles.clear();
        data.profiles.forEach((p: BikeProfile) => {
          this.profiles.set(p.id, { ...p, createdAt: new Date(p.createdAt), updatedAt: new Date(p.updatedAt) });
        });

        console.log(`✅ Importowano ${data.profiles.length} profili\n`);
        return true;
      }

      return false;
    } catch (error) {
      console.error(`❌ Błąd importu: ${error}`);
      return false;
    }
  }

  /**
   * Pobierz obecny profil
   */
  getCurrentProfile(): BikeProfile | null {
    return this.currentProfile;
  }
}
