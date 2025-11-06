import bcrypt from 'bcryptjs';

    const newPassword = 'password123'; // ⬅️ ¡REEMPLAZA ESTA LÍNEA!
    const saltRounds = 10; 

    async function generateHash() {
        try {
            const hash = await bcrypt.hash(newPassword, saltRounds);
            console.log("--------------------------------------------------------------------------------");
            console.log("Hash generado (COPIA ESTE VALOR COMPLETO):");
            console.log(hash);
            console.log("--------------------------------------------------------------------------------");
        } catch (error) {
            console.error("Error al generar el hash:", error);
        }
    }

    generateHash();