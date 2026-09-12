import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

/**
 * Bosch Performance Line Protocol Handler
 * Obsługuje komunikację z rowerami Bosch przez USB-C (port szeregowy)
 */

export interface BoschDevice {
  port: string;
  manufacturer: string;
  serialNumber: string;
  productId: string;
  vendorId: string;
  connected: boolean;
}

export interface BoschStatus {
  battery: number;
  motorPower: number;
  speed: number;
  distance: number;
  temperature: number;
  mode: string;
}

export class BoschProtocol {
  private port: SerialPort | null = null;
  private parser: ReadlineParser | null = null;
  private devicePath: string;

  constructor(devicePath: string) {
    this.devicePath = devicePath;
  }

  /**
   * Połącz z urządzeniem Bosch
   */
  async connect(): Promise<boolean> {
    try {
      this.port = new SerialPort({
        path: this.devicePath,
        baudRate: 9600, // Bosch Performance Line używa 9600 baud
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
      });

      this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

      return new Promise((resolve) => {
        this.port!.on('open', () => {
          console.log(`✅ Połączono z: ${this.devicePath}`);
          resolve(true);
        });

        setTimeout(() => {
          console.error('❌ Timeout połączenia');
          resolve(false);
        }, 5000);
      });
    } catch (error) {
      console.error(`❌ Błąd połączenia: ${error}`);
      return false;
    }
  }

  /**
   * Rozłącz z urządzeniem
   */
  async disconnect(): Promise<void> {
    if (this.port && this.port.isOpen) {
      return new Promise((resolve) => {
        this.port!.close(() => {
          console.log('✅ Rozłączono');
          resolve();
        });
      });
    }
  }

  /**
   * Odczytaj status urządzenia
   */
  async readStatus(): Promise<BoschStatus | null> {
    if (!this.port || !this.port.isOpen) {
      console.error('❌ Brak połączenia');
      return null;
    }

    try {
      // Wyślij komendę odczytu statusu (format zależy od protokołu)
      this.port.write('STATUS\r\n');

      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.error('❌ Timeout odczytu');
          resolve(null);
        }, 2000);

        this.parser!.on('data', (line: string) => {
          clearTimeout(timeout);
          const status = this.parseStatus(line);
          resolve(status);
        });
      });
    } catch (error) {
      console.error(`❌ Błąd odczytu: ${error}`);
      return null;
    }
  }

  /**
   * Parsuj odpowiedź statusu
   */
  private parseStatus(data: string): BoschStatus {
    // Placeholder - dostosuj do rzeczywistego formatu Bosch
    const parts = data.split(',');

    return {
      battery: parseInt(parts[0]) || 0,
      motorPower: parseInt(parts[1]) || 0,
      speed: parseInt(parts[2]) || 0,
      distance: parseInt(parts[3]) || 0,
      temperature: parseInt(parts[4]) || 0,
      mode: parts[5] || 'UNKNOWN',
    };
  }

  /**
   * Wyślij komendę do urządzenia
   */
  async sendCommand(command: string): Promise<string | null> {
    if (!this.port || !this.port.isOpen) {
      console.error('❌ Brak połączenia');
      return null;
    }

    try {
      this.port.write(`${command}\r\n`);

      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          resolve(null);
        }, 2000);

        this.parser!.once('data', (line: string) => {
          clearTimeout(timeout);
          resolve(line);
        });
      });
    } catch (error) {
      console.error(`❌ Błąd wysyłania: ${error}`);
      return null;
    }
  }

  /**
   * Sprawdź czy urządzenie odpowiada
   */
  async ping(): Promise<boolean> {
    const response = await this.sendCommand('PING');
    return response !== null;
  }
}
