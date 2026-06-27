# Caja Inteligente - Aplicación Móvil (MVP)

Este repositorio contiene el código de la aplicación móvil para **Caja Inteligente**, diseñada como una herramienta para estructurar datos financieros y reducir el riesgo de crédito en visitas de campo. El proyecto está enfocado estrictamente en un Producto Mínimo Viable (MVP), priorizando la legibilidad, la practicidad y la sincronización eficiente de datos sin sobreingeniería.

## 📐 Arquitectura del Proyecto

El sistema utiliza una **Arquitectura Limpia Simplificada**, dividida en cuatro capas bien definidas:

### 1. Domain
- **Contiene:** Entidades y contratos de repositorios.
- **Restricciones:** No debe depender de Flutter, Drift, Dio, Cubit, Modular, ni widgets de UI.

### 2. Application
- **Contiene:** Cubits, estados (States) y el motor de sincronización (`SyncEngine`).
- **Restricciones:** Coordina el comportamiento pero no debe renderizar UI.

### 3. Infrastructure
- **Contiene:** Implementaciones de repositorios, operaciones de base de datos con Drift, y llamadas al `FakeBackendService`.
- **Restricciones:** Es la única capa que debe depender de Drift y del backend simulado.

### 4. Presentation
- **Contiene:** Páginas y widgets.
- **Restricciones:** No debe acceder a Drift directamente, no debe contener lógica de sincronización ni reglas de negocio. Los widgets solo renderizan la UI en español y disparan acciones de los Cubits.

## 📦 Gestión de Estado

Toda la gestión de estado se maneja con `flutter_bloc` utilizando **Cubit**.

*   **`ManagementsCubit`**: Carga y filtra registros de gestiones. Expone estados: `initial`, `loading`, `empty`, `loaded`, `error`.
*   **`ManagementFormCubit`**: Crea, edita y valida datos simples de formularios de gestión. Expone estados: `initial`, `loading`, `success`, `error`.
*   **`SyncCubit`**: Carga la cola de sincronización, el resumen, ejecuta la sincronización manual y reintenta operaciones fallidas. Expone estados: `initial`, `loading`, `loaded`, `syncing`, `error`.

## 💾 Base de Datos

Implementada con **Drift + SQLite**. 
Contiene estrictamente solo estas dos tablas:
1. `managements`
2. `sync_queue`

*(Nota: No se deben implementar tablas para logs opcionales o bitácoras).*

## 🧭 Navegación

Implementada con **flutter_modular**. 

**Rutas permitidas:**
- `/managements`
- `/managements/form`
- `/managements/form/:localId`
- `/sync`

**Estructura principal:** 2 pestañas inferiores (Bottom Tabs): *Gestiones* y *Cola*.

## 🎨 Guía de Estilo UI

El diseño sigue un estilo "Fintech moderno", limpio y funcional:

- **Fondo:** `#f2f3f5`
- **Primario (Oscuro):** `#202020`
- **Acento (Lima):** `#c9f158`
- **Tarjetas:** `#ffffff` (blancas, con bordes redondeados y sombras suaves).
- **Botones:** Negros (`#202020`).
- **Espaciado:** Limpio y estructurado.
- **Idioma:** Todo el texto de la interfaz y mensajes de error **deben** estar en español (ej. *"No se pudieron cargar las gestiones."*, *"La operación falló después de 3 intentos."*).

## 🚫 Restricciones de Implementación (Lo que NO se debe hacer)
- No incluir sistema de login o perfil de usuario.
- No conectar a una API real (usar `FakeBackendService`).
- No implementar detección de conectividad real o tareas en segundo plano.
- No incluir notificaciones push, animaciones complejas, ni abstracciones innecesarias.
- Mantener nombres descriptivos y claros (evitar nombres vagos como `Manager`, `Helper`, `DataService`).