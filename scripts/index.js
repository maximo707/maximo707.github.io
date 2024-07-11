class Disco {
  constructor(data) {
    this.nombre = data.nombre;
    this.artista = data.artista;
    this.precio = data.precio;
    this.imagen = data.imagen;
    this.genero = data.genero;
    this.detalle = data.detalle;
    this.cantidad = data.cantidad || 0;
  }

  crearCard() {
    const discoCard = document.createElement("div");
    discoCard.className = "col-md-4";

    const card = document.createElement("div");
    card.className = "card mb-4";

    const img = document.createElement("img");
    img.src = this.imagen;
    img.className = "card-img-top";
    img.alt = this.nombre;

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const cardTitle = document.createElement("h2");
    cardTitle.className = "card-title";
    cardTitle.textContent = this.nombre;

    const cardTextArtist = document.createElement("p");
    cardTextArtist.className = "card-text";
    cardTextArtist.textContent = this.artista;

    const cardTextGenre = document.createElement("p");
    cardTextGenre.className = "card-text";
    cardTextGenre.textContent = `Género: ${this.genero}`;

    const cardTextPrice = document.createElement("p");
    cardTextPrice.className = "card-text";
    cardTextPrice.textContent = `$${this.precio}`;

    const btnDetail = document.createElement("button");
    btnDetail.className = "btn btn-primary";
    btnDetail.textContent = "Ver Detalle";
    btnDetail.onclick = () => verDetalle(this.nombre);

    const btnAddToCart = document.createElement("button");
    btnAddToCart.className = "btn btn-success";
    btnAddToCart.textContent = "Agregar al Carrito";
    btnAddToCart.onclick = () => carrito.agregarProducto(this);

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardTextArtist);
    cardBody.appendChild(cardTextGenre);
    cardBody.appendChild(cardTextPrice);
    cardBody.appendChild(btnDetail);
    cardBody.appendChild(btnAddToCart);

    card.appendChild(img);
    card.appendChild(cardBody);
    discoCard.appendChild(card);

    return discoCard;
  }
}

class Carrito {
  constructor() {
    this.productos = [];
  }

  agregarProducto(disco) {
    const index = this.productos.findIndex((d) => d.nombre === disco.nombre);

    if (index > -1) {
      this.productos[index].cantidad += 1;
    } else {
      disco.cantidad = 1;
      this.productos.push(disco);
    }
    this.actualizarCarritoInfo();
    this.mostrarCarrito();
  }

  eliminarProducto(nombreDisco) {
    const index = this.productos.findIndex((d) => d.nombre === nombreDisco);

    if (index > -1) {
      if (this.productos[index].cantidad > 1) {
        this.productos[index].cantidad -= 1;
      } else {
        this.productos.splice(index, 1);
      }
    }
    this.actualizarCarritoInfo();
    this.mostrarCarrito();
  }

  actualizarCarritoInfo() {
    const cantidadProductos = this.productos.reduce(
      (total, disco) => total + disco.cantidad,
      0
    );
    const montoTotal = this.productos
      .reduce((total, disco) => total + disco.precio * disco.cantidad, 0)
      .toFixed(2);

    document.getElementById("cantidad-productos").textContent =
      cantidadProductos;
    document.getElementById("monto-total").textContent = montoTotal;
  }
  mostrarCarrito() {
    const carritoContainer = document.getElementById("carrito");
    carritoContainer.innerHTML = "";

    this.productos.forEach((disco) => {
      const discoCard = document.createElement("div");
      discoCard.className = "col-md-4";

      const card = document.createElement("div");
      card.className = "card mb-4";

      const img = document.createElement("img");
      img.src = disco.imagen;
      img.className = "card-img-top";
      img.alt = disco.nombre;

      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      const cardTitle = document.createElement("h5");
      cardTitle.className = "card-title";
      cardTitle.textContent = disco.nombre;

      const cardTextArtist = document.createElement("p");
      cardTextArtist.className = "card-text";
      cardTextArtist.textContent = disco.artista;

      const cardTextGenre = document.createElement("p");
      cardTextGenre.className = "card-text";
      cardTextGenre.textContent = `Género: ${disco.genero}`;

      const cardTextPrice = document.createElement("p");
      cardTextPrice.className = "card-text";
      cardTextPrice.textContent = `$${disco.precio}`;

      const cardTextQuantity = document.createElement("p");
      cardTextQuantity.className = "card-text";
      cardTextQuantity.textContent = `Cantidad: ${disco.cantidad}`;

      const btnEliminar = document.createElement("button");
      btnEliminar.className = "btn btn-danger";
      btnEliminar.textContent = "Eliminar del Carrito";
      btnEliminar.addEventListener("click", () =>
        this.eliminarProducto(disco.nombre)
      );

      // estructura de las cards
      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardTextArtist);
      cardBody.appendChild(cardTextGenre);
      cardBody.appendChild(cardTextPrice);
      cardBody.appendChild(cardTextQuantity);
      cardBody.appendChild(btnEliminar);

      card.appendChild(img);
      card.appendChild(cardBody);
      discoCard.appendChild(card);

      // agregar
      carritoContainer.appendChild(discoCard);
    });
  }
}

