# AGENTS.md — TallerListo

## Propósito del proyecto
TallerListo es una solución digital para un taller mecánico. Busca reducir las llamadas repetidas de los clientes y evitar que las reparaciones adicionales se ejecuten sin autorización verificable.

El producto debe ayudar a coordinar órdenes de trabajo, diagnósticos, cotizaciones, autorizaciones y consulta del estado del vehículo. No asumir que el canal final será una app nativa: priorizar una experiencia web adaptable a celular.

## Usuarios y necesidades
- **Administrador/dueño:** supervisa órdenes, asignaciones, cotizaciones y autorizaciones.
- **Mecánico:** registra diagnóstico, avances y servicios recomendados desde el celular con pocas interacciones.
- **Cliente:** consulta el estado de su propio vehículo y decide qué servicios cotizados autoriza.

## Reglas de negocio obligatorias
1. Una solicitud de revisión o inspección NO equivale a autorizar una reparación.
2. Toda reparación adicional debe tener una cotización y autorización explícita antes de ejecutarse.
3. El cliente puede aceptar todos los servicios, algunos o rechazarlos.
4. La cotización debe mostrar la mano de obra consolidada al cliente. El cálculo interno puede considerar tarifas por servicio y operaciones compartidas; no sumar automáticamente importes duplicados.
5. Una autorización debe quedar vinculada a cliente, orden, versión de cotización, servicios aceptados/rechazados, importe y fecha/hora.
6. Si cambia una cotización ya autorizada, crear una nueva versión. Nunca modificar silenciosamente la versión aprobada; los cambios que requieran autorización deben volver a solicitarla.
7. Autorización, pago y confirmación de pago son eventos distintos. El alcance actual no implementa pagos.
8. Un servicio pendiente de autorización no debe mostrarse como autorizado ni habilitarse para ejecución.
9. El cliente solo puede consultar la orden asociada a su enlace o sesión autorizada. No exponer datos de otros clientes.

## Alcance del entregable actual
Implementar y validar el feature descrito en `specs/seguimiento-y-aprobacion.md`. No ampliar el alcance sin actualizar primero la especificación.

## Exclusiones
- Inventario y compras (el taller ya lleva inventario en Excel).
- Contabilidad, facturación y nómina.
- Pasarela de pagos.
- Envío real de WhatsApp/SMS.
- Aplicación móvil nativa.
- Integraciones externas que no estén configuradas y probadas.

## Reglas de experiencia
- Español claro y natural; moneda PEN (S/).
- Diseño mobile-first, especialmente para mecánicos.
- Formularios cortos y acciones principales visibles.
- Mostrar estados y fechas de actualización de forma comprensible.
- Diferenciar visualmente acciones disponibles, pendientes y completadas.
- No depender solo del color para comunicar estados.
- Evitar dashboards SaaS genéricos y componentes decorativos sin función.
- La dirección visual detallada está en `.agents/skills/identidad-visual/SKILL.md` y `specs/experiencia-visual-y-navegacion.md`.

## Reglas técnicas y de integridad
- No afirmar que existe conexión con base de datos, autenticación, WhatsApp o pagos si no está implementada y verificada.
- Si se usan datos demo, identificarlos como demostración y mantener consistencia entre las pantallas.
- Las acciones deben actualizar el estado compartido de la aplicación y reflejarse en las áreas relacionadas; no crear botones que solo cambien el aspecto de la pantalla.
- Validar permisos en servidor cuando exista backend; ocultar un botón no es control de acceso suficiente.
- No exponer secretos ni credenciales en el navegador.
- No inventar datos reales de clientes.

## Método de trabajo del agente
1. Leer esta guía, la especificación funcional y la especificación visual antes de modificar código.
2. Resumir el alcance y los criterios de aceptación.
3. Revisar la estructura y el código existente antes de reemplazar componentes.
4. Proponer un plan breve y conservar las partes que ya funcionan.
5. Implementar solo lo necesario para cumplir el alcance.
6. Probar cada criterio de aceptación y cada navegación/interacción afectada.
7. Reportar qué funciona, qué usa datos demo, qué está conectado realmente y qué queda pendiente.
8. Si un requisito es ambiguo o contradictorio, proponer una corrección a la especificación antes de cambiar el prompt. No modificar la especificación solo para justificar un fallo de implementación.
