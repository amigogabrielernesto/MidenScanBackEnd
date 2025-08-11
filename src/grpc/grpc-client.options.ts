import { ClientOptions, Transport } from "@nestjs/microservices";
import { join } from "path";

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: "rpc",
    protoPath: join(__dirname, "../proto/proto/rpc.proto"),
    url: "localhost:3001",
  },
};