let discos = [];
let carrito = new Carrito();

// cargar datos de discos
fetch("discos.json")
  .then((response) => response.json())
  .then((data) => {
    discos = data.map((d) => new Disco(d));
    cargarCatalogo();
    cargarFiltros();
  })
  .catch((error) => console.error("Error al cargar los datos:", error));

// cargar catalogo de productos
function cargarCatalogo(filtrados = discos) {
  const discosContainer = document.getElementById("discos");
  discosContainer.innerHTML = "";

  filtrados.forEach((disco) => {
    discosContainer.appendChild(disco.crearCard());
  });
}

// ver detalle del producto
function verDetalle(nombreDisco) {
  const disco = discos.find((d) => d.nombre === nombreDisco);
  const detalleBody = document.getElementById("detalleProductoBody");
  detalleBody.innerHTML = "";

  const img = document.createElement("img");
  img.src = disco.imagen;
  img.className = "img-fluid mb-3";
  img.alt = disco.nombre;

  const name = document.createElement("h5");
  name.textContent = disco.nombre;

  const detail = document.createElement("p");
  detail.textContent = disco.detalle;

  const artist = document.createElement("p");
  artist.textContent = `Artista: ${disco.artista}`;

  const price = document.createElement("p");
  price.textContent = `Precio: $${disco.precio}`;

  const btnAddToCart = document.createElement("button");
  btnAddToCart.className = "btn btn-success";
  btnAddToCart.textContent = "Agregar al Carrito";
  btnAddToCart.onclick = () => carrito.agregarProducto(disco);

  detalleBody.appendChild(img);
  detalleBody.appendChild(name);
  detalleBody.appendChild(detail);
  detalleBody.appendChild(artist);
  detalleBody.appendChild(price);
  detalleBody.appendChild(btnAddToCart);

  $("#detalleProductoModal").modal("show");
}

// Cargar filtros de generos
function cargarFiltros() {
  let generos = [];

  discos.forEach((disco) => {
    const genero = disco.genero;
    if (!generos.includes(genero)) {
      generos.push(genero);
    }
  });

  const filtrosContainer = document.getElementById("filtros");

  // boton para mostrar todos los discos
  const btnTodos = document.createElement("button");
  btnTodos.className = "btn btn-secondary mr-2";
  btnTodos.innerText = "Todos";
  btnTodos.addEventListener("click", () => {
    cargarCatalogo(discos);
  });
  filtrosContainer.appendChild(btnTodos);

  // botones para cada genero
  generos.forEach((genero) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-primary mr-2";
    btn.innerText = genero;
    btn.addEventListener("click", () => {
      const discosFiltrados = discos.filter((disco) =>
        disco.genero.includes(genero)
      );
      cargarCatalogo(discosFiltrados);
    });
    filtrosContainer.appendChild(btn);
  });
}

