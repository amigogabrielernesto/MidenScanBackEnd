import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString, Matches } from "class-validator";

export class GetNotesByIdsDto {
  @ApiProperty({
    description: "Array de Note IDs en formato hexadecimal",
    example: [
      "0xf52002d1acde75862eda7be573ad8461a45621a7161277a4e91855ada929c1e4",
      "0x1a2b3c4d5e6f7081928374655647382910abcdefabcdefabcdefabcdefabcdef",
    ],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @Matches(/^0x[a-fA-F0-9]{64}$/, {
    each: true,
    message:
      "Cada noteId debe ser un hash hexadecimal de 64 caracteres con prefijo 0x",
  })
  noteIds: string[];
}
