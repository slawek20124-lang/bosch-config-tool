/**
 * Complete Installation & Run Example
 * Pełny przykład instalacji i uruchomienia
 */

// Step 1: Install Dependencies
// ==============================
// npm install
//
// This installs all required packages:
// - yargs: CLI argument parsing
// - chalk: Terminal colors
// - serialport: USB communication
// - typescript: Type checking
// - ts-node: TypeScript runtime
// - jest: Testing framework
// - eslint: Code linting

// Step 2: Build the Project
// ==========================
// npm run build
//
// This compiles TypeScript to JavaScript:
// - All .ts files → .js files in dist/
// - Type checking performed
// - Source maps created for debugging

// Step 3: Run the Application
// =============================
// Option A: Development mode
// npm run dev
// - Uses ts-node to run TypeScript directly
// - No compilation needed
// - Hot reload ready

// Option B: Production mode
// npm start
// - Runs compiled JavaScript from dist/
// - Faster execution
// - Optimized for performance

// Example CLI Usage:
// ====================

const examples = {
  bikeInfo: {
    command: 'npm run cli bike-info --spec',
    description: 'Show Cube Stereo 140 2023 specifications',
    output: `
🚲 Cube Stereo 140 2023

Type: Trail E-MTB
Frame Size: M (43cm)
Travel: 140mm
Weight: 24.5kg
Wheels: 29"

⚙️ Components:
   suspension: RockShox Yari RC 140mm
   drivetrain: Shimano CUES 9-speed
   brakes: Shimano MT201 Hydraulic Disc
   wheels: Cube Reaction EXC 29 Tubeless
   tires: Schwalbe Smart Sam 2.25

🔌 Compatibility:
   Motors: Bosch Performance CX Gen 4, Bosch Performance Line Gen 3
   Batteries: Bosch PowerTube 500Wh, 625Wh, 750Wh
    `,
  },

  tuningList: {
    command: 'npm run cli tuning --list',
    description: 'List all tuning profiles',
    output: `
📚 Available Tuning Profiles:

ECO: Maksymalna efektywność i zasięg
TOUR: Zbalansowana wydajność i zasięg
SPORT: Wysoka wydajność i moc
TURBO: Maksymalna moc i przyspieszenie
    `,
  },

  tuningApply: {
    command: 'npm run cli tuning --preset SPORT --apply',
    description: 'Apply SPORT tuning profile',
    output: `
🔧 Applying profile: SPORT

🔧 Tuning Profile: SPORT

Opis: Wysoka wydajność i moc

Ustawienia Motoru:
   Krzywa mocy: AGGRESSIVE
   Max asystencja: 150%
   Faktor momentu: 1.1

Metryki wydajności:
   Max prędkość: 25 km/h
   Max zasięg: 60 km
   Efektywność: 1.2 km/Wh

✅ Profile applied!
    `,
  },

  smartAnalyze: {
    command: 'npm run cli smart-system --analyze',
    description: 'Analyze ride data',
    output: `
🔍 Analyzing ride data...

📊 Ride Analysis:
   Style: SPORT
   Avg Speed: 25.3 km/h
   Max Speed: 27.0 km/h
   Energy: 1250 Wh
   Efficiency: 1.85 km/Wh
   Terrain: HILLS
   Difficulty: 65/100

Recommendations:
   💡 Reduce aggressive behavior for better efficiency
   ⛰️ Hilly terrain - use TURBO mode on climbs
    `,
  },

  smartPredict: {
    command: 'npm run cli smart-system --predict',
    description: 'Make AI predictions',
    output: `
🤖 AI Predictions:

⚡ Predicted energy consumption: 15.3 Wh/km
   Confidence: 92.5%

📍 Predicted remaining range: 80 km
   Confidence: 88.7%

⚡ Recommended assist level: 140%
   Confidence: 91.3%
    `,
  },
};

// Installation Steps:
const installationSteps = [
  {
    step: 1,
    title: 'Check Node.js',
    command: 'node --version',
    expected: 'v14.0.0 or higher',
  },
  {
    step: 2,
    title: 'Clone/Download Repository',
    command: 'git clone https://github.com/slawek20124-lang/bosch-config-tool.git',
    expected: 'Repository downloaded',
  },
  {
    step: 3,
    title: 'Navigate to directory',
    command: 'cd bosch-config-tool',
    expected: 'In project directory',
  },
  {
    step: 4,
    title: 'Install dependencies',
    command: 'npm install',
    expected: 'All packages installed (showing "added XXX packages")',
  },
  {
    step: 5,
    title: 'Build the project',
    command: 'npm run build',
    expected: 'Build successful (showing "dist/" directory created)',
  },
  {
    step: 6,
    title: 'Run the application',
    command: 'npm start',
    expected: 'Application running',
  },
];

// Quick verification:
const verification = [
  {
    test: 'Check build',
    command: 'ls -la dist/',
    shouldExist: ['cli', 'lib'],
  },
  {
    test: 'Test CLI',
    command: 'npm run cli bike-info --spec',
    shouldShow: 'Cube Stereo 140 2023',
  },
  {
    test: 'Test tuning',
    command: 'npm run cli tuning --list',
    shouldShow: 'ECO, TOUR, SPORT, TURBO',
  },
  {
    test: 'Test Smart System',
    command: 'npm run cli smart-system --models',
    shouldShow: 'energy_consumption, range_prediction',
  },
];

export { examples, installationSteps, verification };
