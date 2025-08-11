// src/miden/miden.module.ts
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { grpcOptions } from "./miden.grpc.options";
import { MidenService } from "./miden.service";

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
  providers: [MidenService],
  exports: [MidenService],
})
export class MidenModule {}
