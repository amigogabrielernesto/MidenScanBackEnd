// src/miden/dtos/getAccountDetails.dto.ts
import { IsString } from "class-validator";

export class GetAccountDetailsDto {
  @IsString()
  id: string;
}
