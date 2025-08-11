// src/miden/miden.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { MidenService } from "./miden.service";
import { lastValueFrom, timestamp } from "rxjs";
import { GetBlockByNumberDto } from "./dtos/getBlockByNumber";
import { convertAllCommitments, convertRespuestaToHex } from "./funciones";

@Controller("miden")
export class MidenController {
  constructor(private readonly midenService: MidenService) {}

  @Get("status")
  async getStatus() {
    return await lastValueFrom(this.midenService.getStatus());
  }

  @Post("check-nullifiers")
  async checkNullifiers(@Body() body: any) {
    return await convertAllCommitments(
      lastValueFrom(this.midenService.checkNullifiers(body))
    );
  }

  @Post("check-nullifiers-by-prefix")
  async checkNullifiersByPrefix(@Body() body: any) {
    return await lastValueFrom(this.midenService.checkNullifiersByPrefix(body));
  }

  @Post("get-account-details")
  async getAccountDetails(@Body() body: any) {
    return await lastValueFrom(this.midenService.getAccountDetails(body));
  }

  @Post("get-account-proofs")
  async getAccountProofs(@Body() body: any) {
    return await lastValueFrom(this.midenService.getAccountProofs(body));
  }

  @Post("get-account-state-delta")
  async getAccountStateDelta(@Body() body: any) {
    return await lastValueFrom(this.midenService.getAccountStateDelta(body));
  }

  @Get("get-block-by-number/:blockNum")
  async getBlockByNumber(@Param("blockNum", ParseIntPipe) blockNum: number) {
    return await lastValueFrom(this.midenService.getBlockByNumber(blockNum));
  }

  @Post("get-block-header-by-number/:blockNum")
  async getBlockHeaderByNumber(
    @Param("blockNum", ParseIntPipe) blockNum: number
  ) {
    const respuesta = await lastValueFrom(
      this.midenService.getBlockHeaderByNumber(blockNum)
    );
    const date = new Date(respuesta.block_header.timestamp * 1000);
    //console.log(blockNum);
    //console.log(respuesta);
    //console.log(respuesta.block_header.proof_commitment);

    const salida = {
      block_header: {
        version: respuesta.block_header.version,
        block_num: respuesta.block_header.block_num,
        timestamp: date.toLocaleString(),
        prev_block_commitment: convertRespuestaToHex(
          respuesta.block_header.prev_block_commitment
        ),
        chain_commitment: convertRespuestaToHex(
          respuesta.block_header.chain_commitment
        ),
        account_root: convertRespuestaToHex(
          respuesta.block_header.account_root
        ),
        nullifier_root: convertRespuestaToHex(
          respuesta.block_header.nullifier_root
        ),
        note_root: convertRespuestaToHex(respuesta.block_header.note_root),
        tx_commitment: convertRespuestaToHex(
          respuesta.block_header.tx_commitment
        ),
        proof_commitment: convertRespuestaToHex(
          respuesta.block_header.proof_commitment
        ),
        tx_kernel_commitment: convertRespuestaToHex(
          respuesta.block_header.tx_kernel_commitment
        ),
      },
    };
    return salida;
  }

  @Post("get-notes-by-id")
  async getNotesById(@Body() body: any) {
    return await lastValueFrom(this.midenService.getNotesById(body));
  }

  @Post("submit-proven-transaction")
  async submitProvenTransaction(@Body() body: any) {
    return await lastValueFrom(this.midenService.submitProvenTransaction(body));
  }

  @Post("sync-notes")
  async syncNotes(@Body() body: any) {
    return await lastValueFrom(this.midenService.syncNotes(body));
  }

  @Post("sync-state")
  async syncState(@Body() body: any) {
    return await lastValueFrom(this.midenService.syncState(body));
  }
}
