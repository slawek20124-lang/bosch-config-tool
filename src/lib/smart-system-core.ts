/**
 * Smart System Core - High-Performance AI Engine
 * Rdzeń inteligentnego systemu asysty oparty na AI
 */

export interface RideData {
  timestamp: Date;
  speed: number;
  cadence: number;
  power: number;
  temperature: number;
  battery: number;
  elevation: number;
  slope: number;
}

export interface RideAnalysis {
  ridingStyle: string;
  avgSpeed: number;
  maxSpeed: number;
  energyUsed: number;
  efficiency: number;
  terrain: string;
  difficulty: number; // 0-100
  recommendations: string[];
}

export interface SmartPrediction {
  assistLevel: number; // 0-200%
  estimatedRange: number; // km
  terrainType: string;
  recommendation: string;
  confidence: number; // 0-100%
}

export class SmartSystemCore {
  private rideHistory: RideData[][] = [];
  private rideAnalysisCache: RideAnalysis[] = [];
  private maxHistorySize: number = 100;

  constructor() {
    console.log('\n🧠 Inicjalizacja Smart System Core...');
  }

  /**
   * Zaanalizu​j przejazd
   */
  analyzeRide(rideData: RideData[]): RideAnalysis {
    if (rideData.length === 0) {
      throw new Error('Brak danych przejazdu');
    }

    const avgSpeed = rideData.reduce((sum, d) => sum + d.speed, 0) / rideData.length;
    const maxSpeed = Math.max(...rideData.map((d) => d.speed));
    const avgPower = rideData.reduce((sum, d) => sum + d.power, 0) / rideData.length;
    const avgSlope = rideData.reduce((sum, d) => sum + d.slope, 0) / rideData.length;

    // Kalkuluj style jazdy
    let ridingStyle = 'CASUAL';
    let difficulty = 30;

    if (avgPower > 150 && avgSpeed > 30) {
      ridingStyle = 'AGGRESSIVE';
      difficulty = 85;
    } else if (avgPower > 100 && avgSpeed > 25) {
      ridingStyle = 'SPORT';
      difficulty = 65;
    } else if (avgPower < 50) {
      ridingStyle = 'EFFICIENT';
      difficulty = 20;
    }

    // Detectuj teren
    let terrain = 'FLAT';
    if (avgSlope > 8) {
      terrain = 'MOUNTAINS';
      difficulty += 30;
    } else if (avgSlope > 3) {
      terrain = 'HILLS';
      difficulty += 15;
    }

    // Kalkuluj energię
    const batteryUsed = rideData[0].battery - rideData[rideData.length - 1].battery;
    const distance = (maxSpeed * rideData.length) / 3600; // Przybliżenie
    const energyUsed = batteryUsed * 500; // mWh
    const efficiency = distance > 0 ? (distance / energyUsed) * 1000 : 0;

    const recommendations = this.generateRecommendations(ridingStyle, terrain, efficiency);

    const analysis: RideAnalysis = {
      ridingStyle,
      avgSpeed: Math.round(avgSpeed * 10) / 10,
      maxSpeed: Math.round(maxSpeed * 10) / 10,
      energyUsed: Math.round(energyUsed),
      efficiency: Math.round(efficiency * 100) / 100,
      terrain,
      difficulty: Math.round(difficulty),
      recommendations,
    };

    this.rideAnalysisCache.push(analysis);
    if (this.rideAnalysisCache.length > this.maxHistorySize) {
      this.rideAnalysisCache.shift();
    }

    return analysis;
  }

  /**
   * Generuj rekomendacje
   */
  private generateRecommendations(style: string, terrain: string, efficiency: number): string[] {
    const recommendations: string[] = [];

    if (style === 'AGGRESSIVE') {
      recommendations.push('💡 Zmniejsz agresywność dla lepszej efektywności');
      recommendations.push('🔋 Więcej przerw na podładowanie');
    }

    if (efficiency < 2) {
      recommendations.push('⚡ Wysoki pobór energii - rozważ Eco mode');
    }

    if (terrain === 'MOUNTAINS') {
      recommendations.push('⛰️ Górzysty teren - użyj TURBO mode na podjazdach');
    }

    if (style === 'EFFICIENT') {
      recommendations.push('👍 Świetny efektywny styl jazdy');
    }

    return recommendations.length > 0 ? recommendations : ['✅ Przejazd w normie'];
  }

  /**
   * Dodaj dane przejazdu
   */
  addRideData(data: RideData[]): void {
    this.rideHistory.push(data);
    if (this.rideHistory.length > this.maxHistorySize) {
      this.rideHistory.shift();
    }
  }

  /**
   * Pobierz historię analiz
   */
  getAnalysisHistory(): RideAnalysis[] {
    return this.rideAnalysisCache;
  }

  /**
   * Pobierz statystyki
   */
  getStatistics(): Record<string, unknown> {
    if (this.rideAnalysisCache.length === 0) {
      return {};
    }

    const avgSpeed = this.rideAnalysisCache.reduce((sum, a) => sum + a.avgSpeed, 0) / this.rideAnalysisCache.length;
    const avgEfficiency = this.rideAnalysisCache.reduce((sum, a) => sum + a.efficiency, 0) / this.rideAnalysisCache.length;
    const totalEnergy = this.rideAnalysisCache.reduce((sum, a) => sum + a.energyUsed, 0);

    return {
      totalRides: this.rideAnalysisCache.length,
      avgSpeed: Math.round(avgSpeed * 10) / 10,
      avgEfficiency: Math.round(avgEfficiency * 100) / 100,
      totalEnergyUsed: totalEnergy,
      favoriteStyle: this.getMostCommonStyle(),
    };
  }

  /**
   * Pobierz najczęściej występujący styl jazdy
   */
  private getMostCommonStyle(): string {
    const styles = this.rideAnalysisCache.map((a) => a.ridingStyle);
    const counts = styles.reduce(
      (acc, style) => {
        acc[style] = (acc[style] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b), 'CASUAL');
  }
}
