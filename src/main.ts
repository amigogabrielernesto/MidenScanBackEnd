import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["log", "warn", "error", "debug"],
  });

  // ✅ ESSENTIAL: Global prefix for Vercel
  app.setGlobalPrefix("api");

  // ✅ CORS configuration
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3030",
      "http://localhost:3001",
      "https://miden-scan-back-end.vercel.app",
      "https://miden-scan.vercel.app",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With",
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // ✅ Validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // ✅ Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("Miden Explorer API")
    .setDescription("API REST para consultar la testnet de Miden")
    .setVersion("1.0")
    .addTag("blockchain")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document); // Changed to api/docs

  // ✅ Vercel-specific handling
  const port = process.env.PORT || 3000;

  if (process.env.VERCEL) {
    // For Vercel deployment
    await app.init();
    const server = app.getHttpAdapter().getInstance();

    // Export for Vercel
    module.exports = server;
  } else {
    // For local development
    await app.listen(port);
    console.log(`Server is running on port ${port}`);
    console.log(`Swagger docs: http://localhost:${port}/api/docs`);
  }
}

// ✅ Vercel requires this export
if (process.env.VERCEL) {
  bootstrap().catch((err) => {
    console.error("Failed to bootstrap app:", err);
    process.exit(1);
  });
} else {
  bootstrap();
}
