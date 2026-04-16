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
├── /assets                # Recursos estáticos
│   ├── /img               # Logos y banners de las loterías
│   └── /animalitos        # TODAS las 37+ imágenes de los animalitos juntas en esta única raíz
│
├── /css                   # Hojas de estilo
│   └── styles.css         # Archivo central de estilos
│
├── /js                    # Lógica de programación y scripts
│   ├── /scrapers          # Scripts para extracción de datos (Exclusivo para Puppeteer)
│   ├── /api-handlers      # Scripts para peticiones Fetch a las APIs directas
│   └── main.js            # Archivo principal de ejecución
│
├── /docs                  # Documentación del proyecto
│   └── Spec.md            # Este archivo de especificaciones (moverlo aquí)
│
└── index.html             # Interfaz principal del MVP (conectada a styles.css y main.js)
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

### 6.4. Tolerancia de Red (Timeout Handling)
Para prevenir que las peticiones se queden colgadas indefinidamente o que el script aborte prematuramente por fluctuaciones normales del servidor destino, todas las peticiones externas a las páginas de resultados (como Axios o Fetch) deben incluir una configuración estricta de tiempo de espera.
- **Timeout obligatorio:** 5000 milisegundos (5 segundos).
- **Comportamiento esperado:** Si el servidor no responde entregando el HTML dentro de este margen de 5 segundos, la petición debe ser abortada y el sistema debe registrar un error real de conexión (Timeout Error) en la consola, sin inyectar datos simulados ni interrumpir el resto de la ejecución de forma silenciosa.

### 6.5. Prohibición Estricta de Simulaciones (No Mock Data)
Bajo ninguna circunstancia los scrapers deben generar, inyectar o devolver datos simulados (`mock data`), funciones de respaldo (`simulateScraperOutput`) o arreglos hardcodeados en los archivos JSON si la extracción falla. El sistema debe depender 100% de la respuesta real de la página. Si hay un fallo de conexión o la estructura HTML cambia, el script debe fallar ruidosamente (Fail Fast) imprimiendo el error real en la consola, permitiendo así diagnosticar el problema en lugar de enmascararlo con resultados falsos.

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


## 8. Lógica de Extracción Alternativa: Web Scraping

Esta sección dicta las reglas de extracción para los proveedores que utilizan Renderizado del Lado del Cliente (Client-Side Rendering) mediante JavaScript Dinámico y no exponen una API pública (Ejemplo: Lotto Activo y Lotto Activo Internacional). La extracción de datos se realizará estrictamente mediante Web Scraping en el Backend utilizando de forma obligatoria y exclusiva la librería `puppeteer`. Al usar Puppeteer, el scraper tiene la obligación de esperar a que el selector `#resultados` esté presente en el DOM y poblado de datos antes de iniciar la extracción.

### 8.1 Reglas de Scraping para Lotto Activo
**Fuente de datos:** `https://www.lottoactivo.com/resultados/lotto_activo/`
### 8.2 Reglas de Scraping para Lotto Activo Internacional
**Fuente de datos:** `https://www.lottoactivo.com/resultados/lotto_activo_internacional/`

**Reglas aplicables:** - Aplican EXACTAMENTE las mismas 7 reglas de extracción, limpieza, estandarización y filtro de tiempo detalladas en la Sección 8.1 de Lotto Activo. 
- La estructura HTML esperada es idéntica.

1. **Contenedor Base:** El código debe hacer la petición HTTP y apuntar exclusivamente al contenedor HTML con el `id="resultados"`.
2. **Iteración:** Se deben recorrer los 12 `div` hijos directos de ese contenedor (que representan los 12 sorteos diarios, desde las 08:00 AM hasta las 07:00 PM).
3. **Regla de Hora:** Localizar la etiqueta `<p>`. Extraer el texto y limpiarlo mediante expresiones regulares o manipulación de strings para conservar únicamente el formato de hora de 12h (Ej: de la cadena "Lotto Activo 08:00 AM" extraer únicamente "08:00 AM").
4. **Regla de Número:** Localizar la etiqueta `<h6>`. Extraer el texto interno de la sub-etiqueta `<span class="badge">` (Ej: "12").
5. **Regla de Animal:** Extraer el texto puro (Text Node) que se encuentra directamente dentro de la etiqueta `<h6>`, excluyendo por completo el contenido del `<span>`. Se debe aplicar el método `.trim()` para limpiar saltos de línea y espacios en blanco residuales.
6. **Estandarización de Salida:** El backend debe tomar estos datos raspados y formatearlos en un Array de objetos JSON que posea una estructura idéntica a la respuesta de la API de Lotterly (documentada en la Sección 7). El objetivo es que el Frontend consuma la data sin distinguir si provino de una API o de un Scraper.
7. **Filtro de "Viajeros del Tiempo":** Los administradores de Lotto Activo no limpian la grilla a la medianoche, por lo que la página muestra resultados del día anterior en las horas futuras. Para evitar esto, el scraper debe comparar la hora extraída (Ej: "06:00 PM") con la hora actual del sistema. Si la hora del sorteo es estrictamente MAYOR a la hora actual, el scraper debe omitir ese resultado o devolverlo vacío para que el Frontend mantenga la tarjeta en blanco hasta que el sorteo realmente ocurra.

## 9. Lógica de Extracción: La Granjita (loteriadehoy.com)
**Fuente:** `https://loteriadehoy.com/animalito/lagranjita/resultados/`
**Archivo:** `/js/scrapers/la-granjita-scraper.js` (A ser creado)

**Reglas de Extracción (Antitrampas HTML):**
1. **Evasión de Anuncios:** Los resultados deben extraerse iterando ÚNICAMENTE sobre los elementos con la clase `.circle-legend`. Se debe ignorar cualquier código publicitario inyectado.
2. **Separación de Texto (Animal y Número):** El número y el animal vienen juntos dentro de la etiqueta `<h4>` (ej: "32 Ardilla"). El scraper debe extraer el texto y separarlo por el primer espacio para aislar la variable `result` ("32") de la variable `animal` ("Ardilla").
3. **Limpieza de Hora:** La hora viene dentro de la etiqueta `<h5>` acompañada de la marca (ej: "La Granjita 09:00 AM"). El scraper debe limpiar este texto para eliminar "La Granjita " y quedarse solo con "09:00 AM", pasándolo luego por la función de conversión a formato 24h (`"09:00:00"`).
4. **Almacenamiento:** Guardar el array resultante en `la-granjita-today.json`.