# SPEC — Recepción digital del vehículo

## Contexto
TallerListo está orientado a talleres mecánicos independientes pequeños o medianos (3 a 8 mecánicos) que gestionan ingresos de vehículos con llamadas, WhatsApp, papel y hojas de cálculo. El taller necesita dejar constancia del estado visible del vehículo al momento de recibirlo.

## Problema
Cuando un cliente entrega su vehículo, pueden existir rayones, golpes, accesorios faltantes u otras condiciones previas. Si no se registran, pueden surgir desacuerdos al momento de la entrega.

## Objetivo
Registrar una inspección inicial simple, vinculada a la orden de trabajo, para que el taller y el cliente tengan una referencia común del estado del vehículo recibido.

## Usuario principal
Mecánico o asesor de servicio que recibe el vehículo desde un teléfono móvil. Usuario secundario: cliente que revisa y confirma el registro.

## Flujo principal
1. El colaborador abre una orden y selecciona “Recepción del vehículo”.
2. Completa un checklist de elementos visibles.
3. Registra observaciones sobre daños y accesorios entregados.
4. Guarda el registro de recepción.
5. El cliente revisa el registro y confirma que recibió la información.

## Reglas de negocio
- La recepción pertenece a una orden y a un vehículo.
- Cada elemento del checklist debe quedar como “Conforme”, “Con observación” o “No revisado”.
- Las observaciones describen condiciones visibles; no son un diagnóstico mecánico.
- La confirmación del cliente acredita que revisó el registro, no que acepta reparaciones ni costos.
- Una recepción confirmada no se sobrescribe silenciosamente. Las correcciones deben generar una nueva revisión con fecha y responsable.
- La recepción no autoriza reparaciones adicionales ni representa un pago.

## Criterios de aceptación
- **CA-01:** El mecánico puede crear una recepción vinculada a una orden existente.
- **CA-02:** El checklist permite seleccionar uno de los tres estados para cada elemento.
- **CA-03:** El mecánico puede registrar observaciones sobre daños visibles y accesorios recibidos.
- **CA-04:** El cliente puede consultar el registro y confirmar que lo revisó.
- **CA-05:** Una recepción confirmada conserva su contenido; cualquier corrección queda identificada como una nueva revisión.

## Métricas de éxito
Metas iniciales para un piloto de tres meses; no son resultados medidos:
- Al menos 80% de los vehículos ingresados cuentan con recepción digital.
- Al menos 90% de las recepciones tienen el checklist completo.
- Al menos 80% de las recepciones son revisadas y confirmadas por el cliente.
- Tiempo promedio de registro igual o menor a 5 minutos.
- Reducir en 30% los reclamos por discrepancias sobre el estado visible inicial del vehículo.

## Fuera de alcance
- Peritajes, diagnóstico automatizado o valoración de daños.
- Firma digital con validez legal.
- Almacenamiento ilimitado de fotografías.
- Pagos, inventario, integración con WhatsApp o notificaciones externas.

## Consideraciones de implementación
La primera versión puede validar el flujo con datos de demostración en un solo navegador. Para uso real entre distintos dispositivos se requiere autenticación, backend, base de datos y almacenamiento seguro de evidencias.
