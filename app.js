    // El principal objetivo de este desafío es fortalecer tus habilidades en lógica de programación. Aquí deberás desarrollar la lógica para resolver el problema.
    // Array para almacenar los nombres de los amigos
    let amigos = [];
    // Función para agregar un amigo
    function agregarAmigo() {
        // Capturar el valor del campo de entrada
        const input = document.getElementById('amigo');  
        const nombre = input.value.trim();  // Eliminar espacios extra

        // Validar si el campo está vacío
        if (nombre === '') {
            alert('Por favor, inserte un nombre.');  // Mostrar un mensaje si está vacío
            return;  // Salir de la función si no es válido
        }

        // Si el valor es válido, agregarlo al array de amigos
        amigos.push(nombre);

        // Limpiar el campo de entrada
        input.value = '';

        // Mostrar la lista actualizada
        mostrarLista();
    }
        // Función para mostrar la lista de amigos
    function mostrarLista() {
        const lista = document.getElementById('listaAmigos'); // Selecciona el elemento de la lista en el HTML
        lista.innerHTML = ''; // Limpiar la lista antes de agregar nuevos elementos

    
// ====== CONFIG BÁSICA ======
let anguloActual = 0;
let girando = false;
let canvas, ctx;

// Si ya tienes esta variable, elimina esta línea:
window.listaAmigos = window.listaAmigos || []; // asegúrate que exista

// Inserta dinámicamente el canvas debajo del botón "Sortear amigo"
(function insertarCanvasBajoBoton() {
  const boton = document.querySelector(".button-draw");
  if (!boton) return; // Si no encuentra el botón, no hacemos nada

  // Contenedor de la ruleta
  const contenedor = document.createElement("div");
  contenedor.className = "ruleta-container";
  contenedor.style.marginTop = "20px";
  contenedor.style.textAlign = "center";

  // Canvas
  canvas = document.createElement("canvas");
  canvas.id = "ruleta";
  canvas.width = 400;
  canvas.height = 400;

  contenedor.appendChild(canvas);
  boton.parentElement.insertAdjacentElement("afterend", contenedor);

  ctx = canvas.getContext("2d");

  // Dibuja la ruleta vacía o con los nombres existentes
  if ((window.listaAmigos || []).length > 0) {
    dibujarRuleta(window.listaAmigos);
  } else {
    dibujarRuleta(["—"]);
  }

  // Dibujar un marcador (triangulito arriba)
  dibujarPuntero();
})();

// ====== DIBUJO DE RULETA ======
function dibujarRuleta(nombres) {
  if (!canvas || !ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const radio = Math.min(w, h) * 0.45;

  ctx.clearRect(0, 0, w, h);

  const total = Math.max(nombres.length, 1);
  const angulo = (2 * Math.PI) / total;

  // Disco
  for (let i = 0; i < total; i++) {
    ctx.beginPath();
    ctx.fillStyle = `hsl(${(i * 360) / total}, 70%, 60%)`;
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radio, angulo * i, angulo * (i + 1));
    ctx.lineTo(cx, cy);
    ctx.fill();

    // Texto del segmento
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angulo * i + angulo / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#111";
    ctx.font = "15px Arial"; // <- aquí el "px" es correcto dentro de una string JS
    ctx.fillText(nombres[i], radio - 10, 5);
    ctx.restore();
  }

  // Borde
  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#333";
  ctx.arc(cx, cy, radio, 0, 2 * Math.PI);
  ctx.stroke();
}

// Puntero (triángulo) arriba
function dibujarPuntero() {
  if (!canvas || !ctx) return;
  const w = canvas.width;
  const cx = w / 2;
  const top = 10;

  ctx.save();
  ctx.fillStyle = "#E53935";
  ctx.beginPath();
  ctx.moveTo(cx, top);         // punta
  ctx.lineTo(cx - 12, top + 24);
  ctx.lineTo(cx + 12, top + 24);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ====== ANIMACIÓN ======
function animarRuleta(callback) {
  if (girando) return;
  if (!window.listaAmigos || window.listaAmigos.length === 0) {
    alert("Agrega al menos un nombre.");
    return;
  }
  girando = true;

  let velocidad = Math.random() * 0.2 + 0.35; // velocidad inicial
  const freno = 0.995; // desaceleración por frame

  function paso() {
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    anguloActual += velocidad;
    velocidad *= freno;

    // Rotamos el canvas para girar la ruleta
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(anguloActual);
    ctx.translate(-w / 2, -h / 2);
    dibujarRuleta(window.listaAmigos);
    ctx.restore();

    dibujarPuntero();

    if (velocidad > 0.002) {
      requestAnimationFrame(paso);
    } else {
      girando = false;
      const ganador = ganadorPorAngulo();
      if (typeof callback === "function") callback(ganador);
    }
  }

  requestAnimationFrame(paso);
}

// Determina el nombre bajo el puntero superior (0 radianes)
function ganadorPorAngulo() {
  const total = window.listaAmigos.length;
  const anguloSegmento = (2 * Math.PI) / total;

  // Convertimos el ángulo acumulado a una posición "arriba" del canvas (puntero)
  const pos = (2 * Math.PI - (anguloActual % (2 * Math.PI))) % (2 * Math.PI);
  const index = Math.floor(pos / anguloSegmento) % total;

  return window.listaAmigos[index];
}

// ====== INTEGRACIÓN CON TU sortearAmigo() ======
// Si ya existe tu función, solo llama a animarRuleta ahí.
// Si no existe, creamos una por defecto:
if (typeof window.sortearAmigo !== "function") {
  window.sortearAmigo = function () {
    animarRuleta((ganador) => {
      const salida = document.getElementById("resultado");
      if (salida) {
        salida.textContent = "El amigo secreto es: " + ganador;
      } else {
        alert("El amigo secreto es: " + ganador);
      }
    });
  };
}

// ====== OPCIONAL: Redibujar ruleta cuando cambie la lista ======
// Llama a esta función cada vez que agregues/elmines nombres.
window.actualizarRuleta = function () {
  if (!canvas || !ctx) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
  anguloActual = 0; // reset
  dibujarRuleta(window.listaAmigos.length ? window.listaAmigos : ["—"]);
  dibujarPuntero();
  ctx.restore();
};


        // Iterar sobre el array de amigos
        for (let i = 0; i < amigos.length; i++) {
            const amigo = amigos[i];

            // Crear un elemento <li> para cada amigo
            const li = document.createElement('li');
            li.textContent = amigo;  // Asignar el nombre del amigo como texto del <li>

            // Agregar el <li> a la lista en el HTML
            lista.appendChild(li);
        }
    }
    // Función para seleccionar un amigo al azar y mostrarlo
    function sortearAmigo() {
        // Validar que haya amigos disponibles
        if (amigos.length === 0) {
            alert('No hay amigos para sortear.');
            return;
        }

        // Generar un índice aleatorio
        const indiceAleatorio = Math.floor(Math.random() * amigos.length);

        // Obtener el nombre sorteado
        const amigoSorteado = amigos[indiceAleatorio];

        // Mostrar el resultado en el elemento con id 'resultado'
        document.getElementById('resultado').innerHTML = `Amigo sorteado: <strong>${amigoSorteado}</strong>`;
    }
