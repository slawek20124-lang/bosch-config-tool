/**
 * AI Predictor - Advanced predictions engine
 * Zaawansowany silnik predykcji oparty na AI
 */

import { MLModels, Prediction } from './ml-models';

export interface ContextData {
  currentBattery: number;
  currentSpeed: number;
  currentSlope: number;
  currentTemperature: number;
  weatherCondition: string;
  timeOfDay: string;
  dayOfWeek: string;
}

export interface AIRecommendation {
  action: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: number;
  timeFrame: string;
  impact: string;
}

export class AIPredictior {
  private mlModels: MLModels;
  private contextHistory: ContextData[] = [];
  private maxHistory: number = 500;

  constructor() {
    this.mlModels = new MLModels();
    console.log('🤖 AI Predictor zainicjalizowany\n');
  }

  /**
   * Generuj AI rekomendacje
   */
  generateRecommendations(context: ContextData): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];

    // Dodaj kontekst do historii
    this.contextHistory.push(context);
    if (this.contextHistory.length > this.maxHistory) {
      this.contextHistory.shift();
    }

    // Rekomendacja baterii
    if (context.currentBattery < 20) {
      recommendations.push({
        action: '🔋 Bateria poniżej 20% - rozważ powrót do domu',
        priority: 'HIGH',
        confidence: 95,
        timeFrame: 'Natychmiast',
        impact: 'Bezpieczeństwo, uniknięcie rozładowania',
      });
    }

    // Rekomendacja temperatury
    if (context.currentTemperature > 55) {
      recommendations.push({
        action: '🌡️ Wysoka temperatura - zmniejsz moc silnika',
        priority: 'MEDIUM',
        confidence: 88,
        timeFrame: '5-10 minut',
        impact: 'Przedłużenie żywotności silnika',
      });
    }

    // Rekomendacja trasy
    if (context.currentSlope > 10 && context.currentBattery < 50) {
      recommendations.push({
        action: '⛰️ Stromy podjazd z niską baterią - użyj TURBO mode',
        priority: 'MEDIUM',
        confidence: 92,
        timeFrame: 'Obecna chwila',
        impact: 'Maksymalna efektywność energii',
      });
    }

    // Rekomendacja pogody
    if (context.weatherCondition === 'RAINY' && context.currentSpeed > 30) {
      recommendations.push({
        action: '🌧�� Deszcz i wysoka prędkość - jedź ostrożnie',
        priority: 'HIGH',
        confidence: 90,
        timeFrame: 'Natychmiast',
        impact: 'Bezpieczeństwo',
      });
    }

    // Rekomendacja czasu dnia
    if (context.timeOfDay === 'NIGHT' && context.currentSpeed > 35) {
      recommendations.push({
        action: '🌙 Noc - zmniejsz prędkość dla bezpieczeństwa',
        priority: 'MEDIUM',
        confidence: 85,
        timeFrame: 'Bieżący przejazd',
        impact: 'Bezpieczeństwo drogowe',
      });
    }

    return recommendations;
  }

  /**
   * Predykuj przyszłą baterię
   */
  predictFutureBattery(minutesAhead: number, context: ContextData): Prediction {
    const consumptionRate = this.estimateConsumption(context);
    const futureBattery = Math.max(0, context.currentBattery - consumptionRate * (minutesAhead / 60));

    return {
      value: Math.round(futureBattery * 10) / 10,
      confidence: 82,
      explanation: `Za ${minutesAhead} minut bateria: ${futureBattery.toFixed(1)}%`,
    };
  }

  /**
   * Estyumuj zużycie energii
   */
  private estimateConsumption(context: ContextData): number {
    let consumption = 5; // mAh/min baseline

    // Szybkość wpływa
    consumption += context.currentSpeed * 0.1;

    // Stok wpływa
    consumption += context.currentSlope * 0.2;

    // Temperatura wpływa
    if (context.currentTemperature < 0) {
      consumption *= 1.15;
    } else if (context.currentTemperature > 40) {
      consumption *= 0.95;
    }

    // Pogoda wpływa
    if (context.weatherCondition === 'WINDY') {
      consumption *= 1.1;
    }

    return consumption;
  }

  /**
   * Predykuj najlepszy profil asysty
   */
  predictBestProfile(context: ContextData): string {
    if (context.currentBattery < 15) {
      return 'ECO';
    }

    if (context.currentSlope > 8) {
      return 'TURBO';
    }

    if (context.currentSpeed > 35) {
      return 'TOUR';
    }

    return 'SPORT';
  }

  /**
   * Pobierz średnie zużycie z historii
   */
  getAverageConsumption(): number {
    if (this.contextHistory.length === 0) return 0;

    const avgSpeed = this.contextHistory.reduce((sum, c) => sum + c.currentSpeed, 0) / this.contextHistory.length;
    return this.estimateConsumption({ ...this.contextHistory[0], currentSpeed: avgSpeed });
  }
}