function crearModalDetalleProducto() {
  const modalDetalleProducto = document.createElement("div");
  modalDetalleProducto.className = "modal fade";
  modalDetalleProducto.id = "detalleProductoModal";
  modalDetalleProducto.tabIndex = "-1";
  modalDetalleProducto.role = "dialog";
  modalDetalleProducto.setAttribute(
    "aria-labelledby",
    "detalleProductoModalLabel"
  );
  modalDetalleProducto.setAttribute("aria-hidden", "true");

  const modalDialog = document.createElement("div");
  modalDialog.className = "modal-dialog";
  modalDialog.role = "document";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";

  const modalTitle = document.createElement("h5");
  modalTitle.className = "modal-title";
  modalTitle.id = "detalleProductoModalLabel";
  modalTitle.textContent = "Detalle del Producto";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "close";
  closeButton.setAttribute("data-dismiss", "modal");
  closeButton.setAttribute("aria-label", "Close");

  const closeIcon = document.createElement("span");
  closeIcon.setAttribute("aria-hidden", "true");
  closeIcon.innerHTML = "&times;";

  closeButton.appendChild(closeIcon);
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeButton);

  const modalBody = document.createElement("div");
  modalBody.className = "modal-body";
  modalBody.id = "detalleProductoBody";

  const modalFooter = document.createElement("div");
  modalFooter.className = "modal-footer";

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "btn btn-secondary";
  closeBtn.setAttribute("data-dismiss", "modal");
  closeBtn.textContent = "Cerrar";

  modalFooter.appendChild(closeBtn);

  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalContent.appendChild(modalFooter);

  modalDialog.appendChild(modalContent);
  modalDetalleProducto.appendChild(modalDialog);

  document.body.appendChild(modalDetalleProducto);
}

function crearModalDetalleCarrito() {
  const modalDetalleCarrito = document.createElement("div");
  modalDetalleCarrito.className = "modal fade";
  modalDetalleCarrito.id = "detalleCarritoModal";
  modalDetalleCarrito.tabIndex = "-1";
  modalDetalleCarrito.role = "dialog";
  modalDetalleCarrito.setAttribute(
    "aria-labelledby",
    "detalleCarritoModalLabel"
  );
  modalDetalleCarrito.setAttribute("aria-hidden", "true");

  const modalDialog = document.createElement("div");
  modalDialog.className = "modal-dialog";
  modalDialog.role = "document";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";

  const modalTitle = document.createElement("h5");
  modalTitle.className = "modal-title";
  modalTitle.id = "detalleCarritoModalLabel";
  modalTitle.textContent = "Detalle del Carrito";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "close";
  closeButton.setAttribute("data-dismiss", "modal");
  closeButton.setAttribute("aria-label", "Close");

  const closeIcon = document.createElement("span");
  closeIcon.setAttribute("aria-hidden", "true");
  closeIcon.innerHTML = "&times;";

  closeButton.appendChild(closeIcon);
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeButton);

  const modalBody = document.createElement("div");
  modalBody.className = "modal-body";
  modalBody.id = "detalleCarritoBody";

  const modalFooter = document.createElement("div");
  modalFooter.className = "modal-footer";

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "btn btn-secondary";
  closeBtn.setAttribute("data-dismiss", "modal");
  closeBtn.textContent = "Cerrar";

  modalFooter.appendChild(closeBtn);

  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalContent.appendChild(modalFooter);

  modalDialog.appendChild(modalContent);
  modalDetalleCarrito.appendChild(modalDialog);

  document.body.appendChild(modalDetalleCarrito);
}

function crearInfoCarrito() {
  const container = document.createElement("div");
  container.className = "container";

  const carritoInfo = document.createElement("div");
  carritoInfo.id = "carrito-info";
  carritoInfo.className = "alert alert-info";

  const productosInfo = document.createElement("p");
  productosInfo.innerHTML = `Productos en el carrito: <span id="cantidad-productos">0</span>`;

  const totalInfo = document.createElement("p");
  totalInfo.innerHTML = `Total a pagar: $<span id="monto-total">0.00</span>`;

  carritoInfo.appendChild(productosInfo);
  carritoInfo.appendChild(totalInfo);

  container.appendChild(carritoInfo);

  document.body.appendChild(container);
}

crearModalDetalleProducto();
crearModalDetalleCarrito();
crearInfoCarrito();
