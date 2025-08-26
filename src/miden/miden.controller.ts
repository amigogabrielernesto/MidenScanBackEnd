import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { MidenService } from "./miden.service";

@Controller("miden")
export class MidenController {
  constructor(private readonly midenService: MidenService) {}

  @Get("status")
  getStatus() {
    return this.midenService.getStatus();
  }

  @Get("block/:number")
  async getBlock(@Param("number", ParseIntPipe) blockNumber: number) {
    return this.midenService.getFormattedBlock(blockNumber);
  }
}

// @Get("get-block-header-by-number/:blockNum") async getBlockHeaderByNumber(
//   @Param("blockNum", ParseIntPipe) blockNum: number
// ) {
//   const respuesta = await lastValueFrom(
//     this.midenService.getBlockHeaderByNumber(blockNum)
//   );
//   const date = new Date(respuesta.block_header.timestamp * 1000);
//   //console.log(blockNum);
//   //console.log(respuesta);
//   //console.log(respuesta.block_header.proof_commitment);

//   const salida = {
//     block_header: {
//       version: respuesta.block_header.version,
//       block_num: respuesta.block_header.block_num,
//       timestamp: date.toLocaleString(),
//       prev_block_commitment: convertRespuestaToHex(
//         respuesta.block_header.prev_block_commitment
//       ),
//       chain_commitment: convertRespuestaToHex(
//         respuesta.block_header.chain_commitment
//       ),
//       account_root: convertRespuestaToHex(
//         respuesta.block_header.account_root
//       ),
//       nullifier_root: convertRespuestaToHex(
//         respuesta.block_header.nullifier_root
//       ),
//       note_root: convertRespuestaToHex(respuesta.block_header.note_root),
//       tx_commitment: convertRespuestaToHex(
//         respuesta.block_header.tx_commitment
//       ),
//       proof_commitment: convertRespuestaToHex(
//         respuesta.block_header.proof_commitment
//       ),
//       tx_kernel_commitment: convertRespuestaToHex(
//         respuesta.block_header.tx_kernel_commitment
//       ),
//     },
//   };
//   return salida;
// }

// @Get(":blockNumber")
// async getBlock(@Param("blockNumber") blockNumber: number) {
//   try {
//     const block = await this.midenService.getFormattedBlock(blockNumber);
//     return {
//       success: true,
//       data: block,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// }

// @Get(":blockNumber/raw")
// async getRawBlock(@Param("blockNumber") blockNumber: number) {
//   try {
//     const block = await this.midenService.getBlockByNumber(blockNumber);
//     return {
//       success: true,
//       data: block,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// }
