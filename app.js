
// ===============================================
// LÓGICA BASE DEL DESAFÍO
// ===============================================

// Array para almacenar los nombres de los amigos
let amigos = [];

// Función para agregar un amigo
function agregarAmigo() {
  // Capturar el valor del campo de entrada
  const input = document.getElementById('amigo');
  const nombre = input.value.trim(); // Eliminar espacios extra

  // Validar si el campo está vacío
  if (nombre === '') {
    alert('Por favor, inserte un nombre.');
    return;
  }

  // Si el valor es válido, agregarlo al array de amigos
  amigos.push(nombre);

  // Limpiar el campo de entrada
  input.value = '';

  // Mostrar la lista actualizada y refrescar la ruleta
  mostrarLista();
  actualizarRuleta();
}

// Función para mostrar la lista de amigos
function mostrarLista() {
  const lista = document.getElementById('listaAmigos'); // Selecciona el elemento de la lista en el HTML
  if (!lista) return;
  lista.innerHTML = ''; // Limpiar la lista antes de agregar nuevos elementos

  // Render simple de nombres
  amigos.forEach((nombre, idx) => {
    const li = document.createElement('li');
    li.textContent = nombre;

    // (Opcional) botón para eliminar
    const btn = document.createElement('button');
    btn.textContent = '❌';
    btn.style.marginLeft = '8px';
    btn.style.cursor = 'pointer';
    btn.setAttribute('aria-label', `Eliminar ${nombre}`);
    btn.addEventListener('click', () => {
      amigos.splice(idx, 1);
      mostrarLista();
      actualizarRuleta();
    });

    li.appendChild(btn);
    lista.appendChild(li);
  });
}

// ===============================================
// RULETA EN CANVAS (se inserta dinámicamente)
// ===============================================

let anguloActual = 0;
let girando = false;
let canvas, ctx;

// Inserta dinámicamente el canvas debajo del botón "Sortear amigo"
(function insertarCanvasBajoBoton() {
  const botonSortear = document.querySelector('.button-draw'); // ajusta si tu clase cambia
  if (!botonSortear) return;

  // Contenedor
  const contenedor = document.createElement('div');
  contenedor.className = 'ruleta-container';
  contenedor.style.marginTop = '20px';
  contenedor.style.textAlign = 'center';

  // Canvas
  canvas = document.createElement('canvas');
  canvas.id = 'ruleta';
  canvas.width = 400;
  canvas.height = 400;

  contenedor.appendChild(canvas);
  // Inserta justo debajo del contenedor del botón
  botonSortear.parentElement.insertAdjacentElement('afterend', contenedor);

  ctx = canvas.getContext('2d');

  // Dibujo inicial
  dibujarRuleta(amigos.length ? amigos : ['—']);
  dibujarPuntero();
})();

function dibujarRuleta(nombres) {
  if (!canvas || !ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const radio = Math.min(w, h) * 0.45;

  // Limpiar
  ctx.clearRect(0, 0, w, h);

  // Fondo
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, w, h);

  const total = Math.max(nombres.length, 1);
  const angulo = (2 * Math.PI) / total;

  // Sectores
  for (let i = 0; i < total; i++) {
    ctx.beginPath();
    ctx.fillStyle = `hsl(${(i * 360) / total}, 70%, 60%)`;
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radio, angulo * i, angulo * (i + 1));
    ctx.lineTo(cx, cy);
    ctx.fill();

    // Texto del sector
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angulo * i + angulo / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#111';
    ctx.font = '15px Arial'; // <- en Canvas es string: "15px Arial"
    ctx.fillText(nombres[i], radio - 10, 5);
    ctx.restore();
  }

  // Borde
  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#333';
  ctx.arc(cx, cy, radio, 0, 2 * Math.PI);
  ctx.stroke();
}

// Puntero (triángulo rojo arriba)
function dibujarPuntero() {
  if (!canvas || !ctx) return;
  const w = canvas.width;
  const cx = w / 2;
  const top = 10;

  ctx.save();
  ctx.fillStyle = '#E53935';
  ctx.beginPath();
  ctx.moveTo(cx, top);
  ctx.lineTo(cx - 12, top + 24);
  ctx.lineTo(cx + 12, top + 24);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Anima la ruleta y devuelve el ganador por callback
function animarRuleta(callback) {
  if (girando) return;
  if (!amigos || amigos.length === 0) {
    alert('Agrega al menos un nombre.');
    return;
  }
  girando = true;

  let velocidad = Math.random() * 0.2 + 0.35; // velocidad inicial
  const freno = 0.995; // desaceleración

  function paso() {
    const w = canvas.width;
    const h = canvas.height;

    // Limpiar frame
    ctx.clearRect(0, 0, w, h);

    // Actualizar ángulo y velocidad
    anguloActual += velocidad;
    velocidad *= freno;

    // Girar y dibujar ruleta
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(anguloActual);
    ctx.translate(-w / 2, -h / 2);
    dibujarRuleta(amigos);
    ctx.restore();

    // Puntero fijo
    dibujarPuntero();

    if (velocidad > 0.002) {
      requestAnimationFrame(paso);
    } else {
      girando = false;
      const ganador = ganadorPorAngulo();
      if (typeof callback === 'function') callback(ganador);
    }
  }

  requestAnimationFrame(paso);
}

// Determina el índice del sector que queda bajo el puntero superior
function ganadorPorAngulo() {
  const total = amigos.length;
  const anguloSegmento = (2 * Math.PI) / total;

  // Convertimos el ángulo acumulado a la posición "arriba" (puntero)
  const pos = (2 * Math.PI - (anguloActual % (2 * Math.PI))) % (2 * Math.PI);
  const index = Math.floor(pos / anguloSegmento) % total;

  return amigos[index];
}

// ===============================================
// INTEGRACIÓN: función sortearAmigo()
// ===============================================
function sortearAmigo() {
  animarRuleta((ganador) => {
    const salida = document.getElementById('resultado');
    if (salida) {
      salida.textContent = 'El amigo secreto es: ' + ganador;
    } else {
      alert('El amigo secreto es: ' + ganador);
    }
  });
}

// Exponer funciones si tu HTML las llama por atributo onclick
window.agregarAmigo = agregarAmigo;
window.sortearAmigo = sortearAmigo;

// Redibujar ruleta cuando cambie la lista manualmente
function actualizarRuleta() {
  if (!canvas || !ctx) return;
  // Reset de transformaciones por si veníamos de una animación
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  anguloActual = 0;
  dibujarRuleta(amigos.length ? amigos : ['—']);
  dibujarPuntero();
  ctx.restore();
}
