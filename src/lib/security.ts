/**
 * Security & Authentication for Bosch eBike
 * Bezpieczeństwo, uwierzytelnianie i szyfrowanie konfiguracji
 */

import * as crypto from 'crypto';

export interface AuthConfig {
  pinEnabled: boolean;
  pin: string;
  deviceId: string;
  fingerprint: string;
  lastAuth: Date;
  encryptionKey: string;
}

export interface SecureConfig {
  encrypted: boolean;
  algorithm: string;
  iv: string;
  data: string;
}

export class SecurityManager {
  private authConfig: AuthConfig | null = null;
  private sessionToken: string | null = null;
  private sessionTimeout: number = 3600000; // 1 godzina

  /**
   * Inicjalizuj security
   */
  initialize(deviceId: string): void {
    console.log('\n🔐 Inicjalizacja bezpieczeństwa...\n');

    const fingerprint = this.generateFingerprint(deviceId);
    const encryptionKey = this.generateEncryptionKey();

    this.authConfig = {
      pinEnabled: false,
      pin: '',
      deviceId,
      fingerprint,
      lastAuth: new Date(),
      encryptionKey,
    };

    console.log(`✅ Device ID: ${deviceId}`);
    console.log(`✅ Fingerprint: ${fingerprint}\n`);
  }

  /**
   * Ustaw PIN
   */
  setPin(pin: string): boolean {
    if (!this.authConfig) {
      console.error('❌ Security nie zainicjalizowany');
      return false;
    }

    if (pin.length < 4 || pin.length > 8) {
      console.error('❌ PIN musi mieć 4-8 znaków');
      return false;
    }

    // Hash PIN
    const hashedPin = crypto.createHash('sha256').update(pin).digest('hex');

    this.authConfig.pin = hashedPin;
    this.authConfig.pinEnabled = true;

    console.log('✅ PIN ustawiony pomyślnie\n');
    return true;
  }

  /**
   * Uwierzytelnianie PIN
   */
  authenticatePin(pin: string): boolean {
    if (!this.authConfig || !this.authConfig.pinEnabled) {
      console.error('❌ PIN nie jest włączony');
      return false;
    }

    const hashedPin = crypto.createHash('sha256').update(pin).digest('hex');

    if (hashedPin !== this.authConfig.pin) {
      console.error('❌ Błędny PIN');
      return false;
    }

    this.sessionToken = this.generateSessionToken();
    this.authConfig.lastAuth = new Date();

    console.log('✅ Uwierzytelnienie pomyślne\n');
    return true;
  }

  /**
   * Sprawdź sesję
   */
  isAuthenticated(): boolean {
    return this.sessionToken !== null;
  }

  /**
   * Wyloguj
   */
  logout(): void {
    this.sessionToken = null;
    console.log('✅ Wylogowano\n');
  }

  /**
   * Szyfruj dane
   */
  encryptData(data: string): SecureConfig {
    if (!this.authConfig) {
      throw new Error('Security nie zainicjalizowany');
    }

    const algorithm = 'aes-256-cbc';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(this.authConfig.encryptionKey), iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
      encrypted: true,
      algorithm,
      iv: iv.toString('hex'),
      data: encrypted,
    };
  }

  /**
   * Deszyfruj dane
   */
  decryptData(secure: SecureConfig): string {
    if (!this.authConfig) {
      throw new Error('Security nie zainicjalizowany');
    }

    const decipher = crypto.createDecipheriv(
      secure.algorithm,
      Buffer.from(this.authConfig.encryptionKey),
      Buffer.from(secure.iv, 'hex')
    );

    let decrypted = decipher.update(secure.data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Wygeneruj fingerprint
   */
  private generateFingerprint(deviceId: string): string {
    return crypto.createHash('sha256').update(deviceId + Date.now()).digest('hex').substring(0, 16);
  }

  /**
   * Wygeneruj klucz szyfrowania
   */
  private generateEncryptionKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Wygeneruj token sesji
   */
  private generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Pokaż status security
   */
  showStatus(): void {
    if (!this.authConfig) {
      console.log('\n❌ Security nie zainicjalizowany\n');
      return;
    }

    console.log('\n🔐 Status bezpieczeństwa:\n');
    console.log(`Device ID: ${this.authConfig.deviceId}`);
    console.log(`Fingerprint: ${this.authConfig.fingerprint}`);
    console.log(`PIN włączony: ${this.authConfig.pinEnabled ? '✅' : '❌'}`);
    console.log(`Uwierzytelniony: ${this.isAuthenticated() ? '✅' : '❌'}`);
    console.log(`Ostatnia auth: ${this.authConfig.lastAuth.toLocaleString()}\n`);
  }
}
