import { join } from "path";
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { grpcOptions } from "./miden.grpc.options";
import { MidenService } from "./miden.service";
import { MidenController } from "./miden.controller";
import { MidenRustService } from "./miden-rust.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "MidenApiClient",
        transport: Transport.GRPC,
        options: grpcOptions, // Aquí sólo las opciones, sin transport ni name
      },
    ]),
  ],
  providers: [MidenService, MidenRustService],
  exports: [MidenService],
  controllers: [MidenController],
})
export class MidenModule {}
