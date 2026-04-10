# Specification: MVP "Pruebas de Monomatarata" (v3.0)

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

### 3.2. Secciones de Loterías (6 en total)
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

## 5. Arquitectura del Proyecto (Estructura de Carpetas)
El agente debe inicializar el proyecto construyendo estrictamente la siguiente estructura de directorios y archivos base para garantizar la separación de responsabilidades:

```text
/pruebas-monomatarata
│
├── /assets                # Recursos estáticos
│   ├── /img               # Logos y banners de las loterías
│   └── /animalitos        # TODAS las 37+ imágenes de los animalitos juntas en esta única raíz
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
```

## 6. Protocolos de Comunicación y Seguridad (Anti-Bot)

### 6.1. Simulación de Comportamiento Humano
Todas las peticiones salientes (Fetch o Scrapers) deben incluir obligatoriamente un "User-Agent" de navegador moderno para evitar bloqueos por parte de los servidores de las loterías.

### 6.2. Cabeceras (Headers) Estándar
Cada petición debe configurarse con las siguientes cabeceras mínimas:
- **User-Agent:** Un string de navegador actualizado (ej. Chrome en Windows).
- **Referer:** La URL de la página oficial de la lotería correspondiente.
- **Accept-Language:** 'es-ES,es;q=0.9', para simular tráfico latinoamericano/español.

### 6.3. Gestión de Frecuencia (Rate Limiting)
- El sistema no debe realizar peticiones repetitivas si el resultado de un horario ya existe en la memoria local.
- Se debe implementar un margen de espera aleatorio (jitter) si se realizan múltiples peticiones consecutivas para no generar patrones mecánicos.

## 7. Lógica de Sincronización Modular (Grupo de Oro - APIs Lotterly)

### 7.1. Estructura de Consumo Unificada
Las loterías del proveedor Lotterly (Guácharo Activo, Guacharito Millonario, Selva Plus) comparten la misma arquitectura de base de datos. Por lo tanto, deben sincronizarse mediante una única función `fetch` nativa en JavaScript capaz de recibir el nombre de la lotería de forma dinámica.

- **Endpoint Base:** `https://api.lotterly.co/v1/results/[slug]/?exact_date=[YYYY-MM-DD]&extended=true`
  - *Nota técnica sobre la Fecha (Obligatorio):* El script debe generar la fecha del día en curso (`YYYY-MM-DD`) de forma dinámica, pero **debe forzar estrictamente el huso horario de Caracas, Venezuela (`America/Caracas`, UTC-4)**. No se debe confiar en la hora local del navegador del cliente para evitar desajustes por VPNs o usuarios en el extranjero.
  - *Slugs válidos:* `guacharo-activo`, `selva-plus`, `el-guacharito-millonario`.

### 7.2. Algoritmo de Extracción de Datos
El código debe iterar sobre el array de objetos JSON recibido. Dado que el esquema es simétrico para las tres plataformas, para cada iteración (`item`), los datos de interés se extraerán sin necesidad de condicionales de marca:
- `hora_sorteo`: Obtenido del nodo estático `item.time` (ej. `"08:00:00"`, `"08:30:00"`). Este valor crudo de 24h se utilizará estrictamente como **llave de búsqueda** para localizar la tarjeta correspondiente en el DOM, no para inyección de texto visual.
- `numero_ganador`: Obtenido del nodo estático `item.results[0].result` (ej. `"21"`, `"05"`, `"91"`). Se debe extraer siempre como un dato de tipo `String` para conservar formatos vitales como los ceros a la izquierda.

### 7.3. Inyección en la Interfaz y Diccionarios de Archivos
- **Rechazo de datos inestables:** Está estrictamente prohibido depender del nodo `posts` (la información de Twitter/X) del JSON para obtener el nombre en texto del animal, ya que su disponibilidad y formato están sujetos a errores de redacción en la red social.
- **Diccionario Centralizado:** Todas las imágenes residen en una única ruta plana (`/assets/animalitos/`). El script debe implementar un **Diccionario de Mapeo (Mapper)** estático que relacione el `numero_ganador` directamente con el nombre de su archivo, tomando en cuenta las excepciones numéricas de loterías como El Guacharito Millonario.
  - *Ejemplo Selva Plus:* `"05"` -> `/assets/animalitos/05-leon.webp`.
  - *Ejemplo Guacharito:* `"91"` -> `/assets/animalitos/91-pajaro.webp`.
- **Comportamiento del DOM (Emparejamiento por Data-Attributes):** Las tarjetas en el archivo HTML deben poseer un atributo de datos que coincida exactamente con el formato de la API (ej. `<div class="card" data-time="08:30:00">`). Al iterar los resultados, el script utilizará el valor de `hora_sorteo` para hacer un "match" directo con este atributo dentro del Grid de la lotería activa.
- Al encontrar la tarjeta correspondiente, el script actualizará el atributo `src` de la etiqueta `<img>` con la ruta generada por el diccionario. El contenedor de la imagen debe mantener rígidamente la regla CSS de `70%` de altura definida en la interfaz, usando `object-fit: contain`.

### 7.4. Modularidad de Archivos
- Toda la lógica de conexión, extracción y mapeo detallada en esta sección debe estar encapsulada en un único módulo ubicado en `/js/api-handlers/lotterly-api.js`.
- La ejecución en el archivo principal consistirá únicamente en invocar la función constructora pasando el `slug` deseado como argumento principal.