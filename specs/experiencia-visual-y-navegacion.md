# Especificación de experiencia visual y navegación — TallerListo

**Versión:** 1.0  
**Propósito:** Diferenciar la interfaz y asegurar que todas las opciones visibles tengan un comportamiento real.

## 1. Principio rector
No construir un dashboard genérico con tarjetas, menús y botones decorativos. Diseñar la experiencia alrededor del flujo real de un taller: recibir vehículo, diagnosticar, cotizar, obtener autorización y ejecutar únicamente los servicios aprobados.

La interfaz debe reflejar el trabajo y las decisiones del usuario, no solo mostrar indicadores.

## 2. Dirección visual
Aplicar la estética editorial-industrial descrita en `.agents/skills/identidad-visual/SKILL.md`. Usar una paleta cálida de marfil, grafito, verde taller y acentos cobre. Evitar replicar plantillas comunes de administración SaaS.

La diferenciación debe venir de la composición, jerarquía, lenguaje, navegación y flujo de tareas; no únicamente del color.

## 3. Arquitectura de información
### Administrador
- Órdenes de trabajo: listado de órdenes con búsqueda y filtros funcionales.
- Requieren atención: órdenes con diagnóstico pendiente, cotización pendiente o autorización parcial.
- Detalle de orden: cliente, vehículo, diagnóstico, servicios, cotización, autorización e historial.
- Notificaciones: cada notificación debe abrir el detalle de la orden y enfocar la acción pendiente.

### Mecánico
- Mi trabajo: órdenes asignadas y su estado.
- Detalle de trabajo: diagnóstico, servicios autorizados y no autorizados.
- Actualizar avance: acciones permitidas según el estado de autorización de cada servicio.

### Cliente
- Seguimiento: vehículo, estado, fecha/hora de actualización y próximo paso.
- Cotización: servicios, selección, mano de obra consolidada, total y confirmación.
- Historial de decisión: resumen de servicios aceptados/rechazados y fecha/hora.

## 4. Contrato de navegación
- Cada elemento interactivo visible debe tener destino o acción definida.
- Los elementos del menú deben cambiar a una vista real o navegar a una ruta existente.
- Una notificación debe abrir la orden relacionada y mostrar la tarea pendiente.
- Las acciones de una orden deben modificar el estado compartido de esa orden, y el cambio debe verse en las vistas relacionadas.
- No usar enlaces vacíos, `href="#"`, botones sin manejador ni controles puramente decorativos que parezcan interactivos.
- Si una sección está fuera del alcance, no mostrarla como funcional. Si se muestra como futura, marcarla explícitamente como «Próximamente» y deshabilitarla de forma accesible.
- Si una acción no puede completarse, informar por qué y qué debe hacer el usuario.

## 5. Comportamientos mínimos
- Al seleccionar una orden, abrir su detalle.
- Al pulsar una notificación, abrir la orden asociada; si no existe orden asociada, corregir el diseño para no presentar esa notificación como accionable.
- Al actualizar un estado como mecánico, actualizar el mismo registro que consulta el administrador y el cliente.
- Al seleccionar/deseleccionar servicios en una cotización, recalcular mano de obra y total.
- Al confirmar autorización, guardar una decisión y mostrar un comprobante/resumen; la vista del mecánico y administrador debe reflejarla.
- Al intentar iniciar un servicio pendiente o rechazado, bloquear la acción y explicar que falta autorización.
- En datos demo, mantener una única fuente de estado en memoria o almacenamiento local apropiado para la demostración; no duplicar datos independientes por pantalla. Identificar claramente que no es persistencia multiusuario real.

## 6. Diseño adaptable
- Priorizar móvil para mecánicos y clientes.
- En pantallas pequeñas, evitar tablas horizontales; usar fichas o listas legibles.
- Los controles táctiles deben tener tamaño suficiente y separación.
- En escritorio, aprovechar el espacio sin añadir paneles o métricas que no ayuden a completar tareas.

## 7. Accesibilidad y claridad
- Etiquetas comprensibles en español.
- Estados con texto, no solo color.
- Foco visible y controles utilizables con teclado.
- Confirmación para decisiones sensibles como autorizar o rechazar servicios.
- Mostrar importe, moneda PEN (S/) y versión de cotización antes de autorizar.

## 8. Pruebas de navegación e interacción
Antes de declarar terminado, ejecutar y reportar estas pruebas:
1. Cada opción del menú abre la vista correcta.
2. Cada notificación abre el elemento que requiere atención.
3. Las acciones de una orden se reflejan en las demás vistas que muestran esa orden.
4. Un cliente puede consultar su orden y completar una autorización parcial.
5. El mecánico no puede iniciar servicios pendientes o rechazados.
6. La interfaz funciona en un ancho móvil y en escritorio.
7. No quedan botones o enlaces visibles sin acción.

## 9. Evidencia requerida
El agente debe entregar una tabla con: elemento probado, acción realizada, resultado esperado, resultado observado y estado (Cumple/No cumple). Si algo no pudo probarse, marcarlo como «No verificado», nunca como cumplido.

## 10. Regla para corregir
Si el agente descubre un requisito ambiguo, debe proponer la modificación en esta especificación antes de improvisar una solución. Si el requisito está claro y el código no lo cumple, corregir el código. No cambiar el criterio para ocultar un defecto.
