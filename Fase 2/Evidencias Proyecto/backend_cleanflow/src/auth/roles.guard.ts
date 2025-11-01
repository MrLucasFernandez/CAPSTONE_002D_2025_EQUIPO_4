import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        
        const rolRequerido = this.reflector.get<string[]>('roles', context.getHandler());
        if (!rolRequerido) 
            return true;

        const { user } = context.switchToHttp().getRequest();

        if (!user) {
            throw new ForbiddenException('user no autenticado');
        }
        if (!user.roles) {
            throw new ForbiddenException('El user no tiene roles asignados');
        }

        const tieneRol = rolRequerido.some((rol) => user.roles?.includes(rol));
        if (!tieneRol) {
            throw new ForbiddenException('No tiene permisos para acceder a este recurso');
        }

        return tieneRol;
    }
}
