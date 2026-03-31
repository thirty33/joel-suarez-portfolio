# CSS Grid Structure — Convención de desarrollo

Antes de escribir cualquier componente HTML/Astro, sigue esta convención de grillas CSS Grid estricta.

---

## Principio fundamental

**TODO es CSS Grid.** Desde el layout raíz hasta el último elemento interno. No se usan `margin`, `padding` ni `gap` para espaciado entre elementos — los espacios son columnas y filas explícitas del grid.

---

## 1. Representación visual de una grilla

Antes de escribir código, dibujar la grilla con esta notación:

```
     c1:SIZE   c2:SIZE     c3:SIZE
     ┌────────┬───────────┬────────┐
r1   │        │           │        │ SIZE   ← descripción
     ├────────┼───────────┼────────┤
r2   │        │ CONTENIDO │        │ SIZE   ← descripción
     ├────────┼───────────┼────────┤
r3   │        │           │        │ SIZE   ← descripción
     └────────┴───────────┴────────┘
```

- Celdas vacías = espacios (márgenes, padding visual, separadores)
- Celdas con texto = elementos posicionados
- SIZE = valor CSS (`auto`, `1fr`, `1rem`, `0.25rem`, etc.)
- Cada fila y columna tiene un tamaño explícito

---

## 2. Ejemplos de referencia

### Layout raíz (body) — 1 columna, secciones apiladas

```
         col1: 1fr
     ┌─────────────────────┐
r1   │      <Header>       │ auto
     ├─────────────────────┤
r2   │      <Hero>         │ auto
     ├─────────────────────┤
r3   │      <Name>         │ auto
     ├─────────────────────┤
r4   │      <Metrics>      │ auto
     ├─────────────────────┤
r5   │                     │ 2rem      ← espacio entre secciones
     ├─────────────────────┤
r6   │      <Services>     │ auto
     └─────────────────────┘
```

### Header — logo izquierda, acción derecha, márgenes y padding como celdas

```
     c1:1rem   c2:auto     c3:1fr      c4:auto   c5:1rem
     ┌───────┬───────────┬───────────┬──────────┬───────┐
r1   │       │           │           │          │       │ 0.75rem
     ├───────┼───────────┼───────────┼──────────┼───────┤
r2   │       │   LOGO    │           │    ☰     │       │ auto
     ├───────┼───────────┼───────────┼──────────┼───────┤
r3   │       │           │           │          │       │ 0.75rem
     └───────┴───────────┴───────────┴──────────┴───────┘

- c1/c5: márgenes laterales
- r1/r3: padding vertical
- c3: espacio flexible entre logo y acción
```

### Imagen full-width con sub-elementos

```
     c1:1fr
     ┌─────────────────────┐
r1   │                     │
     │     📷 Imagen       │ auto
     │                     │
     ├─────────────────────┤
r2   │  <SubElemento>      │ auto
     └─────────────────────┘
```

### Fila de iconos — elementos repetidos con espacios entre ellos

```
     c1:1fr  c2:auto c3:0.75rem c4:auto c5:0.75rem c6:auto c7:0.75rem c8:auto c9:0.75rem c10:auto  c11:1fr
     ┌──────┬──────┬──────────┬──────┬──────────┬──────┬──────────┬──────┬──────────┬───────┬──────┐
r1   │      │      │          │      │          │      │          │      │          │       │      │ 0.5rem
     ├──────┼──────┼──────────┼──────┼──────────┼──────┼──────────┼──────┼──────────┼───────┼──────┤
r2   │      │  A   │          │  B   │          │  C   │          │  D   │          │  E    │      │ auto
     ├──────┼──────┼──────────┼──────┼──────────┼──────┼──────────┼──────┼──────────┼───────┼──────┤
r3   │      │      │          │      │          │      │          │      │          │       │      │ 0.75rem
     └──────┴──────┴──────────┴──────┴──────────┴──────┴──────────┴──────┴──────────┴───────┴──────┘

- c1/c11: centrado horizontal (1fr empujan contenido al centro)
- c3/c5/c7/c9: espacios entre iconos
- r1/r3: padding vertical
```

