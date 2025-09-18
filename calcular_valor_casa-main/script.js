// =========================
// Genera un mensaje explicativo sobre los valores comparados con la media
// =========================
function calcularExplicacion(precio, tamanio, distancia) {
    let mensaje = "";

    // Comparar precio contra la media (1075)
    if (precio > 1075) {
        mensaje += `<div class="bad">El precio de ${precio} está por encima de la media (1075).</div>`;
    } else {
        mensaje += `<div class="good">El precio de ${precio} está por debajo de la media (1075).</div>`;
    }

    // Comparar tamaño contra la media (63 m²)
    if (tamanio > 63) {
        mensaje += `<br><div class="good">El tamaño de ${tamanio} m² está por encima de la media (63 m²).</div>`;
    } else {
        mensaje += `<br><div class="bad">El tamaño de ${tamanio} m² está por debajo de la media (63 m²).</div>`;
    }

    // Comparar distancia contra la media (26.5 min)
    if (distancia > 26.5) {
        mensaje += `<br><div class="bad">La distancia de ${distancia} min está por encima de la media (26.5 min).</div>`;
    } else {
        mensaje += `<br><div class="good">La distancia de ${distancia} min está por debajo de la media (26.5 min).</div>`;
    }

    return mensaje; // Devuelve el texto con HTML incluido
}

// =========================
// Calcula una puntuación global de la casa
// usando normalización y pesos distintos
// =========================
function calcularValor(precio, tamanio, distancia) {
    // Normalizar valores usando min-max → resultado entre 0 y 1
    const precio_norm = (precio - 780) / (1200 - 780);
    const tamanio_norm = (tamanio - 23) / (128 - 23);
    const distancia_norm = (distancia - 10) / (40 - 10);

    // Escalar valores aplicando pesos
    const precio_escalado = precio_norm * (-0.6); // precio alto = malo
    const tamanio_escalado = tamanio_norm * 1.2; // tamaño alto = bueno
    const distancia_escalado = distancia_norm * (-1.4); // distancia alta = mala

    // Sumar todos los factores → puntuación final
    const result = precio_escalado + tamanio_escalado + distancia_escalado;

    return result;
}

// =========================
// Calcula el percentil según el valor obtenido
// =========================
function calcularPercentil(valor) {
    // Lista de umbrales de valor y su percentil asociado
    percentiles = [
        [0.28, "2%"],
        [0.05, "8%"],
        [-0.18, "16%"],
        [-0.4, "35%"],
        [-0.63, "51%"],
        [-0.85, "66%"],
        [-1.08, "85%"]
    ];

    // Recorrer los percentiles y devolver el primero que cumpla
    for (let percentil of percentiles) {
        if (valor > percentil[0]) {
            return percentil[1]; // Devuelve el percentil en texto (ej: "16%")
        }
    }

    return "99.9%"; // Si no entra en ningún rango → peor caso
}

// =========================
// Función principal: toma valores del formulario, calcula y muestra
// =========================
function performOperation() {
    // Obtener datos desde inputs del DOM
    const distancia = parseFloat(document.getElementById('distancia').value);
    const precio = parseFloat(document.getElementById('precio').value);
    const tamanio = parseFloat(document.getElementById('tamanio').value);

    // Llamar a las funciones de cálculo
    const result = calcularValor(precio, tamanio, distancia);
    const explicacion = calcularExplicacion(precio, tamanio, distancia);
    const percentil = calcularPercentil(result);

    // Mostrar resultados en el DOM
    document.getElementById('percentil').innerHTML = percentil;
    document.getElementById('result').innerText = `Result: ${result}`;
    document.getElementById('explicacion').innerHTML = explicacion;

    // Dar color según el valor
    document.getElementById('percentil').className = "bad"; // por defecto malo
    if (result > -0.4) {
        document.getElementById('percentil').className = "mid"; // intermedio
    }
    if (result > -0.18) {
        document.getElementById('percentil').className = "good"; // bueno
    }
}