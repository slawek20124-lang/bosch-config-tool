/**
 * Data Processor - Process and optimize riding data
 * Procesor danych do analizy przejazdu
 */

export interface ProcessedData {
  timestamp: Date;
  smoothedSpeed: number;
  smoothedPower: number;
  smoothedCadence: number;
  acceleration: number;
  powerVariance: number;
}

export class DataProcessor {
  private windowSize: number = 5; // Rolling average window
  private processedData: ProcessedData[] = [];
  private maxDataPoints: number = 1000;

  /**
   * Przetwarzaj surowe dane
   */
  processRawData(rawData: any[]): ProcessedData[] {
    const processed: ProcessedData[] = [];

    for (let i = 0; i < rawData.length; i++) {
      const smoothedSpeed = this.rollingAverage(rawData, 'speed', i);
      const smoothedPower = this.rollingAverage(rawData, 'power', i);
      const smoothedCadence = this.rollingAverage(rawData, 'cadence', i);

      const acceleration = i > 0 ? smoothedSpeed - this.processedData[i - 1]?.smoothedSpeed : 0;
      const powerVariance = this.calculateVariance(rawData, 'power', i);

      const processed_entry: ProcessedData = {
        timestamp: new Date(rawData[i].timestamp),
        smoothedSpeed,
        smoothedPower,
        smoothedCadence,
        acceleration: Math.round(acceleration * 100) / 100,
        powerVariance: Math.round(powerVariance * 100) / 100,
      };

      processed.push(processed_entry);
    }

    this.processedData = processed;
    if (this.processedData.length > this.maxDataPoints) {
      this.processedData = this.processedData.slice(-this.maxDataPoints);
    }

    return processed;
  }

  /**
   * Oblicz rolling average
   */
  private rollingAverage(data: any[], field: string, index: number): number {
    const start = Math.max(0, index - Math.floor(this.windowSize / 2));
    const end = Math.min(data.length, index + Math.ceil(this.windowSize / 2));
    const window = data.slice(start, end);

    const sum = window.reduce((acc, d) => acc + (d[field] || 0), 0);
    return sum / window.length;
  }

  /**
   * Oblicz wariancję
   */
  private calculateVariance(data: any[], field: string, index: number): number {
    const start = Math.max(0, index - Math.floor(this.windowSize / 2));
    const end = Math.min(data.length, index + Math.ceil(this.windowSize / 2));
    const window = data.slice(start, end);

    const mean = window.reduce((acc, d) => acc + (d[field] || 0), 0) / window.length;
    const variance = window.reduce((acc, d) => acc + Math.pow((d[field] || 0) - mean, 2), 0) / window.length;

    return Math.sqrt(variance);
  }

  /**
   * Zbierz statystyki
   */
  gatherStatistics(): Record<string, number> {
    if (this.processedData.length === 0) {
      return {};
    }

    const speeds = this.processedData.map((d) => d.smoothedSpeed);
    const powers = this.processedData.map((d) => d.smoothedPower);

    return {
      avgSpeed: Math.round((speeds.reduce((a, b) => a + b, 0) / speeds.length) * 10) / 10,
      maxSpeed: Math.round(Math.max(...speeds) * 10) / 10,
      minSpeed: Math.round(Math.min(...speeds) * 10) / 10,
      avgPower: Math.round((powers.reduce((a, b) => a + b, 0) / powers.length) * 10) / 10,
      maxPower: Math.round(Math.max(...powers) * 10) / 10,
      dataPoints: this.processedData.length,
    };
  }

  /**
   * Pobierz przetworzone dane
   */
  getProcessedData(): ProcessedData[] {
    return this.processedData;
  }
}
