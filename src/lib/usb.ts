/**
 * USB Device Manager for reading/writing configuration files
 */
import fs from 'fs';
import path from 'path';

export class USBManager {
  private devicePath: string;

  constructor(devicePath: string) {
    this.devicePath = devicePath;
  }

  /**
   * Check if device is connected and accessible
   */
  isConnected(): boolean {
    try {
      return fs.existsSync(this.devicePath);
    } catch {
      return false;
    }
  }

  /**
   * Read configuration file from device
   */
  readConfig(filename: string = 'config.bin'): Buffer {
    const configPath = path.join(this.devicePath, filename);
    if (!fs.existsSync(configPath)) {
      throw new Error(`Configuration file not found: ${configPath}`);
    }
    return fs.readFileSync(configPath);
  }

  /**
   * Write configuration file to device
   */
  writeConfig(buffer: Buffer, filename: string = 'config.bin'): void {
    const configPath = path.join(this.devicePath, filename);
    fs.writeFileSync(configPath, buffer);
  }

  /**
   * List all files on device
   */
  listFiles(): string[] {
    try {
      return fs.readdirSync(this.devicePath);
    } catch {
      return [];
    }
  }
}