### Texto centrado con título y subtítulo

```
     c1:1fr    c2:auto                    c3:1fr
     ┌────────┬─────────────────────────┬────────┐
r1   │        │                         │        │ 1rem
     ├────────┼─────────────────────────┼────────┤
r2   │        │        Título           │        │ auto
     ├────────┼─────────────────────────┼────────┤
r3   │        │                         │        │ 0.25rem
     ├────────┼─────────────────────────┼────────┤
r4   │        │       Subtítulo         │        │ auto
     ├────────┼─────────────────────────┼────────┤
r5   │        │                         │        │ 1rem
     └────────┴─────────────────────────┴────────┘

- c1/c3: centrado horizontal
- r1/r5: padding vertical
- r3: espacio entre título y subtítulo
```

### Métricas en fila — N columnas de datos con separadores

```
     c1:1fr  c2:auto       c3:2rem  c4:auto        c5:2rem  c6:auto      c7:1fr
     ┌──────┬─────────────┬────────┬───────────────┬────────┬────────────┬──────┐
r1   │      │             │        │               │        │            │      │ 1rem
     ├──────┼─────────────┼────────┼───────────────┼────────┼────────────┼──────┤
r2   │      │    258+     │        │     150       │        │    10+     │      │ auto
     ├──────┼─────────────┼────────┼───────────────┼────────┼────────────┼──────┤
r3   │      │             │        │               │        │            │      │ 0.25rem
     ├──────┼─────────────┼────────┼───────────────┼────────┼────────────┼──────┤
r4   │      │  Clientes   │        │  Proyectos    │        │   Años     │      │ auto
     │      │ Satisfechos │        │  Realizados   │        │ Experiencia│      │
     ├──────┼─────────────┼────────┼───────────────┼────────┼────────────┼──────┤
r5   │      │             │        │               │        │            │      │ 1.5rem
     └──────┴─────────────┴────────┴───────────────┴────────┴────────────┴──────┘

- c1/c7: centrado horizontal
- c3/c5: espacio entre métricas
- r1/r5: padding vertical
- r3: espacio entre número y label
```

---

## 3. Reglas

### Espaciado = Filas/Columnas vacías

**NUNCA** usar para separar elementos:
- `margin` / `padding`
- `gap`
- Spacer divs vacíos

### Cuándo SÍ usar padding

Solo para espacio **interno** de un elemento con fondo, borde o interactivo:
- Botones: `px-6 py-3`
- Inputs: `px-4 py-2`

Si tiene layout interno complejo, usar grid en vez de padding.

### Responsive

Misma estructura de grid, cambiando tamaños por breakpoint:

```html
<section class="grid
  grid-cols-[1rem_1fr_1rem]
  grid-rows-[1rem_auto_1rem_auto_1rem]
  md:grid-cols-[2rem_1fr_3rem_1fr_2rem]
  md:grid-rows-[2rem_auto_2rem]
">
```

---

## 4. Checklist antes de escribir un componente

1. Dibujar la grilla visual con la notación de arriba
2. Identificar todos los hijos visibles
3. Identificar los espacios (arriba, abajo, izquierda, derecha, entre elementos)
4. Definir `grid-template-rows` con: espacio, elemento, espacio, elemento...
5. Definir `grid-template-columns` con: margen, contenido, margen
6. Posicionar cada hijo con `row-start` / `col-start`
7. Para responsive: redefinir la grilla por breakpoint, NO cambiar los hijos
8. Verificar: no hay `margin`, `gap`, ni spacer divs

---

## 5. Traducción a Tailwind v4

```html
<!-- Definir grilla -->
class="grid grid-rows-[0.75rem_auto_0.75rem] grid-cols-[1rem_auto_1fr_auto_1rem]"

<!-- Posicionar hijo -->
class="col-start-2 row-start-2"

<!-- Span -->
class="col-span-3 row-span-2"

<!-- Responsive -->
class="grid-cols-[1rem_1fr_1rem] md:grid-cols-[2rem_1fr_3rem_1fr_2rem]"
```
