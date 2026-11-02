---
name: identidad-visual
description: Aplica la identidad visual y los principios de experiencia de TallerListo en todas las pantallas, componentes y estados.
---

# Skill — Identidad visual de TallerListo

## Personalidad
TallerListo debe transmitir orden, confianza, transparencia y oficio mecánico. Evitar el aspecto de una plantilla administrativa genérica o de un panel financiero.

## Dirección de arte
Usar una estética **editorial-industrial contemporánea**: referencias sutiles a órdenes de trabajo, fichas de servicio, señalética de taller y materiales de taller bien organizado. La interfaz debe sentirse diseñada para un negocio real, no como un dashboard SaaS intercambiable.

## Paleta propuesta
- Grafito profundo: `#20282B` — navegación y elementos de alta jerarquía.
- Marfil cálido: `#F4F1E9` — fondo principal.
- Blanco papel: `#FFFEFA` — superficies de lectura.
- Verde taller: `#376B5A` — acción primaria y estados positivos.
- Cobre: `#B66B42` — acentos, alertas suaves y detalles de identidad.
- Gris pizarra: `#687276` — texto secundario.
- Rojo: `#B94A48` — rechazo, error o bloqueo.
- Ámbar: `#C58A35` — espera o atención.

Mantener contraste suficiente. No utilizar el color como único indicador de estado.

## Tipografía y composición
- Usar una familia sans-serif legible y disponible en web; preferir Inter o Geist si ya están configuradas.
- Títulos compactos, jerarquía clara y textos funcionales fáciles de escanear.
- Utilizar números tabulares para importes, fechas y códigos de orden.
- Espaciado consistente; evitar densidad excesiva en móvil.
- No usar tipografía decorativa que reduzca la legibilidad.

## Diferenciación por usuario
### Mecánico
- Priorizar la tarea actual y la siguiente acción.
- Botones táctiles grandes y etiquetas concretas.
- Mostrar autorización de cada servicio cerca de la acción de iniciar trabajo.
- Evitar tablas extensas y navegación profunda.
- La pantalla debe poder utilizarse rápidamente desde un celular.

### Cliente
- Presentar el vehículo y su estado como una ficha de seguimiento clara.
- Mostrar una línea de progreso sencilla, última actualización y próximo paso.
- En cotización, distinguir visualmente servicios, mano de obra consolidada y total.
- Hacer explícita la consecuencia de aceptar o rechazar.

### Administrador
- Dar prioridad a órdenes que requieren atención: diagnóstico, autorización pendiente y trabajos detenidos.
- Usar listas operativas y filtros útiles; no llenar la pantalla de tarjetas métricas decorativas.
- Permitir abrir la orden y llegar a la acción correspondiente.

## Componentes
- Botón primario: acción principal única por pantalla.
- Botón secundario: acciones alternativas.
- Acción destructiva/rechazo: estilo diferenciado y confirmación cuando corresponda.
- Estados: etiqueta textual más icono o señal visual.
- Formularios: etiquetas visibles, validación y mensajes de error junto al campo.
- Notificaciones: cada elemento debe conducir a la orden o acción concreta que requiere atención.

## Evitar
- Dashboard con tarjetas idénticas para todo.
- Gradientes decorativos, sombras fuertes, exceso de bordes redondeados.
- Botones que no hacen nada.
- Menús que no navegan.
- Iconos ambiguos sin texto.
- Datos inventados presentados como reales.
- Animaciones que retrasen tareas.

## Criterio de calidad
Cada pantalla debe tener una jerarquía visual clara y una tarea principal. La consistencia no significa que todas las pantallas deban tener la misma composición: cada rol necesita una interfaz ajustada a su trabajo.
