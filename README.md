# Pupiletra Scotiabank - Web Version

Juego de búsqueda de palabras (Pupiletra) diseñado para pantallas táctiles de 40 pulgadas verticales.

## Características

- **Cuadrícula 15×15** con 7 palabras relacionadas con Scotiabank
- **Palabras a encontrar**: SCOTIA, PERU, BANCO, CLIENTE, ENFOQUE, INCLUSION, INTEGRIDAD
- **Temporizador de 90 segundos** con alertas visuales
- **Sistema de pistas**: 3 pistas disponibles por partida
- **Ranking TOP 10**: Persistente en LocalStorage del navegador
- **Cálculo de puntuación**: Basado en palabras encontradas, tiempo restante, uso de pistas
- **Colores Scotiabank**: Rojo (#D4002A), Dorado (#FFD700)
- **Diseño responsivo**: Optimizado para pantallas táctiles grandes

## Requisitos

- Navegador web moderno con soporte para:
  - HTML5
  - CSS3 (Grid, Flexbox, Gradients)
  - JavaScript ES6+
  - LocalStorage API

## Instalación

1. Copiar todos los archivos al servidor web o abrir directamente desde el sistema de archivos
2. No requiere instalación de dependencias (JavaScript vanilla)

## Uso

### Abrir el juego

**Opción 1: Servidor web**
```bash
# Con Python 3
python3 -m http.server 8000

# Con Node.js (http-server)
npx http-server -p 8000
```
Luego abrir: `http://localhost:8000`

**Opción 2: Archivo local**
- Abrir directamente `index.html` en el navegador (doble clic)

### Cómo jugar

1. **Iniciar juego**: Hacer clic en "INICIAR JUEGO"
2. **Buscar palabras**: Tocar/hacer clic en celdas adyacentes para formar palabras
3. **Palabras válidas**: Horizontal, vertical o diagonal
4. **Pistas**: Usar el botón "💡 Pista" (máximo 3 por partida)
5. **Guardar puntuación**: Al finalizar, ingresar nombre y hacer clic en "GUARDAR"
6. **Ver ranking**: Hacer clic en el botón de trofeo 🏆

## Estructura del proyecto

```
pupiletra-web/
├── index.html          # Estructura HTML principal
├── css/
│   └── styles.css      # Estilos Scotiabank y responsive
├── js/
│   ├── game.js         # Lógica del juego
│   └── storage.js      # Gestión de puntuaciones (LocalStorage)
└── README.md           # Este archivo
```

## Sistema de puntuación

```javascript
puntuación = (palabras_encontradas × 100)
           + (tiempo_restante × 10)
           + (bonus_completado ? 500 : 0)
           - (pistas_usadas × 50)
```

- **Palabra encontrada**: +100 puntos
- **Segundo restante**: +10 puntos
- **Bonus de completado**: +500 puntos (encontrar todas las palabras)
- **Penalización por pista**: -50 puntos

## Datos curiosos

El juego muestra datos curiosos de Scotiabank al finalizar cada partida:
- Al **ganar**: Datos sobre presencia global, innovación y servicios
- Al **perder**: Historia y valores de Scotiabank

## Compatibilidad

- ✅ Chrome/Edge (Chromium) 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+
- ✅ Navegadores móviles modernos

## Notas técnicas

- **Sin frameworks**: JavaScript vanilla para máximo rendimiento
- **LocalStorage**: Persistencia automática del TOP 10
- **Responsive**: Media queries para diferentes tamaños de pantalla
- **Touch optimized**: Celdas de 44×44px para pantallas táctiles
- **Accesibilidad**: Colores de alto contraste, tamaño de fuente legible

## Versión

**v2.0 Web** - Equivalente funcional de la versión Android v2.0

## Licencia

© 2025 Scotiabank. Uso interno.
