import { SerialPort } from 'serialport';

/**
 * USB Device Detection
 * Wykrywa urządzenia Bosch podłączone przez USB-C
 */

export interface DetectedDevice {
  port: string;
  manufacturer: string;
  productId: string;
  vendorId: string;
  serialNumber: string;
  isBosch: boolean;
  description: string;
}

export class USBDetector {
  // Bosch Performance Line - USB VID/PID
  private static readonly BOSCH_VENDOR_ID = '0x0590';
  private static readonly BOSCH_PRODUCT_IDS = [
    '0x0028', // Bosch Performance Line CX
    '0x0029', // Bosch Performance Line Speed
    '0x002A', // Bosch Active Line
  ];

  /**
   * Listuj wszystkie dostępne porty szeregowe
   */
  static async listAvailablePorts(): Promise<DetectedDevice[]> {
    try {
      const ports = await SerialPort.list();
      
      const detectedDevices: DetectedDevice[] = ports.map((port) => {
        const isBosch = this.isBoschDevice(port);
        
        return {
          port: port.path,
          manufacturer: port.manufacturer || 'Unknown',
          productId: port.productId || 'Unknown',
          vendorId: port.vendorId || 'Unknown',
          serialNumber: port.serialNumber || 'Unknown',
          isBosch,
          description: isBosch
            ? `✅ Bosch Performance Line - ${port.manufacturer}`
            : `❌ ${port.manufacturer || 'Unknown Device'}`,
        };
      });

      return detectedDevices;
    } catch (error) {
      console.error(`❌ Błąd podczas listy portów: ${error}`);
      return [];
    }
  }

  /**
   * Zachowaj kompatybilność z istniejącą komendą CLI
   */
  static async listAllDevices(): Promise<void> {
    await this.debugPorts();
  }

  /**
   * Znajdź urządzenie Bosch
   */
  static async findBoschDevice(): Promise<DetectedDevice | null> {
    const devices = await this.listAvailablePorts();
    const boschDevice = devices.find((d) => d.isBosch);
    
    if (boschDevice) {
      console.log(`✅ Znaleziono urządzenie Bosch: ${boschDevice.port}`);
    } else {
      console.log('❌ Nie znaleziono urządzenia Bosch');
    }
    
    return boschDevice || null;
  }

  /**
   * Sprawdź czy to urządzenie Bosch
   */
  private static isBoschDevice(port: any): boolean {
    const vendorId = port.vendorId?.toLowerCase();
    const productId = port.productId?.toLowerCase();
    const manufacturer = (port.manufacturer || '').toLowerCase();

    // Sprawdź VID/PID Bosch
    if (vendorId === this.BOSCH_VENDOR_ID.toLowerCase()) {
      return this.BOSCH_PRODUCT_IDS.some(
        (pid) => pid.toLowerCase() === productId
      );
    }

    // Sprawdź nazwę producenta
    if (manufacturer.includes('bosch')) {
      return true;
    }

    return false;
  }

  /**
   * Monitoruj zmiany portów (podłączenie/odpłączenie)
   */
  static watchPorts(
    onConnected: (device: DetectedDevice) => void,
    onDisconnected: (device: DetectedDevice) => void
  ): NodeJS.Timeout {
    let previousDevices: DetectedDevice[] = [];

    return setInterval(async () => {
      const currentDevices = await this.listAvailablePorts();

      // Nowe urządzenia
      currentDevices.forEach((device) => {
        if (!previousDevices.find((d) => d.port === device.port) && device.isBosch) {
          onConnected(device);
        }
      });

      // Odłączone urządzenia
      previousDevices.forEach((device) => {
        if (!currentDevices.find((d) => d.port === device.port) && device.isBosch) {
          onDisconnected(device);
        }
      });

      previousDevices = currentDevices;
    }, 1000); // Sprawdzaj co sekundę
  }

  /**
   * Sprawdź czy port można otworzyć
   */
  static async testConnection(devicePath: string): Promise<boolean> {
    try {
      const port = new SerialPort({
        path: devicePath,
        baudRate: 9600,
        autoOpen: false,
      });

      return await new Promise((resolve) => {
        port.open((error?: Error | null) => {
          if (error) {
            resolve(false);
            return;
          }

          port.close(() => resolve(true));
        });
      });
    } catch (error) {
      console.error(`❌ Błąd testu połączenia: ${error}`);
      return false;
    }
  }

  /**
   * Zaloguj informacje o portach (debug)
   */
  static async debugPorts(): Promise<void> {
    console.log('\n📱 === DOSTĘPNE PORTY SZEREGOWE ===\n');
    
    const ports = await SerialPort.list();
    
    if (ports.length === 0) {
      console.log('❌ Brak wykrytych portów!\n');
      return;
    }

    ports.forEach((port, index) => {
      console.log(`Port ${index + 1}:`);
      console.log(`  Ścieżka: ${port.path}`);
      console.log(`  Producent: ${port.manufacturer || 'Unknown'}`);
      console.log(`  Vendor ID: ${port.vendorId || 'Unknown'}`);
      console.log(`  Product ID: ${port.productId || 'Unknown'}`);
      console.log(`  Serial: ${port.serialNumber || 'Unknown'}`);
      
      const isBosch = this.isBoschDevice(port);
      console.log(`  Bosch: ${isBosch ? '✅ TAK' : '❌ NIE'}\n`);
    });
  }
}
