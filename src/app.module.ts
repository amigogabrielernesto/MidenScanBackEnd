import { Module } from "@nestjs/common";
import { MidenModule } from "./miden/miden.module";

@Module({
  imports: [MidenModule],
})
export class AppModule {}
