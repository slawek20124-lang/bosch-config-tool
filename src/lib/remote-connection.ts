/**
 * Remote Connection for Bosch eBike
 * Zdalne połączenie i zarządzanie e-bikiem
 */

export interface RemoteDevice {
  id: string;
  name: string;
  ipAddress: string;
  port: number;
  lastSeen: Date;
  isOnline: boolean;
}

export interface RemoteSession {
  sessionId: string;
  deviceId: string;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
}

export class RemoteConnection {
  private remoteDevices: Map<string, RemoteDevice> = new Map();
  private activeSessions: Map<string, RemoteSession> = new Map();
  private localIP: string = '';
  private webServerPort: number = 8080;
  private isWebServerRunning: boolean = false;

  /**
   * Skanuj lokalne e-bike'i
   */
  async scanLocalDevices(): Promise<RemoteDevice[]> {
    console.log('\n🔍 Skanowanie lokalnych e-bike\'ów...\n');

    // Mockowe urządzenia
    const mockDevices: RemoteDevice[] = [
      {
        id: 'ebike-001',
        name: 'Bosch CX - Kuchnia',
        ipAddress: '192.168.1.100',
        port: 8080,
        lastSeen: new Date(),
        isOnline: true,
      },
      {
        id: 'ebike-002',
        name: 'Bosch Line - Garaż',
        ipAddress: '192.168.1.101',
        port: 8080,
        lastSeen: new Date(Date.now() - 5 * 60000),
        isOnline: false,
      },
    ];

    mockDevices.forEach((device) => {
      this.remoteDevices.set(device.id, device);
    });

    console.log(`✅ Znaleziono ${mockDevices.length} urządzenie(nia):\n`);

    mockDevices.forEach((device) => {
      const status = device.isOnline ? '🟢 Online' : '🔴 Offline';
      console.log(`${device.name}`);
      console.log(`  IP: ${device.ipAddress}:${device.port}`);
      console.log(`  Status: ${status}\n`);
    });

    return mockDevices;
  }

  /**
   * Połącz z e-bikiem
   */
  async connectToDevice(deviceId: string): Promise<boolean> {
    const device = this.remoteDevices.get(deviceId);

    if (!device) {
      console.error('❌ Urządzenie nie znalezione');
      return false;
    }

    if (!device.isOnline) {
      console.error('❌ Urządzenie jest offline');
      return false;
    }

    console.log(`\n🔗 Łączenie z ${device.name}...\n`);

    // Symulacja połączenia
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const session: RemoteSession = {
      sessionId: `SESSION_${Date.now()}`,
      deviceId,
      startTime: new Date(),
      isActive: true,
    };

    this.activeSessions.set(session.sessionId, session);

    console.log(`✅ Połączono z ${device.name}`);
    console.log(`   Sesja: ${session.sessionId}\n`);

    return true;
  }

  /**
   * Rozłącz
   */
  async disconnect(sessionId: string): Promise<boolean> {
    const session = this.activeSessions.get(sessionId);

    if (!session) {
      console.error('❌ Sesja nie znaleziona');
      return false;
    }

    session.isActive = false;
    session.endTime = new Date();

    console.log(`\n✅ Rozłączono (sesja trwała: ${this.getSessionDuration(session)})\n`);

    return true;
  }

  /**
   * Pobierz czas trwania sesji
   */
  private getSessionDuration(session: RemoteSession): string {
    const end = session.endTime || new Date();
    const duration = Math.floor((end.getTime() - session.startTime.getTime()) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s`;
  }

  /**
   * Uruchom web server
   */
  startWebServer(port: number = 8080): void {
    if (this.isWebServerRunning) {
      console.log('⚠️  Web server już uruchomiony');
      return;
    }

    this.webServerPort = port;
    this.isWebServerRunning = true;

    console.log(`\n🌐 Uruchamianie Web Servera...\n`);
    console.log(`✅ Server uruchomiony na porcie ${port}`);
    console.log(`   URL: http://localhost:${port}`);
    console.log(`   API: http://localhost:${port}/api\n`);
  }

  /**
   * Zatrzymaj web server
   */
  stopWebServer(): void {
    if (!this.isWebServerRunning) {
      console.log('⚠️  Web server nie jest uruchomiony');
      return;
    }

    this.isWebServerRunning = false;
    console.log(`\n✅ Web server zatrzymany\n`);
  }

  /**
   * Pokaż lokalne IP
   */
  showLocalIP(): void {
    // Pobierz lokalne IP (w rzeczywistości należałoby użyć biblioteki)
    const mockIP = '192.168.1.50';

    console.log(`\n🌐 Lokalne IP:\n`);
    console.log(`IP Address: ${mockIP}`);
    console.log(`Web Server: ${this.isWebServerRunning ? '🟢 Uruchomiony' : '🔴 Wyłączony'}`);
    console.log(`Port: ${this.webServerPort}\n`);
  }

  /**
   * Pokaż aktywne sesje
   */
  showActiveSessions(): void {
    const active = Array.from(this.activeSessions.values()).filter((s) => s.isActive);

    if (active.length === 0) {
      console.log('\n❌ Brak aktywnych sesji\n');
      return;
    }

    console.log(`\n📊 Aktywne sesje (${active.length}):\n`);

    active.forEach((session) => {
      const device = this.remoteDevices.get(session.deviceId);
      console.log(`${device?.name || 'Unknown'}`);
      console.log(`  Sesja: ${session.sessionId}`);
      console.log(`  Czas: ${this.getSessionDuration(session)}\n`);
    });
  }

  /**
   * Wyślij komendę do urządzenia
   */
  async sendCommand(sessionId: string, command: string, params?: Record<string, unknown>): Promise<boolean> {
    const session = this.activeSessions.get(sessionId);

    if (!session || !session.isActive) {
      console.error('❌ Sesja nie jest aktywna');
      return false;
    }

    console.log(`📤 Wysyłanie komendy: ${command}`);

    // Symulacja wysyłania
    await new Promise((resolve) => setTimeout(resolve, 300));

    console.log(`✅ Komenda wykonana\n`);
    return true;
  }
}
