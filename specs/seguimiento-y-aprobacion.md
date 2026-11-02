# Especificación funcional — Consulta del estado y autorización de reparaciones

**Producto:** TallerListo  
**Feature:** Consulta del estado del vehículo y autorización de servicios  
**Versión:** 1.0  
**Estado:** Propuesta para implementación y validación

## 1. Problema
Los clientes llaman varias veces al día para saber si su vehículo está listo. Estas llamadas interrumpen el trabajo de los mecánicos. Además, cuando el diagnóstico descubre una reparación adicional, el taller depende de una llamada para obtener aprobación. La respuesta puede tardar y después puede existir desacuerdo sobre lo autorizado.

El problema no es únicamente mostrar un estado: es permitir que el cliente consulte información actualizada sin llamar y que las decisiones sobre reparaciones queden registradas.

## 2. Objetivo
Permitir que un cliente consulte el estado de su vehículo y revise, acepte total o parcialmente, o rechace una cotización de servicios, dejando constancia verificable de su decisión.

## 3. Usuarios
- Mecánico: registra diagnóstico, servicios recomendados y avance.
- Administrador: supervisa órdenes y cotizaciones.
- Cliente: consulta su orden y responde a la cotización.

## 4. Flujo principal
1. El taller registra una orden vinculada a un cliente y vehículo.
2. El mecánico registra el diagnóstico y recomienda uno o más servicios.
3. El taller prepara una cotización con detalle de servicios, importes y mano de obra consolidada.
4. El cliente accede a una vista privada de su orden.
5. El cliente selecciona los servicios que acepta y confirma su decisión.
6. El sistema registra la decisión y actualiza el estado de autorización de cada servicio.
7. El mecánico y el administrador pueden consultar la decisión registrada.
8. El cliente puede seguir consultando el avance y la última actualización.

## 5. Reglas funcionales
- La solicitud inicial del cliente (por ejemplo, «revisar los frenos») autoriza la inspección solicitada, no cualquier reparación que se descubra.
- Cada servicio cotizado debe tener un estado individual: pendiente de respuesta, autorizado o rechazado.
- La decisión puede ser total, parcial o rechazo de todos los servicios.
- El cliente debe ver el precio de cada servicio y la mano de obra consolidada antes de confirmar.
- El importe de mano de obra se calcula según las reglas del taller para los servicios seleccionados. Si existen operaciones compartidas, no deben cobrarse dos veces.
- Al cambiar la selección de servicios, el total debe recalcularse antes de confirmar.
- La confirmación debe ser una acción explícita; abrir la cotización o seleccionar servicios no equivale a autorizar.
- El registro debe guardar cliente, orden, versión de cotización, servicios aceptados/rechazados, importe confirmado y fecha/hora.
- Si cambia una cotización después de una autorización, debe crearse una nueva versión y solicitarse una nueva decisión sobre los cambios. La versión anterior permanece consultable.
- El estado general de la orden no debe ocultar el estado individual de autorización de sus servicios.
- Ningún servicio adicional pendiente o rechazado puede presentarse como autorizado.

## 6. Estados propuestos
**Estado general de la orden:** Recibido, En diagnóstico, Cotización pendiente, En reparación, En espera de repuestos, Trabajo finalizado, Listo para recoger, Entregado.

**Estado de cada servicio cotizado:** Pendiente de autorización, Autorizado, Rechazado, En ejecución, Finalizado.

El estado general debe calcularse o actualizarse de forma coherente con los servicios. Si hay servicios autorizados y otros pendientes, la orden puede mostrar «Autorización parcial» o «Pendiente de autorización»; el taller solo puede iniciar los servicios autorizados. No marcar toda la orden «En reparación» como si todos los servicios estuvieran aprobados.

## 7. Criterios de aceptación verificables

### CA-01 — Consulta privada del estado
**Dado** un cliente con una orden registrada, **cuando** accede mediante su enlace o sesión autorizada, **entonces** visualiza el vehículo, el estado general, la última actualización con fecha y hora y el resumen de la orden. No puede acceder a órdenes de otros clientes.

### CA-02 — Decisión total o parcial
**Dado** una cotización con varios servicios, **cuando** el cliente selecciona uno, varios o todos y confirma, **entonces** el sistema registra por separado los servicios autorizados y rechazados, el importe aceptado y la fecha/hora. No se registra ninguna autorización antes de la confirmación explícita.

### CA-03 — Recálculo de mano de obra y total
**Dado** una cotización con servicios seleccionables, **cuando** el cliente modifica su selección, **entonces** el importe de mano de obra y el total se recalculan según las reglas configuradas para esa combinación, sin duplicar operaciones compartidas. El cliente ve el nuevo total antes de confirmar.

### CA-04 — Bloqueo de servicios no autorizados
**Dado** una orden con servicios en distintos estados de autorización, **cuando** el mecánico consulta o actualiza el trabajo, **entonces** solo puede iniciar los servicios autorizados. Los servicios pendientes o rechazados permanecen identificados y no pueden cambiarse a «En ejecución» sin una autorización válida.

### CA-05 — Versionado y trazabilidad
**Dado** una cotización que ya recibió una decisión, **cuando** el taller modifica sus servicios o importes, **entonces** se crea una nueva versión, se conserva la anterior y se solicita una nueva autorización para los cambios. El historial permite identificar qué se autorizó, en qué versión y cuándo.

## 8. Fuera de alcance
- Inventario, compras y almacén.
- Contabilidad, facturación y nómina.
- Pagos en línea o integración con Culqi/Mercado Pago.
- Notificaciones reales por WhatsApp o SMS.
- Aplicación móvil nativa.

Para la demostración se pueden utilizar datos simulados. Deben estar identificados como tales y las interacciones deben funcionar dentro de la aplicación.

## 9. Casos mínimos de prueba
1. Cliente consulta una orden y no puede abrir otra orden.
2. Cliente autoriza todos los servicios.
3. Cliente autoriza solo algunos y rechaza los restantes.
4. Cliente cambia selección y observa el recálculo antes de confirmar.
5. Mecánico intenta iniciar un servicio pendiente o rechazado y el sistema lo bloquea.
6. Administrador modifica una cotización autorizada y el sistema conserva la versión previa y solicita nueva autorización.
