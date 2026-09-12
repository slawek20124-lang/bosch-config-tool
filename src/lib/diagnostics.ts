/**
 * Diagnostics & Logging for Bosch eBike
 * Diagnostyka, logowanie i raportowanie błędów
 */

export interface LogEntry {
  timestamp: Date;
  level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';
  category: string;
  message: string;
  data?: unknown;
}

export interface DiagnosticReport {
  timestamp: Date;
  systemHealth: number; // 0-100%
  connectionStatus: string;
  batteryHealth: number; // 0-100%
  motorStatus: string;
  firmwareVersion: string;
  errors: LogEntry[];
  warnings: LogEntry[];
}

export class Diagnostics {
  private logs: LogEntry[] = [];
  private maxLogs: number = 10000;
  private categories = ['CONNECTION', 'BATTERY', 'MOTOR', 'FIRMWARE', 'CONFIG', 'SYSTEM'];

  /**
   * Zaloguj wiadomość
   */
  log(level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR', category: string, message: string, data?: unknown): void {
    if (!this.categories.includes(category)) {
      category = 'SYSTEM';
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      category,
      message,
      data,
    };

    this.logs.push(entry);

    // Ogranicz rozmiar logów
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Wypisz do konsoli
    const icon = this.getIcon(level);
    console.log(`${icon} [${category}] ${message}`);
  }

  /**
   * Pobierz ikonę poziomu
   */
  private getIcon(level: string): string {
    switch (level) {
      case 'DEBUG':
        return '🔍';
      case 'INFO':
        return 'ℹ️';
      case 'WARNING':
        return '⚠️';
      case 'ERROR':
        return '❌';
      default:
        return '📝';
    }
  }

  /**
   * Pokaż logi
   */
  showLogs(filter?: { level?: string; category?: string; limit?: number }): void {
    let filtered = [...this.logs];

    if (filter?.level) {
      filtered = filtered.filter((log) => log.level === filter.level);
    }

    if (filter?.category) {
      filtered = filtered.filter((log) => log.category === filter.category);
    }

    const limit = filter?.limit || 20;
    const recent = filtered.slice(-limit);

    console.log(`\n📜 Logi (${recent.length}/${this.logs.length}):\n`);

    recent.forEach((log) => {
      const icon = this.getIcon(log.level);
      const time = log.timestamp.toLocaleTimeString();
      console.log(`${icon} [${time}] [${log.category}] ${log.message}`);
    });

    console.log();
  }

  /**
   * Pokaż błędy
   */
  showErrors(): void {
    const errors = this.logs.filter((log) => log.level === 'ERROR');

    if (errors.length === 0) {
      console.log('\n✅ Brak błędów\n');
      return;
    }

    console.log(`\n❌ Błędy (${errors.length}):\n`);

    errors.slice(-10).forEach((error) => {
      const time = error.timestamp.toLocaleTimeString();
      console.log(`[${time}] ${error.category}: ${error.message}`);
    });

    console.log();
  }

  /**
   * Generuj raport diagnostyczny
   */
  generateReport(): DiagnosticReport {
    const errors = this.logs.filter((log) => log.level === 'ERROR');
    const warnings = this.logs.filter((log) => log.level === 'WARNING');

    // Kalkuluj health na podstawie błędów
    const errorRatio = Math.min(errors.length / 10, 1);
    const systemHealth = Math.max(0, 100 - errorRatio * 30);

    return {
      timestamp: new Date(),
      systemHealth: Math.round(systemHealth),
      connectionStatus: errors.filter((e) => e.category === 'CONNECTION').length === 0 ? 'OK' : 'PROBLEM',
      batteryHealth: 85 + Math.random() * 15, // Mockowe dane
      motorStatus: errors.filter((e) => e.category === 'MOTOR').length === 0 ? 'HEALTHY' : 'ISSUE',
      firmwareVersion: '4.2.1',
      errors,
      warnings,
    };
  }

  /**
   * Pokaż raport
   */
  showReport(): void {
    const report = this.generateReport();

    console.log('\n🔧 Raport Diagnostyczny:\n');
    console.log(`📊 Health systemu: ${report.systemHealth}%`);
    console.log(`🔌 Status połączenia: ${report.connectionStatus}`);
    console.log(`🔋 Zdrowie baterii: ${report.batteryHealth.toFixed(1)}%`);
    console.log(`⚙️  Status silnika: ${report.motorStatus}`);
    console.log(`📦 Firmware: ${report.firmwareVersion}`);
    console.log(`❌ Błędów: ${report.errors.length}`);
    console.log(`⚠️  Ostrzeżeń: ${report.warnings.length}\n`);
  }

  /**
   * Export logów
   */
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.logs, null, 2);
    } else {
      // CSV format
      let csv = 'Timestamp,Level,Category,Message\n';
      this.logs.forEach((log) => {
        const time = log.timestamp.toISOString();
        csv += `"${time}","${log.level}","${log.category}","${log.message}"\n`;
      });
      return csv;
    }
  }

  /**
   * Wyczyść logi
   */
  clearLogs(): void {
    this.logs = [];
    console.log('✅ Logi wyczyszczone\n');
  }
}
