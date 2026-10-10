-- Ejecuta esto en Supabase > SQL Editor

create table if not exists public.productos (
  id          bigint generated always as identity primary key,
  nombre      text not null,
  descripcion text,
  precio      numeric(10,2) not null check (precio >= 0),
  imagen_url  text,
  stock       integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Seguridad: cualquiera puede LEER el catálogo, nadie puede escribir desde el navegador.
alter table public.productos enable row level security;

create policy "Catalogo publico de lectura"
  on public.productos for select
  using (true);

-- Permiso de lectura para el rol que usa la publishable key
grant select on public.productos to anon;

-- Datos de ejemplo
insert into public.productos (nombre, descripcion, precio, stock) values
  ('Set Ciudad Bomberos', 'Estación + 2 camiones', 45000, 10),
  ('Nave Espacial', '320 piezas', 32000, 15),
  ('Castillo Medieval', 'Incluye 5 minifiguras', 68000, 5);
