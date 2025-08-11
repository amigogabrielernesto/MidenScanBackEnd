import { Controller, Get, Query, Inject, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { ApiOperation, ApiQuery, ApiTags, ApiResponse } from "@nestjs/swagger";

interface UsuarioRequest {
  id: string;
}

interface UsuarioResponse {
  id: string;
  nombre: string;
  email: string;
}

interface MiServicio {
  ObtenerUsuario(data: UsuarioRequest): Promise<UsuarioResponse>;
}

@ApiTags("Usuarios")
@Controller("usuarios")
export class AppController implements OnModuleInit {
  private miServicio: MiServicio;

  constructor(@Inject("GRPC_CLIENT") private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.miServicio = this.client.getService<MiServicio>("MiServicio");
  }

  @Get()
  @ApiOperation({ summary: "Obtener usuario por ID usando gRPC" })
  @ApiQuery({ name: "id", required: true })
  @ApiResponse({
    status: 200,
    description: "Usuario obtenido correctamente",
    schema: {
      example: {
        id: "123",
        nombre: "Juan Pérez",
        email: "juan@example.com",
      },
    },
  })
  async obtenerUsuario(@Query("id") id: string) {
    const respuesta = await this.miServicio.ObtenerUsuario({ id });
    return {
      id: respuesta.id,
      nombre: respuesta.nombre,
      email: respuesta.email,
    };
  }
}
