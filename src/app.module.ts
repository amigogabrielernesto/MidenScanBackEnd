// src/app.module.ts
import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { MidenTestModule } from "./miden/miden.module";
// ... otros imports

@Module({
  imports: [
    HttpModule,
    MidenTestModule,
    // ... otros módulos
  ],
  // ... controladores y providers
})
export class AppModule {}
