import { apiRequest } from '@/api/apiClient';

export interface UpdateRolUsuarioDto {
    dtoDelete: { idUsuario: number; idRol: number };
    dtoCreate: { idUsuario: number; idRol: number };
}

/**
 * Actualiza los roles de un usuario
 * Realiza una sola llamada por cada cambio de rol
 */
export async function updateRolUsuario(
    idUsuario: number,
    oldRoleIds: number[],
    newRoleIds: number[]
): Promise<void> {
    // Roles a eliminar (que estaban pero ya no están)
    const rolesToDelete = oldRoleIds.filter(id => !newRoleIds.includes(id));
    
    // Roles a crear (que no estaban pero ahora están)
    const rolesToCreate = newRoleIds.filter(id => !oldRoleIds.includes(id));

    // Si no hay cambios, no hacer nada
    if (rolesToDelete.length === 0 && rolesToCreate.length === 0) {
        return;
    }

    // Procesar cada cambio de rol con una única llamada
    const updatePromises: Promise<any>[] = [];

    // Para cada rol a eliminar, hacer una llamada
    for (const idRolToDelete of rolesToDelete) {
        // El rol a crear será el primer rol de los nuevos, o el mismo que se elimina si no hay nuevos
        const idRolToCreate = newRoleIds[0] || idRolToDelete;
        
        const body = {
            dtoDelete: { idUsuario, idRol: idRolToDelete },
            dtoCreate: { idUsuario, idRol: idRolToCreate }
        };
        
        updatePromises.push(
            apiRequest('/rol_usuarios/update', {
                method: 'POST',
                body,
            })
        );
    }

    // Para cada rol a crear (que no se eliminó), hacer una llamada
    for (const idRolToCreate of rolesToCreate) {
        // El rol a eliminar será el primer rol de los antiguos, o el mismo que se crea si no hay antiguos
        const idRolToDelete = oldRoleIds[0] || idRolToCreate;
        
        const body = {
            dtoDelete: { idUsuario, idRol: idRolToDelete },
            dtoCreate: { idUsuario, idRol: idRolToCreate }
        };
        
        updatePromises.push(
            apiRequest('/rol_usuarios/update', {
                method: 'POST',
                body,
            })
        );
    }

    // Esperar a que todas las actualizaciones se completen
    if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
    }
}
