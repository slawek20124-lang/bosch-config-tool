import { SerialPort } from 'serialport';

/**
 * USB Device Detection for Bosch eBike
 * Detekcja urządzeń USB-C podłączonych do komputera
 */

export interface DetectedDevice {
  port: string;
  manufacturer: string;
  serialNumber: string;
  productId: string;
  vendorId: string;
  isBosch: boolean;
}

export class USBDetector {
  // Bosch Performance Line USB identifiers
  private static readonly BOSCH_VENDORS = ['0x00E0', '0x0E0E']; // Bosch vendor IDs
  private static readonly BOSCH_PRODUCTS = ['0x0001', '0x0002', '0x0003']; // Example product IDs

  /**
   * Skanuj wszystkie dostępne porty seryjne
   */
  static async scanPorts(): Promise<DetectedDevice[]> {
    try {
      const ports = await SerialPort.list();
      const devices: DetectedDevice[] = [];

      for (const port of ports) {
        const device: DetectedDevice = {
          port: port.path,
          manufacturer: port.manufacturer || 'Unknown',
          serialNumber: port.serialNumber || 'N/A',
          productId: port.productId || 'N/A',
          vendorId: port.vendorId || 'N/A',
          isBosch: this.isBoschDevice(port),
        };
        devices.push(device);
      }

      return devices;
    } catch (error) {
      console.error(`❌ Błąd skanowania portów: ${error}`);
      return [];
    }
  }

  /**
   * Sprawdź czy urządzenie to Bosch
   */
  private static isBoschDevice(port: any): boolean {
    const vendorId = port.vendorId?.toLowerCase();
    const productId = port.productId?.toLowerCase();
    const manufacturer = port.manufacturer?.toLowerCase() || '';

    return (
      manufacturer.includes('bosch') ||
      this.BOSCH_VENDORS.some(vid => vendorId?.includes(vid.toLowerCase())) ||
      this.BOSCH_PRODUCTS.some(pid => productId?.includes(pid.toLowerCase()))
    );
  }

  /**
   * Znajdź Bosch Performance Line
   */
  static async findBoschDevice(): Promise<DetectedDevice | null> {
    const devices = await this.scanPorts();
    const boschDevice = devices.find(d => d.isBosch);

    if (boschDevice) {
      console.log(`✅ Znaleziono urządzenie Bosch:`);
      console.log(`   Port: ${boschDevice.port}`);
      console.log(`   Producent: ${boschDevice.manufacturer}`);
      console.log(`   Numer seryjny: ${boschDevice.serialNumber}`);
      return boschDevice;
    } else {
      console.log('❌ Brak urządzenia Bosch');
      return null;
    }
  }

  /**
   * Wyświetl wszystkie dostępne urządzenia
   */
  static async listAllDevices(): Promise<void> {
    const devices = await this.scanPorts();

    if (devices.length === 0) {
      console.log('❌ Brak dostępnych urządzeń USB');
      return;
    }

    console.log('\n📱 Dostępne urządzenia USB:\n');
    devices.forEach((device, index) => {
      const boschLabel = device.isBosch ? '✅ [BOSCH]' : '   ';
      console.log(`${index + 1}. ${boschLabel} ${device.port}`);
      console.log(`   Producent: ${device.manufacturer}`);
      console.log(`   Seria: ${device.serialNumber}`);
      console.log(`   Vendor ID: ${device.vendorId}`);
      console.log(`   Product ID: ${device.productId}`);
      console.log();
    });
  }

  /**
   * Testuj połączenie z portem
   */
  static async testConnection(portPath: string): Promise<boolean> {
    try {
      const port = new SerialPort({
        path: portPath,
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
      });

      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          port.close();
          resolve(false);
        }, 3000);

        port.on('open', () => {
          clearTimeout(timeout);
          console.log(`✅ Połączenie z ${portPath} udane!`);
          port.close();
          resolve(true);
        });

        port.on('error', (error) => {
          clearTimeout(timeout);
          console.error(`❌ Błąd połączenia: ${error.message}`);
          resolve(false);
        });
      });
    } catch (error) {
      console.error(`❌ Błąd: ${error}`);
      return false;
    }
  }
}
