/* =================================================
   CONTIENE GALERIA DE IMAGENES Y LIGHTBOX
   CARGA LA PAGINA SEGUN EL (?id=productoX)
   CARGA LAS IMAGENES DESDE EL JSON CORRESPONDIENTE
   ================================================= */

// OBTIENE EL PARAMENTRO (PAGINA) ?id=productoX
// LEE LOS PARAMETROS DE LA URL
const params = new URLSearchParams(window.location.search);

//OBTIENE EL VALOR DEL PARAMETRO "ID"
const paginaId = params.get("id");

// SI NO HAY PRODUCTO SE DETIENE
if (!paginaId) {
    document.getElementById("galeria").innerHTML =
        "<p>No se especificó la página.</p>";
    //MENSAJE DE ERROR
    throw new Error("Página no definida");
}

/* --------------- Construye la ruta al archivo JSON---------------*/

const rutaJSON = `data/${paginaId}.json`;

// FETCH PARA LEER EL ARCHIVO JSON
fetch(rutaJSON)
    .then(response => {
        // SI EL ARCHIVO NO EXISTE O HAY ALGUN ERROR
        if (!response.ok) {
            throw new Error("No se pudo cargar el JSON");
        }
        // SE CONVIERTE A OBJETO JS
        return response.json();
    })
    // CUANDO EL JS ESTA LISTO
    .then(data => cargarGaleria(data))
    // SI OCURRE ALGUN ERROR
    .catch(error => {
        console.error(error);
        document.getElementById("galeria").innerHTML =
            "<p>Error al cargar imagen.</p>";
    });

/* =====================================
   CONTIENE LA SELECCION DE IMAGENES
   ===================================== */
function cargarGaleria(data) {

    //HACE REFERENCIA A LOS ELEMENTOS DEL HTML

    //CONTENEDOR DONDE SE INSERTAN LAS MINIATURAS
    const galeria = document.getElementById("galeria");
    
    //CONTENEDRO DONDE SE INSERTAN LOS LIGHTBOX
    const lightboxContainer = document.getElementById("lightbox-container");

    //TITULO DEL ENCABEZADO (H1)
    const titulo = document.getElementById("titulo-producto");



    // TITULO QUE VIENE DEL JSON
    titulo.textContent = data.titulo;

    // RECORRER LAS IMAGENES DENTRO DEL JSON
    data.imagenes.forEach((img, index) => {

        //ID DEL LIGHTBOX
        const id = `img${index}`;

        /* -------- MINIATURA -------- */
        // ESTO ES IGUAL A <a href="#img0">
        const enlace = document.createElement("a");
        enlace.href = `#${id}`;

        // ESTO ES IGUAL A <img src="..." alt="...">
        const imagen = document.createElement("img");
        imagen.src = img.src;
        imagen.alt = img.texto;
        imagen.loading = "lazy"; // CARGAR SOLO LAS IMAGENES EN PANTALLA

        // ESTO ES IGUAL A <p>Descripción</p>
        const texto = document.createElement("p");
        texto.textContent = img.texto;

        // SE INSERTA img + TEXTO DENTRO DEL <a>
        enlace.appendChild(imagen);
        enlace.appendChild(texto);

        // SE INSERTA <a> DENTRO D ELA GALERIA
        galeria.appendChild(enlace);

/* ---------------------------- Lightbox --------------------------- */
        // ES IGUAL A <div class="lightbox" id="img0">
        const lightbox = document.createElement("div");
        lightbox.className = "lightbox";
        lightbox.id = id;

        // CONTENIDO QUE APARECE AL AGRANDAR LA IMAGEN
        lightbox.innerHTML = `
            <a href="#">×</a>
            <img src="${img.src}" alt="${img.texto}">
            <p>${img.texto}</p>
        `;
        
        // CONTENEDOR DEL LIGHTBOX
        lightboxContainer.appendChild(lightbox);
    });
}