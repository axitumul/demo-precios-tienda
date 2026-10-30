// Busca una casilla de la página y lee el número que contiene.
function leerNumero(id) {
    const casilla = document.getElementById(id);

    if (casilla.value.trim() === "") {
        throw new Error("Completa todas las casillas antes de continuar.");
    }

    const numero = Number(casilla.value);

    if (!Number.isFinite(numero)) {
        throw new Error("Todas las casillas deben tener números válidos.");
    }

    return numero;
}

// Lee las cantidades y los totales ingresados en la tabla.
function leerCompras() {
    const matriz = [
        [
            leerNumero("cantidad1Cuaderno"),
            leerNumero("cantidad1Lapicero"),
            leerNumero("cantidad1Borrador")
        ],
        [
            leerNumero("cantidad2Cuaderno"),
            leerNumero("cantidad2Lapicero"),
            leerNumero("cantidad2Borrador")
        ],
        [
            leerNumero("cantidad3Cuaderno"),
            leerNumero("cantidad3Lapicero"),
            leerNumero("cantidad3Borrador")
        ]
    ];

    const totales = [
        leerNumero("total1"),
        leerNumero("total2"),
        leerNumero("total3")
    ];

    return { matriz, totales };
}
// Calcula un determinante 3 × 3 y también prepara sus pasos.
function calcularDeterminanteConPasos(matriz, metodo, nombre) {
    const formato = numero =>
        Number(numero.toFixed(2)).toString();

    if (metodo === "sarrus") {
        const diagonalesQueSeSuman = [
            [matriz[0][0], matriz[1][1], matriz[2][2]],
            [matriz[0][1], matriz[1][2], matriz[2][0]],
            [matriz[0][2], matriz[1][0], matriz[2][1]]
        ];

        const diagonalesQueSeRestan = [
            [matriz[0][2], matriz[1][1], matriz[2][0]],
            [matriz[0][0], matriz[1][2], matriz[2][1]],
            [matriz[0][1], matriz[1][0], matriz[2][2]]
        ];

        const productosQueSeSuman = diagonalesQueSeSuman.map(
            diagonal => diagonal[0] * diagonal[1] * diagonal[2]
        );

        const productosQueSeRestan = diagonalesQueSeRestan.map(
            diagonal => diagonal[0] * diagonal[1] * diagonal[2]
        );

        const sumaPositiva = productosQueSeSuman.reduce(
            (suma, producto) => suma + producto,
            0
        );

        const sumaNegativa = productosQueSeRestan.reduce(
            (suma, producto) => suma + producto,
            0
        );

        function escribirDiagonales(diagonales, productos) {
            return diagonales.map((diagonal, indice) =>
                `(${formato(diagonal[0])})(${formato(diagonal[1])})` +
                `(${formato(diagonal[2])}) = ${formato(productos[indice])}`
            ).join("\n");
        }

        return {
            valor: sumaPositiva - sumaNegativa,
            pasos:
                `${nombre} por regla de Sarrus\n` +
                `Diagonales que se suman:\n` +
                `${escribirDiagonales(diagonalesQueSeSuman, productosQueSeSuman)}\n` +
                `Suma = ${formato(sumaPositiva)}\n\n` +
                `Diagonales que se restan:\n` +
                `${escribirDiagonales(diagonalesQueSeRestan, productosQueSeRestan)}\n` +
                `Suma = ${formato(sumaNegativa)}\n\n` +
                `${nombre} = ${formato(sumaPositiva)} − ` +
                `${formato(sumaNegativa)} = ` +
                `${formato(sumaPositiva - sumaNegativa)}`
        };
    }

    const menor1 =
        matriz[1][1] * matriz[2][2] -
        matriz[1][2] * matriz[2][1];

    const menor2 =
        matriz[1][0] * matriz[2][2] -
        matriz[1][2] * matriz[2][0];

    const menor3 =
        matriz[1][0] * matriz[2][1] -
        matriz[1][1] * matriz[2][0];

    const valor =
        matriz[0][0] * menor1 -
        matriz[0][1] * menor2 +
        matriz[0][2] * menor3;

    return {
        valor,
        pasos:
            `${nombre} por expansión de cofactores en la primera fila\n` +
            `Signos de la primera fila: +, −, +\n\n` +
            `Menor 1: (${formato(matriz[1][1])} × ${formato(matriz[2][2])}) − ` +
            `(${formato(matriz[1][2])} × ${formato(matriz[2][1])}) = ` +
            `${formato(menor1)}\n` +
            `Menor 2: (${formato(matriz[1][0])} × ${formato(matriz[2][2])}) − ` +
            `(${formato(matriz[1][2])} × ${formato(matriz[2][0])}) = ` +
            `${formato(menor2)}\n` +
            `Menor 3: (${formato(matriz[1][0])} × ${formato(matriz[2][1])}) − ` +
            `(${formato(matriz[1][1])} × ${formato(matriz[2][0])}) = ` +
            `${formato(menor3)}\n\n` +
            `${nombre} = (${formato(matriz[0][0])} × ${formato(menor1)}) − ` +
            `(${formato(matriz[0][1])} × ${formato(menor2)}) + ` +
            `(${formato(matriz[0][2])} × ${formato(menor3)}) = ${formato(valor)}`
    };
}
// Construye las ecuaciones con los números actuales de la tabla.
function actualizarSistema() {
    try {
        const { matriz, totales } = leerCompras();
        const variables = ["x", "y", "z"];

        const ecuaciones = matriz.map((fila, indice) => {
            const ladoIzquierdo = fila
                .map((coeficiente, columna) =>
                    `${coeficiente}${variables[columna]}`
                )
                .join(" + ");

            return `${ladoIzquierdo} = ${totales[indice]}`;
        });

        document.getElementById("sistema").textContent =
            ecuaciones.join("\n");

        document.getElementById("procedimiento").textContent =
            `Matriz de cantidades A:\n${matriz
                .map(fila => `[ ${fila.join("   ")} ]`)
                .join("\n")}\n\n` +
            `Vector de totales b:\n[ ${totales.join("   ")} ]ᵀ`;
    } catch (error) {
        document.getElementById("sistema").textContent = error.message;
    }
}

