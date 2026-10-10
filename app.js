const DEMO_PRODUCTS = [
  { id: 1, nombre: "Set Ciudad Bomberos", descripcion: "Estación + 2 camiones", precio: 45000, imagen_url: "" },
  { id: 2, nombre: "Nave Espacial", descripcion: "320 piezas", precio: 32000, imagen_url: "" },
  { id: 3, nombre: "Castillo Medieval", descripcion: "Incluye 5 minifiguras", precio: 68000, imagen_url: "" },
];

const $ = (id) => document.getElementById(id);
const money = (n) => "$" + Number(n).toLocaleString("es-AR");

let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let products = [];

async function loadProducts() {
  try {
    const r = await fetch("/api/productos");
    const data = await r.json();
    if (r.status === 503) {
      $("status").textContent = "Modo demo: falta configurar Supabase en .env.";
      return DEMO_PRODUCTS;
    }
    if (!r.ok) throw new Error(data.error);
    $("status").textContent = data.length ? "" : "Aún no hay productos.";
    return data;
  } catch (err) {
    $("status").textContent = "Error al cargar productos: " + err.message;
    return [];
  }
}

function renderProducts() {
  $("products").innerHTML = products.map((p) => `
    <article class="card">
      <div class="img">${p.imagen_url ? `<img src="${p.imagen_url}" alt="${p.nombre}">` : "🧱"}</div>
      <h3>${p.nombre}</h3>
      <p>${p.descripcion ?? ""}</p>
      <div class="row">
        <strong>${money(p.precio)}</strong>
        <button class="btn" data-add="${p.id}">Agregar</button>
      </div>
    </article>`).join("");
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  $("cart-count").textContent = cart.reduce((s, i) => s + i.qty, 0);
  $("cart-items").innerHTML = cart.map((i) => `
    <li>${i.nombre} x${i.qty} <span>${money(i.precio * i.qty)}</span>
      <button data-remove="${i.id}" aria-label="Quitar">✕</button></li>`).join("");
  $("cart-total").textContent = money(cart.reduce((s, i) => s + i.precio * i.qty, 0));
}

document.addEventListener("click", (e) => {
  const add = e.target.dataset.add;
  const remove = e.target.dataset.remove;
  if (add) {
    const p = products.find((x) => String(x.id) === add);
    const item = cart.find((x) => x.id === p.id);
    item ? item.qty++ : cart.push({ id: p.id, nombre: p.nombre, precio: p.precio, qty: 1 });
    saveCart();
  }
  if (remove) {
    cart = cart.filter((x) => String(x.id) !== remove);
    saveCart();
  }
});

$("cart-btn").onclick = () => $("cart").classList.toggle("hidden");
$("cart-close").onclick = () => $("cart").classList.add("hidden");

(async () => {
  renderCart();
  products = await loadProducts();
  renderProducts();
})();
