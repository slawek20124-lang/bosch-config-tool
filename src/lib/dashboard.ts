/**
 * Dashboard & Monitoring for Bosch eBike
 * Panel monitorowania i zarządzania e-bikiem w czasie rzeczywistym
 */

export interface BikeMetrics {
  battery: number; // %
  motorPower: number; // W
  speed: number; // km/h
  distance: number; // km
  temperature: number; // °C
  cadence: number; // rpm
  torque: number; // Nm
  efficiency: number; // %
  avgSpeed: number; // km/h
  maxSpeed: number; // km/h
  mode: string;
  timestamp: Date;
}

export interface Alert {
  level: 'INFO' | 'WARNING' | 'ERROR';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export class Dashboard {
  private metrics: BikeMetrics[] = [];
  private alerts: Alert[] = [];
  private isMonitoring: boolean = false;
  private updateInterval: NodeJS.Timeout | null = null;

  /**
   * Rozpocznij monitorowanie
   */
  startMonitoring(intervalMs: number = 1000): void {
    if (this.isMonitoring) {
      console.log('⚠️  Monitorowanie już aktywne');
      return;
    }

    this.isMonitoring = true;
    console.log('\n📊 Monitorowanie e-bike\'a uruchomione...\n');

    this.updateInterval = setInterval(() => {
      this.updateMetrics();
      this.checkAlerts();
    }, intervalMs);
  }

  /**
   * Zatrzymaj monitorowanie
   */
  stopMonitoring(): void {
    if (!this.isMonitoring) {
      console.log('⚠️  Monitorowanie nie jest aktywne');
      return;
    }

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.isMonitoring = false;
    console.log('\n⏹️  Monitorowanie zatrzymane\n');
  }

  /**
   * Aktualizuj metryki
   */
  private updateMetrics(): void {
    const mockMetrics: BikeMetrics = {
      battery: Math.max(0, Math.random() * 100),
      motorPower: Math.random() * 500,
      speed: Math.random() * 45,
      distance: Math.random() * 200,
      temperature: 25 + Math.random() * 15,
      cadence: Math.random() * 120,
      torque: Math.random() * 80,
      efficiency: 70 + Math.random() * 30,
      avgSpeed: Math.random() * 35,
      maxSpeed: Math.random() * 50,
      mode: ['ECO', 'TOUR', 'SPORT', 'TURBO'][Math.floor(Math.random() * 4)],
      timestamp: new Date(),
    };

    this.metrics.push(mockMetrics);

    // Ogranicz historię do 1000 punktów
    if (this.metrics.length > 1000) {
      this.metrics.shift();
    }
  }

  /**
   * Sprawdź alerty
   */
  private checkAlerts(): void {
    if (this.metrics.length === 0) return;

    const current = this.metrics[this.metrics.length - 1];

    // Bateria niska
    if (current.battery < 20) {
      this.addAlert('WARNING', `⚠️  Niska bateria: ${current.battery.toFixed(1)}%`);
    }

    // Temperatura wysoka
    if (current.temperature > 50) {
      this.addAlert('ERROR', `🔥 Wysoka temperatura: ${current.temperature.toFixed(1)}°C`);
    }

    // Bateria krytyczna
    if (current.battery < 5) {
      this.addAlert('ERROR', `🚨 Bateria krytyczna: ${current.battery.toFixed(1)}%`);
    }
  }

  /**
   * Dodaj alert
   */
  private addAlert(level: 'INFO' | 'WARNING' | 'ERROR', message: string): void {
    const alert: Alert = {
      level,
      message,
      timestamp: new Date(),
      resolved: false,
    };

    this.alerts.push(alert);
  }

  /**
   * Pokaż obecne metryki
   */
  showMetrics(): void {
    if (this.metrics.length === 0) {
      console.log('\n❌ Brak danych metryk\n');
      return;
    }

    const current = this.metrics[this.metrics.length - 1];

    console.log('\n📊 Metryki e-bike\'a:\n');
    console.log(`🔋 Bateria: ${current.battery.toFixed(1)}%`);
    console.log(`⚡ Moc silnika: ${current.motorPower.toFixed(0)}W`);
    console.log(`🚴 Prędkość: ${current.speed.toFixed(1)} km/h`);
    console.log(`📍 Dystans: ${current.distance.toFixed(1)} km`);
    console.log(`🌡️  Temperatura: ${current.temperature.toFixed(1)}°C`);
    console.log(`🔄 Kadencja: ${current.cadence.toFixed(0)} rpm`);
    console.log(`💪 Moment obrotowy: ${current.torque.toFixed(1)} Nm`);
    console.log(`⚙️  Efektywność: ${current.efficiency.toFixed(1)}%`);
    console.log(`📈 Śr. prędkość: ${current.avgSpeed.toFixed(1)} km/h`);
    console.log(`📊 Max prędkość: ${current.maxSpeed.toFixed(1)} km/h`);
    console.log(`🎯 Tryb: ${current.mode}\n`);
  }

  /**
   * Pokaż alerty
   */
  showAlerts(): void {
    if (this.alerts.length === 0) {
      console.log('\n✅ Brak alertów\n');
      return;
    }

    console.log('\n🚨 Alerty:\n');
    this.alerts.slice(-10).forEach((alert) => {
      const icon = alert.level === 'ERROR' ? '❌' : alert.level === 'WARNING' ? '⚠️' : 'ℹ️';
      console.log(`${icon} [${alert.timestamp.toLocaleTimeString()}] ${alert.message}`);
    });
    console.log();
  }

  /**
   * Export statystyk
   */
  exportStats(): string {
    if (this.metrics.length === 0) {
      return '{}';
    }

    const avgBattery = this.metrics.reduce((sum, m) => sum + m.battery, 0) / this.metrics.length;
    const avgSpeed = this.metrics.reduce((sum, m) => sum + m.speed, 0) / this.metrics.length;
    const maxSpeed = Math.max(...this.metrics.map((m) => m.maxSpeed));
    const totalDistance = this.metrics[this.metrics.length - 1].distance;
    const avgTemperature = this.metrics.reduce((sum, m) => sum + m.temperature, 0) / this.metrics.length;

    return JSON.stringify(
      {
        samplesCount: this.metrics.length,
        avgBattery: avgBattery.toFixed(2),
        avgSpeed: avgSpeed.toFixed(2),
        maxSpeed: maxSpeed.toFixed(2),
        totalDistance: totalDistance.toFixed(2),
        avgTemperature: avgTemperature.toFixed(2),
        alertsCount: this.alerts.length,
        exportDate: new Date().toISOString(),
      },
      null,
      2
    );
  }

  /**
   * Pobierz aktualne metryki
   */
  getCurrentMetrics(): BikeMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null;
  }
}
