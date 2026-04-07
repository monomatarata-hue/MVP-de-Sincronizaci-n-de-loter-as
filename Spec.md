# Specification: MVP "Pruebas de Monomatarata"

## 1. Información General
- **Nombre del Proyecto:** Pruebas de Monomatarata.
- **Descripción:** Interfaz de visualización de resultados para 7 loterías de animalitos.
- **Objetivo:** Servir como entorno de pruebas (Laboratorio) para la sincronización de datos.

## 2. Estilo y UI (User Interface)
- **Tipografía Global:** `Courier New`, monospace.
- **Colores:**
  - **Fondo de página:** Negro (`#000000`).
  - **Cabecera Principal (Home):** Morado (`#76004D`).
  - **Letras de Cabecera:** Blanco puro (`#FFFFFF`).
  - **Contenedor de Lotería (Header):** Negro (`#000000`).
  - **Tarjetas de Resultados:** Blanco puro (`#FFFFFF`).
  - **Texto de Horas (dentro de tarjetas):** Morado (`#76004D`).

## 3. Estructura de la Página
### 3.1. Home Header
- Texto: "ésta es la página de pruebas de la rata"
- Estilo: Centrado, fondo morado, fuente Courier New.

### 3.2. Secciones de Loterías (7 en total)
Cada sección debe contener:
1. **Franja de Título:** Fondo negro, texto blanco con el nombre de la lotería.
2. **Contenedor de Grilla (Grid):**
   - **Propiedad:** `display: grid`.
   - **Estructura:** `grid-template-columns: repeat(4, 1fr)` (Distribución 4-4-4).
   - **Comportamiento:** Centrado automáticamente con márgenes laterales proporcionales.
3. **Tarjetas (12 por lotería):**
   - **Contenido superior/centro:** Imagen del animalito (circular).
   - **Contenido inferior:** Texto con la hora del sorteo (Color `#76004D`).

## 4. Configuración de Loterías y Horarios

| Lotería | Imagen de Referencia | Cantidad | Horario de Sorteos (Intervalo 1h) |
| :--- | :--- | :--- | :--- |
| **La granjita** | `loteria-la-granjita.png` | 12 | 08:00 AM a 07:00 PM |
| **Selva plus** | `loteria-selva-plus.png` | 12 | 08:00 AM a 07:00 PM |
| **Guacharito millonario** | `loteria-guacharito-millonario.png` | 12 | 08:30 AM a 07:30 PM |
| **Lotto activo** | `loteria-lotto-activo.png` | 12 | 08:00 AM a 07:00 PM |
| **Guácharo activo** | `loteria-guacharo-activo.png` | 12 | 08:00 AM a 07:00 PM |
| **Lotto Activo Internacional** | `loteria-lotto-activo-internacional.png` | 12 | 08:00 AM a 07:00 PM |
| **Lotto Rey** | `loteria-lotto-rey.png` | 11* | 09:30 AM a 07:30 PM |

> **Nota para Lotto Rey:** Se deben generar 12 tarjetas para mantener la estética 4-4-4, pero la última quedará como "Sin Sorteo" o vacía.

## 5. Reglas Técnicas de Maquetación
- No usar librerías externas de CSS (como Bootstrap); usar CSS nativo (Flexbox/Grid).
- Las tarjetas deben tener un `aspect-ratio` cuadrado o ligeramente rectangular para que luzcan consistentes.
- Las imágenes de los animalitos deben ser relativas a la carpeta `/img/` o `/assets/`.
- El diseño debe evitar que el contenido toque los bordes laterales del monitor mediante un `max-width` en el contenedor global y `margin: auto`.