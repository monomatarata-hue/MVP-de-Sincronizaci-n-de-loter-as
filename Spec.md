# Specification: MVP "Pruebas de Monomatarata" (v2.0)

## 1. Información General
- **Nombre del Proyecto:** Pruebas de Monomatarata.
- **Descripción:** Interfaz de visualización de resultados para 7 loterías de animalitos.
- **Objetivo:** Servir como entorno de pruebas (Laboratorio) para la sincronización de datos y configuración del entorno de trabajo.

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
- **Texto:** "ésta es la página de pruebas de la rata"
- **Estilo:** Centrado, fondo morado, fuente Courier New.

### 3.2. Secciones de Loterías (7 en total)
Cada sección debe contener:
1. **Franja de Título:** Fondo negro, texto blanco con el nombre de la lotería.
2. **Contenedor de Grilla (Grid):**
   - **Propiedad:** `display: grid`.
   - **Estructura:** `grid-template-columns: repeat(4, 1fr)` (Distribución 4-4-4).
   - **Comportamiento:** Centrado automáticamente con márgenes laterales proporcionales (`margin: 0 auto`).
3. **Tarjetas (12 por lotería):**
   - **Cuerpo de la tarjeta:** Fondo blanco.
   - **Imagen del Animalito (70%):** La imagen circular debe abarcar exactamente el **70% de la altura** de la tarjeta y estar centrada (`object-fit: contain`).
   - **Texto de la Hora (Parte inferior):** Texto posicionado en la base con la hora del sorteo, de color morado (`#76004D`) y estrictamente en **negrita** (`font-weight: bold`).

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

## 5. Arquitectura del Proyecto (Estructura de Carpetas)
El agente debe inicializar el proyecto construyendo estrictamente la siguiente estructura de directorios y archivos base para garantizar la separación de responsabilidades:

```text
/pruebas-monomatarata
│
├── /assets                # Recursos estáticos
│   ├── /img               # Logos y banners de las loterías
│   └── /animalitos        # Las 37 imágenes de los animalitos (0-36)
│
├── /css                   # Hojas de estilo
│   └── styles.css         # Archivo central de estilos
│
├── /js                    # Lógica de programación y scripts
│   ├── /scrapers          # Scripts para extracción de datos (Cheerio/Puppeteer)
│   ├── /api-handlers      # Scripts para peticiones Fetch a las APIs directas
│   └── main.js            # Archivo principal de ejecución
│
├── /docs                  # Documentación del proyecto
│   └── Spec.md            # Este archivo de especificaciones (moverlo aquí)
│
└── index.html             # Interfaz principal del MVP (conectada a styles.css y main.js)