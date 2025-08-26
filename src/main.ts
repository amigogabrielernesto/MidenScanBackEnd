import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["log", "warn", "error", "debug"], // 🔹 Habilita debug
  });

  const config = new DocumentBuilder()
    .setTitle("Miden Explorer API")
    .setDescription("API REST para consultar la testnet de Miden")
    .setVersion("1.0")
    .addTag("blockchain")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document); // http://localhost:3000/api
  app.enableCors({
    origin: ["http://localhost:3000"],
    credentials: true,
  });

  await app.listen(3000);
  console.log("Server is running on port 3000");
}
bootstrap();
