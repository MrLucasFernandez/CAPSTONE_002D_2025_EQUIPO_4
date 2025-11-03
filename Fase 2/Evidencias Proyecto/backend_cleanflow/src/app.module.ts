import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductosModule } from './productos/productos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasModule } from './categorias/categorias.module';
import { BoletasModule } from './boletas/boletas.module';
import { DetalleBoletasModule } from './detalle_boletas/detalle_boletas.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PagosModule } from './pagos/pagos.module';
import { RolesModule } from './roles/roles.module';
import { RolUsuariosModule } from './rol_usuarios/rol_usuarios.module';
import { StockModule } from './stock/stock.module';
import { BodegasModule } from './bodegas/bodegas.module';
import { AuthModule } from './auth/auth.module';
import { MarcasModule } from './marcas/marcas.module';
import { VentasModule } from './ventas/ventas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ // Carga "automática" de variables de entorno desde .env
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: false, 
    }),
    TypeOrmModule.forRoot({ // Configuración de TypeORM usando variables de entorno
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5433', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      retryAttempts: 10,
      retryDelay: 3000,
    }),
    AuthModule,
    ProductosModule,
    CategoriasModule,
    BoletasModule,
    DetalleBoletasModule,
    UsuariosModule,
    PagosModule,
    RolesModule,
    RolUsuariosModule,
    StockModule,
    BodegasModule,
    MarcasModule,
    VentasModule,
  ],
})
export class AppModule {}