// Cada vez que cambie una casilla, actualiza las ecuaciones.
document.querySelectorAll("#aplicacion input").forEach(casilla => {
    casilla.addEventListener("input", actualizarSistema);
});

// Muestra las ecuaciones al abrir la página.
actualizarSistema();

function reemplazarColumna(matriz, totales, columna) {
    return matriz.map((fila, indiceFila) =>
        fila.map((valor, indiceColumna) => {
            if (indiceColumna === columna) {
                return totales[indiceFila];
            }

            return valor;
        })
    );
}
function resolverCramer() {
    try {
        const { matriz, totales } = leerCompras();
        const metodo = document.getElementById("metodoDeterminante").value;

        const determinantePrincipal = calcularDeterminanteConPasos(
            matriz,
            metodo,
            "D"
        );

        const matrizX = reemplazarColumna(matriz, totales, 0);
        const determinanteX = calcularDeterminanteConPasos(
            matrizX,
            metodo,
            "Dx"
        );

        const matrizY = reemplazarColumna(matriz, totales, 1);
        const determinanteY = calcularDeterminanteConPasos(
            matrizY,
            metodo,
            "Dy"
        );

        const matrizZ = reemplazarColumna(matriz, totales, 2);
        const determinanteZ = calcularDeterminanteConPasos(
            matrizZ,
            metodo,
            "Dz"
        );

        if (determinantePrincipal.valor === 0) {
            document.getElementById("resultado").textContent =
                "No se puede aplicar Cramer porque D = 0.";
            document.getElementById("procedimiento").textContent =
                "El determinante principal de la matriz es cero.";
            return;
        }

        const x = determinanteX.valor / determinantePrincipal.valor;
        const y = determinanteY.valor / determinantePrincipal.valor;
        const z = determinanteZ.valor / determinantePrincipal.valor;

        document.getElementById("resultado").textContent =
            `Precio del cuaderno (x): ${x}\n` +
            `Precio del lapicero (y): ${y}\n` +
            `Precio del borrador (z): ${z}`;

        document.getElementById("procedimiento").textContent =
            `${determinantePrincipal.pasos}\n\n` +
            `${determinanteX.pasos}\n\n` +
            `${determinanteY.pasos}\n\n` +
            `${determinanteZ.pasos}\n\n` +
            `x = Dx / D = ${determinanteX.valor} / ${determinantePrincipal.valor} = ${x}\n` +
            `y = Dy / D = ${determinanteY.valor} / ${determinantePrincipal.valor} = ${y}\n` +
            `z = Dz / D = ${determinanteZ.valor} / ${determinantePrincipal.valor} = ${z}`;

        const resultadosComprobacion = matriz.map((fila, indice) => {
            const calculado = fila[0] * x + fila[1] * y + fila[2] * z;
            const coincide = Math.abs(calculado - totales[indice]) < 0.000001;

            return (
                `Compra ${indice + 1}: ` +
                `${fila[0]}(${x}) + ${fila[1]}(${y}) + ${fila[2]}(${z}) = ${Number(calculado.toFixed(2))}. ` +
                `${coincide ? "Coincide" : "No coincide"} con el total ingresado: ${totales[indice]}.`
            );
        });


        document.getElementById("comprobacion").textContent =
            resultadosComprobacion.join("\n");
    } catch (error) {
        document.getElementById("resultado").textContent = error.message;
    }
}

