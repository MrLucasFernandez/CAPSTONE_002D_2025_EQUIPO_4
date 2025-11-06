export const rutValidator = (rut: string): boolean => {
    // 1. Limpiar y estandarizar el RUT:
    //    - Eliminar cualquier caracter que no sea dígito ni 'K'/'k'.
    //    - Convertir todo a mayúsculas para unificar el dígito verificador 'K'.
    let cleanRut = rut.replace(/[^0-9kK]/g, '').toUpperCase();

    // Mínimo un dígito y el dígito verificador.
    if (cleanRut.length < 2) {
        return false;
    }

    // 2. Separar el cuerpo del RUT y el dígito verificador (DV)
    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);

    // Un RUT válido chileno debe tener al menos 7 u 8 dígitos en el cuerpo (ej: 1.000.000-0)
    if (body.length < 7) {
        return false;
    }

    // 3. Aplicar el algoritmo Módulo 11
    let sum = 0;
    let multiplier = 2;

    // Recorrer el cuerpo del RUT de derecha a izquierda
    for (let i = body.length - 1; i >= 0; i--) {
        // Multiplicar dígito por el factor (2, 3, 4, 5, 6, 7, 2, ...)
        sum += parseInt(body.charAt(i), 10) * multiplier;
        
        // Incrementar el multiplicador
        multiplier++;
        
        // Reiniciar el ciclo de multiplicadores (2 a 7)
        if (multiplier === 8) {
            multiplier = 2;
        }
    }

    const calculatedDvValue = 11 - (sum % 11);
    let expectedDv: string;

    // 4. Determinar el dígito verificador esperado
    if (calculatedDvValue === 11) {
        expectedDv = '0'; // Si el resto es 0, el DV es 0
    } else if (calculatedDvValue === 10) {
        expectedDv = 'K'; // Si el resto es 1, el DV es K
    } else {
        expectedDv = calculatedDvValue.toString(); // Si el resto es 2-9, el DV es ese número
    }

    // 5. Comparar el DV calculado con el DV ingresado
    return expectedDv === dv;
};
