// src/miden/miden.service.ts
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { Observable } from "rxjs";
// Definir interfaz del servicio Api con todos los métodos (tipado básico)

interface RpcService {
  Status(empty: {}): Observable<any>;
  CheckNullifiers(request: any): Observable<any>;
  CheckNullifiersByPrefix(request: any): Observable<any>;
  GetAccountDetails(request: any): Observable<any>;
  GetAccountProofs(request: any): Observable<any>;
  GetAccountStateDelta(request: any): Observable<any>;
  GetBlockByNumber(request: any): Observable<any>;
  GetBlockHeaderByNumber(request: any): Observable<any>;
  GetNotesById(request: any): Observable<any>;
  SubmitProvenTransaction(request: any): Observable<any>;
  SyncNotes(request: any): Observable<any>;
  SyncState(request: any): Observable<any>;
}

@Injectable()
export class MidenService implements OnModuleInit {
  private api: RpcService;

  constructor(@Inject("MidenApiClient") private client: ClientGrpc) {}

  onModuleInit() {
    this.api = this.client.getService<RpcService>("Api");
  }

  // Ejemplo de método para consumir status
  getStatus() {
    return this.api.Status({});
  }

  // Agregá aquí wrappers para cada método del proto:
  checkNullifiers(request: any) {
    return this.api.CheckNullifiers(request);
  }

  checkNullifiersByPrefix(request: any) {
    return this.api.CheckNullifiersByPrefix(request);
  }

  getAccountDetails(request: any) {
    return this.api.GetAccountDetails(request);
  }

  getAccountProofs(request: any) {
    return this.api.GetAccountProofs(request);
  }

  getAccountStateDelta(request: any) {
    return this.api.GetAccountStateDelta(request);
  }

  getBlockByNumber(blockNum: any) {
    return this.api.GetBlockByNumber(blockNum);
  }

  getBlockHeaderByNumber(blockNum: number) {
    return this.api.GetBlockHeaderByNumber(blockNum);
  }

  getNotesById(request: any) {
    return this.api.GetNotesById(request);
  }

  submitProvenTransaction(request: any) {
    return this.api.SubmitProvenTransaction(request);
  }

  syncNotes(request: any) {
    return this.api.SyncNotes(request);
  }

  syncState(request: any) {
    return this.api.SyncState(request);
  }
}
