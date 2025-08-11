import { IsInt, Min } from "class-validator";

export class GetBlockByNumberDto {
  @IsInt()
  @Min(0)
  block_num: number;
}
