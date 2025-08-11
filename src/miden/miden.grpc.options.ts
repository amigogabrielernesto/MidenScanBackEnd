import { join } from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

export const grpcOptions = {
  url: "rpc.testnet.miden.io:443",
  package: "rpc",
  protoPath: join(__dirname, "../../proto/proto/rpc.proto"),
  loader: {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    includeDirs: [
      join(__dirname, "../../proto/proto/"),
      // Agrega aquí otras rutas si tus .proto hacen imports relativos
    ],
  },
  credentials: grpc.credentials.createSsl(),
};

// Función para crear el cliente con TLS
export function createGrpcClient() {
  const packageDefinition = protoLoader.loadSync(
    grpcOptions.protoPath,
    grpcOptions.loader
  );

  const proto = grpc.loadPackageDefinition(packageDefinition) as any;

  return new proto[grpcOptions.package].Api(
    grpcOptions.url,
    grpcOptions.credentials
  );
}
