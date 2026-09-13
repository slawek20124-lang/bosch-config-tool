/**
 * Motor Generation Handler for Bosch eBike
 * Obsługa różnych generacji silników Bosch
 */

export type MotorGenerationType =
  | 'PERFORMANCE_LINE_GEN1'
  | 'PERFORMANCE_LINE_GEN2'
  | 'PERFORMANCE_LINE_GEN3'
  | 'PERFORMANCE_CX_GEN1'
  | 'PERFORMANCE_CX_GEN2'
  | 'PERFORMANCE_CX_GEN3'
  | 'PERFORMANCE_CX_GEN4'
  | 'ACTIVE_LINE_GEN1'
  | 'ACTIVE_LINE_GEN2'
  | 'ACTIVE_LINE_PLUS_GEN1'
  | 'ACTIVE_LINE_PLUS_GEN2'
  | 'CARGO_GEN1'
  | 'CARGO_GEN2';

export interface MotorSpecs {
  type: MotorGenerationType;
  name: string;
  maxPower: number;
  maxTorque: number;
  maxSpeed: number;
  weight: number;
  efficiency: number;
  coolingType: string;
  features: string[];
  firmwareVersion: string;
  releaseYear: number;
}

export interface MotorTuning {
  powerCurve: 'SMOOTH' | 'AGGRESSIVE' | 'CUSTOM';
  torqueFactor: number;
  speedLimit: number;
  temperatureLimit: number;
  assistModes: Record<string, number>;
}

export class MotorGeneration {
  private motorSpecs: Map<MotorGenerationType, MotorSpecs> = new Map();
  private currentMotor: MotorSpecs | null = null;
  private tuningConfig: MotorTuning | null = null;

  constructor() {
    this.initializeMotors();
  }

  private initializeMotors(): void {
    const motors: MotorSpecs[] = [
      {
        type: 'PERFORMANCE_CX_GEN4',
        name: 'Bosch Performance CX Gen 4 ⭐',
        maxPower: 250,
        maxTorque: 90,
        maxSpeed: 25,
        weight: 2.7,
        efficiency: 95,
        coolingType: 'Advanced active cooling',
        features: ['AI-Powered', 'Thermal sensor', 'OTA Updates'],
        firmwareVersion: '4.x',
        releaseYear: 2022,
      },
    ];

    motors.forEach((motor) => {
      this.motorSpecs.set(motor.type, motor);
    });
  }

  detectMotor(deviceInfo: Record<string, unknown>): MotorGenerationType {
    return 'PERFORMANCE_CX_GEN4';
  }

  setMotor(motorType: MotorGenerationType): boolean {
    const specs = this.motorSpecs.get(motorType);
    if (!specs) return false;
    this.currentMotor = specs;
    this.initializeTuning();
    return true;
  }

  private initializeTuning(): void {
    if (!this.currentMotor) return;
    this.tuningConfig = {
      powerCurve: 'SMOOTH',
      torqueFactor: 1.0,
      speedLimit: this.currentMotor.maxSpeed,
      temperatureLimit: 60,
      assistModes: {
        OFF: 0,
        ECO: 50,
        TOUR: 100,
        SPORT: 150,
        TURBO: 200,
      },
    };
  }

  showMotorInfo(): void {
    if (!this.currentMotor) {
      console.log('\n❌ Silnik nie ustawiony\n');
      return;
    }
    console.log(`\n⚙️  ${this.currentMotor.name}\n`);
  }

  getCurrentMotor(): MotorSpecs | null {
    return this.currentMotor;
  }

  getTuningConfig(): MotorTuning | null {
    return this.tuningConfig;
  }
}
