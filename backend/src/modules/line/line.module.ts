import { Module } from '@nestjs/common';
import { LineRepository } from './infrastructure/line.repository';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  providers: [LineRepository],
  exports: [LineRepository],
})
export class LineModule {}
