import { PrismaClient } from '@prisma/client';
import { SeedMode, SeedOrchestrator } from './seed.orchestrator';

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  let mode: SeedMode = 'upsert';

  // Parse mode from arguments: --mode=reset or --mode=upsert
  const modeArg = args.find(arg => arg.startsWith('--mode='));
  if (modeArg) {
    const val = modeArg.split('=')[1];
    if (val === 'reset' || val === 'upsert') {
      mode = val;
    }
  }

  const orchestrator = new SeedOrchestrator(prisma);
  
  try {
    await orchestrator.run(mode);
    
    // 📊 Report Summary
    console.log('\n📊 SEED VERIFICATION REPORT:');
    console.log('--------------------------------------------------');
    
    const lines = await prisma.line.count();
    const stations = await prisma.station.findMany({
      orderBy: { code: 'asc' }
    });
    const trains = await prisma.train.findMany({
      orderBy: { code: 'asc' }
    });
    const segments = await prisma.segment.count();

    console.log(`🚇 Total Lines:     ${lines}`);
    console.log(`🚉 Total Stations:  ${stations.length}`);
    console.log(`🛤️ Total Segments:  ${segments}`);
    console.log(`🚅 Total Trains:    ${trains.length}`);
    
    console.log('\n📋 TRAIN ALLOCATION:');
    const activeTrains = trains.filter(t => t.status === 'active');
    const standbyTrains = trains.filter(t => t.status !== 'active');
    console.log(`- Active (Commercial): ${activeTrains.length} trains`);
    console.log(`- Reserve/Maintenance: ${standbyTrains.length} trains`);
    
    console.log('\n[End of Report]\n');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
