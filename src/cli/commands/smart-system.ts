import { CommandModule } from 'yargs';
import { SmartSystemCore } from '../../lib/smart-system-core';
import { MLModels } from '../../lib/ml-models';
import { AIPredictior } from '../../lib/ai-predictor';
import { DataProcessor } from '../../lib/data-processor';

const smartCore = new SmartSystemCore();
const mlModels = new MLModels();
const aiPredictor = new AIPredictior();
const dataProcessor = new DataProcessor();

interface SmartSystemCommandArgv {
  analyze?: boolean;
  predict?: boolean;
  models?: boolean;
  recommend?: boolean;
  statistics?: boolean;
  [key: string]: unknown;
}

export const smartSystemCommand: CommandModule<unknown, SmartSystemCommandArgv> = {
  command: 'smart-system',
  describe: 'Smart System with Pre-trained AI Models',
  builder: (yargs) =>
    yargs
      .option('analyze', {
        alias: 'a',
        describe: 'Analyze ride data',
        type: 'boolean',
        default: false,
      })
      .option('predict', {
        alias: 'p',
        describe: 'Make AI predictions',
        type: 'boolean',
        default: false,
      })
      .option('models', {
        alias: 'm',
        describe: 'Show ML models info',
        type: 'boolean',
        default: false,
      })
      .option('recommend', {
        alias: 'r',
        describe: 'Get AI recommendations',
        type: 'boolean',
        default: false,
      })
      .option('statistics', {
        alias: 's',
        describe: 'Show statistics',
        type: 'boolean',
        default: false,
      }),
  handler: async (argv: SmartSystemCommandArgv): Promise<void> => {
    try {
      if (argv.models) {
        console.log('\n🤖 Pre-trained ML Models:\n');
        const models = mlModels.listModels();
        models.forEach((model) => {
          console.log(`📊 ${model.name}`);
          console.log(`   Type: ${model.type}`);
          console.log(`   Accuracy: ${model.accuracy}%`);
          console.log(`   Version: ${model.version}\n`);
        });
        return;
      }

      if (argv.predict) {
        console.log('\n🔮 AI Predictions:\n');
        const energyPred = mlModels.predictEnergy(25, 80, 150, 22);
        const rangePred = mlModels.predictRange(80, 25, 3, 2);
        const assistPred = mlModels.predictAssist(5, 25, 80, 2);

        console.log(`⚡ ${energyPred.explanation}`);
        console.log(`   Confidence: ${energyPred.confidence}%\n`);
        console.log(`📍 ${rangePred.explanation}`);
        console.log(`   Confidence: ${rangePred.confidence}%\n`);
        console.log(`🎯 ${assistPred.explanation}`);
        console.log(`   Confidence: ${assistPred.confidence}%\n`);
        return;
      }

      if (argv.recommend) {
        console.log('\n💡 AI Recommendations:\n');
        const context = {
          currentBattery: 75,
          currentSpeed: 28,
          currentSlope: 5,
          currentTemperature: 35,
          weatherCondition: 'SUNNY',
          timeOfDay: 'DAY',
          dayOfWeek: 'MONDAY',
        };

        const recommendations = aiPredictor.generateRecommendations(context);
        recommendations.forEach((rec) => {
          console.log(`${rec.action}`);
          console.log(`   Priority: ${rec.priority}`);
          console.log(`   Confidence: ${rec.confidence}%`);
          console.log(`   Impact: ${rec.impact}\n`);
        });
        return;
      }

      if (argv.statistics) {
        console.log('\n📊 Smart System Statistics:\n');
        const stats = smartCore.getStatistics();
        console.log(JSON.stringify(stats, null, 2));
        console.log();
        return;
      }

      if (argv.analyze) {
        console.log('\n🔍 Analyzing ride data...\n');
        const mockRideData = [
          { timestamp: new Date(), speed: 25, cadence: 80, power: 100, temperature: 35, battery: 80, elevation: 100, slope: 2 },
          { timestamp: new Date(), speed: 26, cadence: 82, power: 110, temperature: 36, battery: 79, elevation: 105, slope: 3 },
          { timestamp: new Date(), speed: 27, cadence: 85, power: 120, temperature: 37, battery: 78, elevation: 110, slope: 4 },
        ];

        const analysis = smartCore.analyzeRide(mockRideData);
        console.log('📊 Ride Analysis:');
        console.log(`   Style: ${analysis.ridingStyle}`);
        console.log(`   Avg Speed: ${analysis.avgSpeed} km/h`);
        console.log(`   Max Speed: ${analysis.maxSpeed} km/h`);
        console.log(`   Energy: ${analysis.energyUsed} Wh`);
        console.log(`   Efficiency: ${analysis.efficiency} km/Wh`);
        console.log(`   Terrain: ${analysis.terrain}`);
        console.log(`   Difficulty: ${analysis.difficulty}/100\n`);
        console.log('Recommendations:');
        analysis.recommendations.forEach((rec) => console.log(`   ${rec}`));
        console.log();
        return;
      }

      // Default - pokazuje status
      console.log('\n✅ Smart System Ready');
      console.log('   Use --analyze, --predict, --models, --recommend, or --statistics');
      console.log();
    } catch (error) {
      console.error(`\n❌ Error: ${error}\n`);
      process.exit(1);
    }
  },
};
