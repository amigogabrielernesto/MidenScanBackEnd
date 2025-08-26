import { join } from "path";
import * as grpc from "@grpc/grpc-js";

export const grpcOptions = {
  package: "rpc",
  protoPath: join(__dirname, "../../proto/rpc.proto"),
  url: "rpc.testnet.miden.io:443",
  loader: {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    includeDirs: [
      join(__dirname, "../../proto"),
      join(__dirname, "../../proto/store"),
      join(__dirname, "../../proto/types"),
    ],
  },
  credentials: grpc.credentials.createSsl(),
};
