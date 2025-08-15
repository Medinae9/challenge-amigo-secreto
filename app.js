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

        // Mostrar la lista actualizada (puedes llamar a una función que actualice la UI)
        mostrarLista();
    }
        // Función para mostrar la lista de amigos
    function mostrarLista() {
        const lista = document.getElementById('listaAmigos'); // Selecciona el elemento de la lista en el HTML
        lista.innerHTML = ''; // Limpiar la lista antes de agregar nuevos elementos

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
