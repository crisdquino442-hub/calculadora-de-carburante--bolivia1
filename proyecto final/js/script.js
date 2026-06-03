   // Precios oficiales YPFB / ANH (en bolivianos por litro o m³)
        // anterior = precio subvencionado histórico | nuevo = precio vigente 2026
        const precios = {
            gasolina_especial: { anterior: 3.74,  nuevo: 6.96,  unidad: 'L',  nombre: 'Gasolina Especial' },
            diesel_oil:        { anterior: 3.72,  nuevo: 9.80,  unidad: 'L',  nombre: 'Diésel Oíl' },
            gasolina_premium:  { anterior: 5.27,  nuevo: 11.00, unidad: 'L',  nombre: 'Gasolina Premium+' },
            diesel_uls:        { anterior: 3.72,  nuevo: 10.60, unidad: 'L',  nombre: 'Diésel ULS' },
            super_etanol:      { anterior: 3.74,  nuevo: 8.28,  unidad: 'L',  nombre: 'Super Etanol 92' },
            gnv:               { anterior: 1.80,  nuevo: 2.73,  unidad: 'm³', nombre: 'GNV Nacional' },
            gasolina_int:      { anterior: 3.74,  nuevo: 8.68,  unidad: 'L',  nombre: 'Gasolina Especial Internacional' },
            diesel_int:        { anterior: 3.72,  nuevo: 9.80,  unidad: 'L',  nombre: 'Diésel Oíl Internacional' },
            gnv_int:           { anterior: 1.80,  nuevo: 2.95,  unidad: 'm³', nombre: 'GNV Internacional' },
        };

        // Actualiza la referencia de precio al cambiar el select
        // Oculta el resultado si el usuario cambia algún campo
        function ocultarResultado() {
            document.getElementById('resultado').style.display = 'none';
        }

        // Actualiza el precio de referencia al cambiar el tipo de carburante
        function actualizarReferencia() {
            var tipo = document.getElementById('tipo-carburante').value;
            var p = precios[tipo];
            document.getElementById('precio-actual').textContent = p.nuevo.toFixed(2).replace('.', ',') + ' Bs';
            ocultarResultado();
        }

        function calcular() {

            // 1. Leer los valores del formulario
            var tipo        = document.getElementById('tipo-carburante').value;
            var tanque      = parseFloat(document.getElementById('tipo-vehiculo').value);   // litros del tanque
            var nivelCarga  = parseFloat(document.getElementById('nivel-carga').value);     // fracción: 0.25, 0.5, 0.75 o 1.0
            var vecesSemana = parseFloat(document.getElementById('veces-semana').value);    // veces por semana

            // 2. Calcular cuántos litros carga cada vez
            var litrosPorCarga = tanque * nivelCarga;

            // 3. Calcular litros totales al mes (veces/semana × 4 semanas)
            var litrosMes = litrosPorCarga * vecesSemana * 4;

            var p = precios[tipo];

            // 4. Calcular gastos
            var gastoAntes  = litrosMes * p.anterior;
            var gastoNuevo  = litrosMes * p.nuevo;
            var diferencia  = gastoNuevo - gastoAntes;
            var porcentaje  = ((diferencia / gastoAntes) * 100).toFixed(1);

            // 5. Mostrar valores
            document.getElementById('val-anterior').textContent   = gastoAntes.toFixed(2) + ' Bs';
            document.getElementById('val-nuevo').textContent      = gastoNuevo.toFixed(2) + ' Bs';
            document.getElementById('val-diferencia').textContent = '+' + diferencia.toFixed(2) + ' Bs';

            // 6. Mensaje según nivel de impacto
            var mensajeEl = document.getElementById('mensaje-alerta');
            mensajeEl.className = 'mensaje-alerta';

            if (diferencia > 1500) {
                mensajeEl.classList.add('alerta-critico');
                mensajeEl.textContent = '⚠ Impacto CRÍTICO: pagas ' + porcentaje + '% más al mes (' + p.nombre + '). Considera revisar tu presupuesto urgentemente.';
            } else if (diferencia > 400) {
                mensajeEl.classList.add('alerta-moderado');
                mensajeEl.textContent = '◆ Impacto MODERADO: pagas ' + porcentaje + '% más al mes (' + p.nombre + '). Es un gasto significativo que afecta tu economía.';
            } else {
                mensajeEl.classList.add('alerta-leve');
                mensajeEl.textContent = '✓ Impacto LEVE: pagas ' + porcentaje + '% más al mes (' + p.nombre + '). El alza es notable pero manejable.';
            }

            // 7. Mostrar resultado
            var resultado = document.getElementById('resultado');
            resultado.style.display = 'block';
            resultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