document
    .getElementById("resolverCramer")
    .addEventListener("click", resolverCramer);

function resolverGauss() {
    try {
        const { matriz, totales } = leerCompras();

        // Copiamos las cantidades y agregamos el total al final de cada fila.
        // Así formamos la matriz aumentada [A|b].
        const matrizAumentada = matriz.map((fila, indice) => [
            ...fila,
            totales[indice]
        ]);

        let pasos = "Matriz aumentada inicial [A|b]:\n";

        const mostrarMatriz = () =>
            matrizAumentada
                .map(fila =>
                    `[ ${fila.map(valor => Number(valor.toFixed(4))).join("   ")} ]`
                )
                .join("\n");

        pasos += mostrarMatriz();

        // Eliminación hacia adelante: creamos ceros debajo de cada pivote.
        for (let columna = 0; columna < 3; columna++) {
            const pivote = matrizAumentada[columna][columna];

            if (Math.abs(pivote) < 0.0000001) {
                throw new Error(
                    "Gauss encontró un pivote cero. Este sistema necesita otro orden de filas."
                );
            }

            for (let fila = columna + 1; fila < 3; fila++) {
                const factor = matrizAumentada[fila][columna] / pivote;

                pasos +=
                    `\n\nF${fila + 1} ← F${fila + 1} - ` +
                    `(${Number(factor.toFixed(4))})F${columna + 1}\n`;

                for (let j = columna; j < 4; j++) {
                    matrizAumentada[fila][j] =
                        matrizAumentada[fila][j] -
                        factor * matrizAumentada[columna][j];

                    if (Math.abs(matrizAumentada[fila][j]) < 0.0000001) {
                        matrizAumentada[fila][j] = 0;
                    }
                }

                pasos += mostrarMatriz();
            }
        }

        // Sustitución hacia atrás: encontramos primero z, después y y x.
        const soluciones = [0, 0, 0];

        for (let fila = 2; fila >= 0; fila--) {
            let totalRestante = matrizAumentada[fila][3];

            for (let columna = fila + 1; columna < 3; columna++) {
                totalRestante -=
                    matrizAumentada[fila][columna] * soluciones[columna];
            }

            soluciones[fila] = totalRestante / matrizAumentada[fila][fila];
        }

        const [x, y, z] = soluciones;

        pasos += "\n\nDespeje hacia atrás:\n";

        pasos +=
            `Última fila: ${matrizAumentada[2][2].toFixed(4)}z = ` +
            `${matrizAumentada[2][3].toFixed(4)}\n`;

        pasos +=
            `z = ${matrizAumentada[2][3].toFixed(4)} / ` +
            `${matrizAumentada[2][2].toFixed(4)} = ${z.toFixed(2)}\n\n`;

        pasos +=
            `Segunda fila: ${matrizAumentada[1][1].toFixed(4)}y + ` +
            `${matrizAumentada[1][2].toFixed(4)}z = ` +
            `${matrizAumentada[1][3].toFixed(4)}\n`;

        pasos +=
            `y = (${matrizAumentada[1][3].toFixed(4)} - ` +
            `${matrizAumentada[1][2].toFixed(4)} × ${z.toFixed(2)}) / ` +
            `${matrizAumentada[1][1].toFixed(4)} = ${y.toFixed(2)}\n\n`;

        pasos +=
            `Primera fila: ${matrizAumentada[0][0].toFixed(4)}x + ` +
            `${matrizAumentada[0][1].toFixed(4)}y + ` +
            `${matrizAumentada[0][2].toFixed(4)}z = ` +
            `${matrizAumentada[0][3].toFixed(4)}\n`;

        pasos +=
            `x = (${matrizAumentada[0][3].toFixed(4)} - ` +
            `${matrizAumentada[0][1].toFixed(4)} × ${y.toFixed(2)} - ` +
            `${matrizAumentada[0][2].toFixed(4)} × ${z.toFixed(2)}) / ` +
            `${matrizAumentada[0][0].toFixed(4)} = ${x.toFixed(2)}\n`;

        document.getElementById("resultado").textContent =
            `Cuaderno (x): Q${x.toFixed(2)}\n` +
            `Lapicero (y): Q${y.toFixed(2)}\n` +
            `Borrador (z): Q${z.toFixed(2)}`;

        document.getElementById("procedimiento").textContent = pasos;

        const resultadosComprobacion = matriz.map((fila, indice) => {
            const calculado = fila[0] * x + fila[1] * y + fila[2] * z;
            const coincide = Math.abs(calculado - totales[indice]) < 0.000001;

            return (
                `Compra ${indice + 1}: ` +
                `${fila[0]}(${x.toFixed(2)}) + ` +
                `${fila[1]}(${y.toFixed(2)}) + ` +
                `${fila[2]}(${z.toFixed(2)}) = ` +
                `Q${calculado.toFixed(2)}. ` +
                `${coincide ? "Coincide" : "No coincide"} con el total ingresado: ` +
                `Q${totales[indice]}.`
            );
        });

        document.getElementById("comprobacion").textContent =
            resultadosComprobacion.join("\n");
    } catch (error) {
        document.getElementById("resultado").textContent = error.message;
    }
}

