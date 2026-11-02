# TallerListo

Prototipo web para gestionar órdenes de trabajo, consultar el estado de vehículos y autorizar reparaciones.

## Funcionalidades incluidas
- Vistas de demostración para Administrador, Mecánico y Cliente.
- Seguimiento de una orden de trabajo y diagnóstico.
- Autorización total, parcial o rechazo de servicios.
- Cálculo de mano de obra consolidada sin duplicar operaciones compartidas.
- Bloqueo de ejecución de servicios no autorizados.
- Historial de decisiones y creación de nuevas versiones de cotización.
- Interfaz adaptable a escritorio y celular.

## Ejecución local
```bash
pnpm install
pnpm dev
```

## Limitaciones de la demostración
La versión inicial utiliza una orden ficticia y almacenamiento local del navegador. No implementa autenticación, base de datos multiusuario, persistencia compartida, notificaciones reales ni pagos. Las acciones realizadas en un navegador no se sincronizan con otros dispositivos.

Las reglas funcionales y criterios de aceptación están en `AGENTS.md` y `specs/`.
