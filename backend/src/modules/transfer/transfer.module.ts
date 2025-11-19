import { Module } from '@nestjs/common';
import { TransferRepository } from './infrastructure/transfer.repository';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  providers: [TransferRepository],
  exports: [TransferRepository],
})
export class TransferModule {}
