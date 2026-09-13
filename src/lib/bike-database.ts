/**
 * Bike Database - Support for various bike models
 * Baza danych rowerów i ich specyfikacji
 */

export interface BikeSpecs {
  brand: string;
  model: string;
  year: number;
  type: string;
  frameSize: string;
  frameTravel: number; // mm
  weight: number; // kg
  wheelSize: number; // inches
  geometry: Record<string, number>;
  components: Record<string, string>;
  compatibility: {
    motors: string[];
    batteries: string[];
    controllers: string[];
  };
}

export interface BikeProfile {
  name: string;
  description: string;
  bikeSpecs: BikeSpecs;
  tuningProfile: string;
  smartSystemOptimized: boolean;
}

export class BikeDatabase {
  private bikes: Map<string, BikeSpecs> = new Map();
  private profiles: Map<string, BikeProfile> = new Map();

  constructor() {
    this.initializeBikes();
  }

  /**
   * Inicjalizuj bazę rowerów
   */
  private initializeBikes(): void {
    const cubeStereo140_2023: BikeSpecs = {
      brand: 'Cube',
      model: 'Stereo 140',
      year: 2023,
      type: 'Trail E-MTB',
      frameSize: 'M (43cm)',
      frameTravel: 140,
      weight: 24.5,
      wheelSize: 29,
      geometry: {
        headTubeAngle: 64.5,
        seatTubeAngle: 77.0,
        stackHeight: 615,
        reach: 457,
        wheelbase: 1187,
        bottomBracketDrop: 30,
      },
      components: {
        suspension: 'RockShox Yari RC 140mm',
        drivetrain: 'Shimano CUES 9-speed',
        brakes: 'Shimano MT201 Hydraulic Disc',
        wheels: 'Cube Reaction EXC 29" Tubeless',
        tires: 'Schwalbe Smart Sam 2.25"',
      },
      compatibility: {
        motors: ['Bosch Performance CX Gen 4', 'Bosch Performance Line Gen 3'],
        batteries: ['Bosch PowerTube 500Wh', 'Bosch PowerTube 625Wh', 'Bosch PowerTube 750Wh'],
        controllers: ['Bosch Intuvia 2', 'Bosch Nyon'],
      },
    };

    this.bikes.set('cube-stereo-140-2023', cubeStereo140_2023);
    console.log('✅ Wczytano Cube Stereo 140 2023');
  }

  /**
   * Pobierz specyfikacje roweru
   */
  getBikeSpecs(bikeId: string): BikeSpecs | null {
    return this.bikes.get(bikeId) || null;
  }

  /**
   * Pokaż info o rowerze
   */
  showBikeInfo(bikeId: string): void {
    const specs = this.getBikeSpecs(bikeId);
    if (!specs) {
      console.log('\n❌ Rower nie znaleziony\n');
      return;
    }

    console.log(`\n🚲 ${specs.brand} ${specs.model} ${specs.year}\n`);
    console.log(`Typ: ${specs.type}`);
    console.log(`Rozmiar ramy: ${specs.frameSize}`);
    console.log(`Travel: ${specs.frameTravel}mm`);
    console.log(`Waga: ${specs.weight}kg`);
    console.log(`Koła: ${specs.wheelSize}"\n`);

    console.log('⚙️ Komponenty:');
    Object.entries(specs.components).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });

    console.log('\n🔄 Kompatybilność:');
    console.log(`   Motory: ${specs.compatibility.motors.join(', ')}`);
    console.log(`   Baterie: ${specs.compatibility.batteries.join(', ')}`);
    console.log();
  }

  /**
   * Pokaż geometrię
   */
  showGeometry(bikeId: string): void {
    const specs = this.getBikeSpecs(bikeId);
    if (!specs) return;

    console.log(`\n📐 Geometria ${specs.brand} ${specs.model}\n`);
    Object.entries(specs.geometry).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
    console.log();
  }
}
