/**
 * Offline Data Storage
 * Local storage management without internet
 */

import * as fs from 'fs';
import * as path from 'path';

export interface StorageData {
  key: string;
  value: unknown;
  timestamp: Date;
  encrypted?: boolean;
}

export class OfflineStorage {
  private storageDir: string = './data';
  private configFile: string = './data/config.json';

  constructor() {
    this.initializeStorage();
  }

  /**
   * Initialize storage directory
   */
  private initializeStorage(): void {
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
      console.log('💾 Storage initialized');
    }
  }

  /**
   * Save data locally
   */
  save(key: string, value: unknown): void {
    const data: StorageData = {
      key,
      value,
      timestamp: new Date(),
    };

    const filepath = path.join(this.storageDir, `${key}.json`);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  }

  /**
   * Load data locally
   */
  load(key: string): unknown | null {
    const filepath = path.join(this.storageDir, `${key}.json`);
    
    if (!fs.existsSync(filepath)) {
      return null;
    }

    const content = fs.readFileSync(filepath, 'utf-8');
    const data: StorageData = JSON.parse(content);
    return data.value;
  }

  /**
   * Delete data
   */
  delete(key: string): void {
    const filepath = path.join(this.storageDir, `${key}.json`);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }

  /**
   * List all stored keys
   */
  listKeys(): string[] {
    if (!fs.existsSync(this.storageDir)) {
      return [];
    }
    return fs.readdirSync(this.storageDir)
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  }

  /**
   * Clear all data
   */
  clear(): void {
    const keys = this.listKeys();
    keys.forEach(key => this.delete(key));
    console.log('💾 Storage cleared');
  }
}
