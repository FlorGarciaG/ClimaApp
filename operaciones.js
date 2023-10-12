//Programa de clima estadisticas
//Entrega final
var temperaturas = [];
var Dias = [];
var promediodiario = [];
var maxima;
var minimo;
var promediosemanal;
var estadistica = document.getElementById('estadisticas');
function GuardarDatos() {
    var archivo = document.getElementById("inputGroupFile04");
    var excel = archivo.files[0];

    if (excel) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, { type: 'binary' });
            var sheetName = workbook.SheetNames[0];

            // Acceder a la hoja de cálculo
            var sheet = workbook.Sheets[sheetName];

            // Acceder a los datos de la hoja de cálculo
            var datos = XLSX.utils.sheet_to_json(sheet);

            // Extraer temperaturas y días
            datos.forEach(function (row) {
                var dia = row.Dias;
                var temp1 = row.Temp1;
                var temp2 = row.Temp2;
                var temp3 = row.Temp3;
                Dias.push(dia);
                temperaturas.push([temp1, temp2, temp3]);
            });

            // Validar si los datos son nulos o indefinidos antes de generar el gráfico
            if (!Dias.includes(null) && !Dias.includes(undefined) && !temperaturas.some(subArray => subArray.some(value => value === null || value === undefined))) {
                CalcualarPromedioDiario();
                CalcualarPromedioSemanal();
                CalcualarMaxima();
                CalcualarMinima();
                GenerarGrafico();
            } else {
                alert("No se puede generar el gráfico ni las estadisticas, datos incorrectos");
            }
        };

        reader.readAsBinaryString(excel);
    } else {
        alert("Seleccionar un archivo Excel válido.");
    }
}



function CalcualarPromedioDiario() {
    for (var i = 0; i < temperaturas.length; i += 1) {
        var temperaturaDia = temperaturas.slice(i, i + 1)[0];
        //console.log(temperaturaDia);
        var suma = temperaturaDia.map(Number).reduce(function (a, b) { return a + b; }, 0);
        //console.log("Suma de temperaturas: " + suma);
        promedio = Math.round(suma / 3);
        promediodiario.push(promedio);
    }
    //console.log(promediodiario);
}


function CalcualarPromedioSemanal() {
    var suma = promediodiario.map(Number).reduce(function (a, b) { return a + b; }, 0);
    promediosemanal = Math.round(suma / 7);
    //console.log(promediosemanal);
    
    estadistica.innerHTML += "El promedio Semanal de la temperatura es: "+promediosemanal+"°C<br>";
}

function CalcualarMaxima() {
    var temperaturasNumericas = temperaturas.map(function (temperaturaDia) {
        return temperaturaDia.map(Number);
    });
    maxima = Math.max.apply(null, temperaturasNumericas.flat());
    var indice = temperaturasNumericas.flat().indexOf(maxima);
    var diaMaximo = Dias[Math.floor(indice/3)];

    //console.log(maxima);
    estadistica.innerHTML += "La maxima temperatura que se registro es  "+maxima+"°C el día " + diaMaximo+ "<br>";

}

function CalcualarMinima() {
    var temperaturasNumericas = temperaturas.map(function (temperaturaDia) {
        return temperaturaDia.map(Number);
    });
    minimo = Math.min.apply(null, temperaturasNumericas.flat());
    var indice = temperaturasNumericas.flat().indexOf(minimo);
    var diaMinimo = Dias[Math.floor(indice/3)];
    //console.log(minimo);
    estadistica.innerHTML += "La minima temperatura que se registro es  "+minimo+"°C el día " + diaMinimo+ "<br>";
}


function GenerarGrafico() {
    var ctx = document.getElementById('graficadatosIniciales').getContext('2d');
    var datos = {
        labels: Dias, //Eje x
        datasets: [
            {
                label: 'Temperatura en la mañana',
                data: temperaturas.map(function (row) { return row[0]; }),
                borderColor: '#005BC4',
                borderWidth: 2,
                fill: false // No rellenar el área bajo la línea
            },
            {
                label: 'Temperatura al medio día',
                data: temperaturas.map(function (row) { return row[1]; }),
                borderColor: '#E02525',
                borderWidth: 2,
                fill: false
            },
            {
                label: 'Temperatura en la noche',
                data: temperaturas.map(function (row) { return row[2]; }),
                borderColor: '#BA9F10',
                borderWidth: 2,
                fill: false
            },
            {
                label: 'Promedio Diario',
                data: promediodiario,
                borderColor: '#579B71',
                borderWidth: 2,
                fill: false
            }
        ]
    };
    
    //Crea las opciones del grafico
    var options = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Días'
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Temperaturas'
                }
            }
        }
    };

    //Genera el grafico
    var myChart = new Chart(ctx, {
        type: 'line',
        data: datos,
        options: options
    });
}