document
    .getElementById("resolverGauss")
    .addEventListener("click", resolverGauss);

function entrarComo(rol) {
    document.getElementById("pantallaAcceso").hidden = true;
    document.getElementById("contenidoApp").hidden = false;
    document.getElementById("mensajeUsuario").textContent =
        rol === "profesor"
            ? "Has ingresado como profesor."
            : "Has ingresado como alumno.";
    document.getElementById("seccionProcedimiento").hidden =
        rol === "alumno";
}

document
    .getElementById("entrarAlumno")
    .addEventListener("click", () => entrarComo("alumno"));

document
    .getElementById("entrarProfesor")
    .addEventListener("click", () => {
        document.getElementById("accesoProfesor").hidden = false;
        document.getElementById("claveProfesor").value = "";
        document.getElementById("claveProfesor").focus();
    });

document
    .getElementById("validarClaveProfesor")
    .addEventListener("click", () => {
        const claveIngresada =
            document.getElementById("claveProfesor").value;

        if (claveIngresada === "profe123") {
            alert("Acceso exitoso.");
            document.getElementById("accesoProfesor").hidden = true;
            entrarComo("profesor");
        } else {
            alert("Clave incorrecta. Regresarás al menú principal.");
            document.getElementById("accesoProfesor").hidden = true;
            document.getElementById("pantallaAcceso").hidden = false;
            document.getElementById("claveProfesor").value = "";
        }
    });
document
    .getElementById("claveProfesor")
    .addEventListener("keydown", evento => {
        if (evento.key === "Enter") {
            evento.preventDefault();
            document.getElementById("validarClaveProfesor").click();
        }
    });

document
    .getElementById("cambiarUsuario")
    .addEventListener("click", () => {
        document.getElementById("contenidoApp").hidden = true;
        document.getElementById("pantallaAcceso").hidden = false;
    });