"use client";

import { useEffect, useMemo, useState } from "react";

type Role = "admin" | "mechanic" | "client";
type ServiceStatus = "pending" | "approved" | "rejected" | "in_progress" | "done";
type Service = {
  id: string; name: string; detail: string; parts: number; status: ServiceStatus;
  operations: { id: string; label: string; cost: number }[];
};
type QuoteVersion = { version: number; createdAt: string; services: Service[]; decisionAt?: string; acceptedIds?: string[] };
type Order = {
  id: string; customer: string; phone: string; vehicle: string; plate: string; mechanic: string;
  status: string; updatedAt: string; diagnosis: string; services: Service[]; versions: QuoteVersion[];
};

const initialOrder: Order = {
  id: "OT-0248", customer: "María Fernanda Rojas", phone: "999 321 456", vehicle: "Toyota Yaris · 2020", plate: "BVK-284",
  mechanic: "Luis Mendoza", status: "Cotización pendiente", updatedAt: "02 nov 2026 · 10:35 a. m.",
  diagnosis: "Se detectó desgaste en las pastillas delanteras y líquido de frenos degradado. Se recomienda atender ambos puntos antes de continuar usando el vehículo.",
  services: [
    { id: "s1", name: "Cambio de pastillas delanteras", detail: "Repuestos incluidos · juego de pastillas", parts: 185, status: "pending", operations: [{ id: "elevador", label: "Uso de elevador y desmontaje de ruedas", cost: 45 }, { id: "frenos", label: "Intervención del sistema de frenos", cost: 65 }] },
    { id: "s2", name: "Cambio de líquido de frenos", detail: "Líquido DOT 4 · purgado del sistema", parts: 68, status: "pending", operations: [{ id: "elevador", label: "Uso de elevador y desmontaje de ruedas", cost: 45 }, { id: "purgado", label: "Purgado del circuito hidráulico", cost: 35 }] },
    { id: "s3", name: "Alineamiento de dirección", detail: "Alineamiento computarizado", parts: 0, status: "pending", operations: [{ id: "alineamiento", label: "Alineamiento computarizado", cost: 55 }] },
  ],
  versions: []
};

const money = (n: number) => new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", maximumFractionDigits: 2 }).format(n);
const statusText: Record<ServiceStatus, string> = { pending: "Pendiente de autorización", approved: "Autorizado", rejected: "Rechazado", in_progress: "En ejecución", done: "Finalizado" };
const statusClass: Record<ServiceStatus, string> = { pending: "pending", approved: "approved", rejected: "rejected", in_progress: "progress", done: "done" };
const uniqueLabor = (services: Service[]) => {
  const operations = new Map<string, { label: string; cost: number }>();
  services.forEach(service => service.operations.forEach(op => operations.set(op.id, op)));
  return Array.from(operations.values()).reduce((sum, op) => sum + op.cost, 0);
};
const serviceTotal = (services: Service[]) => services.reduce((sum, service) => sum + service.parts, 0) + uniqueLabor(services);

function readSaved(): Order {
  if (typeof window === "undefined") return initialOrder;
  try {
    const saved = localStorage.getItem("tallerlisto-order");
    return saved ? JSON.parse(saved) as Order : initialOrder;
  } catch { return initialOrder; }
}

export default function TallerListoApp() {
  const [role, setRole] = useState<Role>("admin");
  const [order, setOrder] = useState<Order>(initialOrder);
  const [selected, setSelected] = useState<string[]>([]);
  const [view, setView] = useState("orders");
  const [notice, setNotice] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("90");

  useEffect(() => { setOrder(readSaved()); }, []);
  useEffect(() => { if (typeof window !== "undefined") localStorage.setItem("tallerlisto-order", JSON.stringify(order)); }, [order]);

  const quoteServices = order.services.filter(s => s.status !== "rejected");
  const selectedServices = order.services.filter(s => selected.includes(s.id));
  const labor = uniqueLabor(selectedServices);
  const total = serviceTotal(selectedServices);
  const accepted = order.services.filter(s => s.status === "approved" || s.status === "in_progress" || s.status === "done");
  const pending = order.services.filter(s => s.status === "pending");
  const needsAttention = pending.length > 0;
  const allDone = order.services.length > 0 && order.services.every(s => s.status === "done" || s.status === "rejected");

  const updateOrder = (next: Order, message: string) => {
    setOrder({ ...next, updatedAt: new Date().toLocaleString("es-PE", { dateStyle: "medium", timeStyle: "short" }) });
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3600);
  };

  const authorize = () => {
    if (!selected.length) return;
    const nextServices = order.services.map(s => ({ ...s, status: selected.includes(s.id) ? "approved" as ServiceStatus : s.status === "pending" ? "rejected" as ServiceStatus : s.status }));
    const decisionAt = new Date().toLocaleString("es-PE", { dateStyle: "medium", timeStyle: "short" });
    const version = order.versions.length + 1;
    const snapshot: QuoteVersion = { version, createdAt: decisionAt, services: order.services.map(s => ({ ...s })), decisionAt, acceptedIds: [...selected] };
    updateOrder({ ...order, services: nextServices, versions: [...order.versions, snapshot], status: nextServices.some(s => s.status === "approved") ? "Autorización parcial" : "Cotización rechazada" }, "Decisión registrada en esta demostración.");
    setSelected([]);
    setShowConfirm(false);
  };

  const rejectAll = () => {
    const decisionAt = new Date().toLocaleString("es-PE", { dateStyle: "medium", timeStyle: "short" });
    const version = order.versions.length + 1;
    const snapshot: QuoteVersion = { version, createdAt: decisionAt, services: order.services.map(s => ({ ...s })), decisionAt, acceptedIds: [] };
    const nextServices = order.services.map(s => s.status === "pending" ? { ...s, status: "rejected" as ServiceStatus } : s);
    updateOrder({ ...order, services: nextServices, versions: [...order.versions, snapshot], status: "Cotización rechazada" }, "Rechazo registrado en esta demostración.");
    setSelected([]);
  };

  const startService = (id: string) => {
    const target = order.services.find(s => s.id === id);
    if (!target || target.status !== "approved") {
      setNotice("Bloqueado: este servicio no tiene autorización vigente.");
      return;
    }
    updateOrder({ ...order, services: order.services.map(s => s.id === id ? { ...s, status: "in_progress" } : s), status: "En reparación" }, "Trabajo iniciado.");
  };
  const finishService = (id: string) => {
    const next = order.services.map(s => s.id === id && s.status === "in_progress" ? { ...s, status: "done" as ServiceStatus } : s);
    updateOrder({ ...order, services: next, status: next.every(s => s.status === "done" || s.status === "rejected") ? "Trabajo finalizado" : "En reparación" }, "Avance actualizado.");
  };
  const reviseQuote = () => {
    const name = newServiceName.trim();
    const price = Number(newServicePrice);
    if (!name || !Number.isFinite(price) || price < 0) { setNotice("Ingresa un servicio y un importe válido."); return; }
    const nextVersion = order.versions.length + 1;
    const service: Service = { id: "s" + Date.now(), name, detail: "Servicio agregado en una nueva versión de cotización", parts: price, status: "pending", operations: [{ id: "extra-" + nextVersion, label: "Mano de obra del servicio adicional", cost: 40 }] };
    const oldSnapshot: QuoteVersion = { version: nextVersion, createdAt: new Date().toLocaleString("es-PE"), services: order.services.map(s => ({ ...s })) };
    updateOrder({ ...order, services: [...order.services, service], versions: [...order.versions, oldSnapshot], status: "Nueva cotización pendiente" }, "Nueva versión creada. Requiere autorización.");
    setNewServiceName("");
    setView("quote");
  };
  const resetDemo = () => { localStorage.removeItem("tallerlisto-order"); setOrder(initialOrder); setSelected([]); setNotice("Demostración restablecida."); };

  const nav = role === "admin"
    ? [{ id: "orders", label: "Órdenes de trabajo", icon: "▤" }, { id: "attention", label: "Requieren atención", icon: "◷" }, { id: "history", label: "Historial", icon: "↺" }]
    : role === "mechanic"
    ? [{ id: "work", label: "Mi trabajo", icon: "⚒" }]
    : [{ id: "tracking", label: "Seguimiento", icon: "◎" }, { id: "quote", label: "Cotización", icon: "▧" }, { id: "decision", label: "Mis decisiones", icon: "✓" }];

  useEffect(() => { setView(role === "admin" ? "orders" : role === "mechanic" ? "work" : "tracking"); }, [role]);

  const pageTitle = role === "admin" ? (view === "attention" ? "Requieren atención" : view === "history" ? "Historial de decisiones" : "Órdenes de trabajo") : role === "mechanic" ? "Mi trabajo" : view === "quote" ? "Cotización de reparación" : view === "decision" ? "Mis decisiones" : "Seguimiento del vehículo";

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">TL</div><div><strong>TallerListo</strong><span>GESTIÓN DE TALLER</span></div></div>
      <div className="workspace-label">ESPACIO DE TRABAJO</div>
      <div className="role-switch">
        <label htmlFor="role">Vista de demostración</label>
        <select id="role" value={role} onChange={e => setRole(e.target.value as Role)}>
          <option value="admin">Administrador</option><option value="mechanic">Mecánico</option><option value="client">Cliente</option>
        </select>
      </div>
      <nav className="side-nav" aria-label="Navegación principal">
        {nav.map(item => <button key={item.id} className={view === item.id ? "nav-item active" : "nav-item"} onClick={() => setView(item.id)}><span className="nav-icon">{item.icon}</span>{item.label}{item.id === "attention" && needsAttention && <i className="nav-dot" />}</button>)}
      </nav>
      <div className="sidebar-bottom"><div className="demo-tag"><span /> MODO DEMOSTRACIÓN</div><button className="reset-link" onClick={resetDemo}>↻ Restablecer datos demo</button><div className="user-mini"><div className="avatar">{role === "admin" ? "AR" : role === "mechanic" ? "LM" : "MR"}</div><div><strong>{role === "admin" ? "Ana Ramírez" : role === "mechanic" ? "Luis Mendoza" : "María F. Rojas"}</strong><span>{role === "admin" ? "Administradora" : role === "mechanic" ? "Mecánico" : "Cliente"}</span></div></div></div>
    </aside>

    <main className="main-area">
      <header className="topbar"><div className="breadcrumb">TALLERLISTO <span>/</span> {role === "admin" ? "ADMINISTRACIÓN" : role === "mechanic" ? "TALLER" : "PORTAL DEL CLIENTE"}</div><div className="top-actions"><span className="today">Lunes, 02 de noviembre de 2026</span><div className="avatar small">{role === "admin" ? "AR" : role === "mechanic" ? "LM" : "MR"}</div></div></header>
      <div className="content">
        <div className="page-heading"><div><div className="eyebrow">{role === "admin" ? "CENTRO DE OPERACIONES" : role === "mechanic" ? "TRABAJO ASIGNADO" : "PORTAL DE CLIENTE"}</div><h1>{pageTitle}</h1><p>{role === "admin" ? "Controla las órdenes y resuelve los pendientes del taller." : role === "mechanic" ? "Consulta tus trabajos y registra avances autorizados." : "Consulta el avance de tu vehículo y decide con información clara."}</p></div><div className="heading-code"><span>ORDEN ACTIVA</span><strong>{order.id}</strong></div></div>
        {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice("")}>×</button></div>}

        {role === "admin" && view === "orders" && <><div className="summary-strip"><div><span>ÓRDENES ACTIVAS</span><strong>01</strong></div><div><span>REQUIEREN ATENCIÓN</span><strong>{needsAttention ? "01" : "00"}</strong></div><div><span>SERVICIOS AUTORIZADOS</span><strong>{accepted.length.toString().padStart(2,"0")}</strong></div></div><section className="panel"><div className="panel-head"><div><span className="eyebrow">LISTADO OPERATIVO</span><h2>Órdenes recientes</h2></div><span className="count-pill">1 orden</span></div><div className="order-row"><div className="order-symbol">OT</div><div className="order-main"><strong>{order.id} · {order.vehicle}</strong><span>{order.customer} · Placa {order.plate}</span><div className="row-tags"><StatusPill text={order.status} kind={needsAttention ? "pending" : "approved"} /><span>Actualizado {order.updatedAt}</span></div></div><button className="button secondary" onClick={() => setView("attention")}>Ver detalle →</button></div></section><section className="panel"><div className="panel-head"><div><span className="eyebrow">PRÓXIMA ACCIÓN</span><h2>Atención requerida</h2></div></div>{needsAttention ? <div className="attention-row"><div className="attention-icon">!</div><div><strong>Esperando decisión del cliente</strong><span>{pending.length} servicio(s) pendiente(s) de autorización en {order.id}.</span></div><button className="text-button" onClick={() => setRole("client")}>Abrir vista del cliente →</button></div> : <p className="muted">No hay autorizaciones pendientes.</p>}</section></>}

        {role === "admin" && view === "attention" && <><section className="panel"><div className="panel-head"><div><span className="eyebrow">DETALLE DE ORDEN</span><h2>{order.id} · {order.vehicle}</h2><p>{order.customer} · {order.plate} · Asignado a {order.mechanic}</p></div><StatusPill text={order.status} kind="pending" /></div><div className="diagnosis"><strong>Diagnóstico</strong><p>{order.diagnosis}</p></div><ServiceList services={order.services} /><div className="panel-foot"><button className="button secondary" onClick={() => setRole("client")}>Ver como cliente</button><button className="button primary" onClick={() => setRole("mechanic")}>Ver como mecánico</button></div></section><section className="panel"><div className="panel-head"><div><span className="eyebrow">NUEVA VERSIÓN</span><h2>Agregar servicio o modificar cotización</h2><p>Los cambios generan una nueva versión pendiente de autorización.</p></div></div><div className="inline-form"><input value={newServiceName} onChange={e => setNewServiceName(e.target.value)} placeholder="Nombre del nuevo servicio" aria-label="Nombre del nuevo servicio" /><input value={newServicePrice} onChange={e => setNewServicePrice(e.target.value)} type="number" min="0" aria-label="Precio del servicio" /><button className="button primary" onClick={reviseQuote}>Crear nueva versión</button></div></section></>}

        {role === "admin" && view === "history" && <section className="panel"><div className="panel-head"><div><span className="eyebrow">TRAZABILIDAD</span><h2>Versiones y decisiones</h2></div></div>{order.versions.length ? order.versions.map(v => <div className="history-row" key={v.version}><div className="version-badge">V{v.version}</div><div><strong>Cotización versión {v.version}</strong><span>Creada {v.createdAt}{v.decisionAt ? " · Decisión " + v.decisionAt : " · Sin decisión registrada"}</span></div><span className="history-total">{money(serviceTotal(v.services))}</span></div>) : <div className="empty-state">Todavía no hay versiones anteriores. La cotización inicial es la versión 1.</div>}</section>}

        {role === "mechanic" && view === "work" && <section className="panel"><div className="panel-head"><div><span className="eyebrow">ORDEN ASIGNADA</span><h2>{order.id} · {order.vehicle}</h2><p>{order.customer} · Placa {order.plate}</p></div><StatusPill text={order.status} kind="progress" /></div><div className="diagnosis"><strong>Diagnóstico registrado</strong><p>{order.diagnosis}</p></div><div className="service-list">{order.services.map(s => <div className="service-line" key={s.id}><div className="service-info"><strong>{s.name}</strong><span>{s.detail}</span><StatusPill text={statusText[s.status]} kind={statusClass[s.status]} /></div><div className="service-action">{s.status === "approved" ? <button className="button primary" onClick={() => startService(s.id)}>Iniciar trabajo</button> : s.status === "in_progress" ? <button className="button secondary" onClick={() => finishService(s.id)}>Marcar finalizado</button> : <button className="button disabled" disabled>{s.status === "pending" ? "Esperando autorización" : s.status === "rejected" ? "No autorizado" : "Finalizado"}</button>}</div></div>)}</div><div className="helper-note">Regla del taller: solo los servicios con autorización vigente pueden pasar a ejecución.</div></section>}

        {role === "client" && view === "tracking" && <><section className="vehicle-card"><div><span className="eyebrow">TU VEHÍCULO</span><h2>{order.vehicle}</h2><p>Placa {order.plate} · Orden {order.id}</p></div><div className="vehicle-stamp">TL</div></section><section className="panel"><div className="panel-head"><div><span className="eyebrow">ESTADO ACTUAL</span><h2>{order.status}</h2><p>Última actualización: {order.updatedAt}</p></div><StatusPill text={order.status} kind={needsAttention ? "pending" : "approved"} /></div><div className="progress-track"><div className="progress-step complete"><i>✓</i><span>Recibido</span></div><div className="progress-step complete"><i>✓</i><span>Diagnóstico</span></div><div className={needsAttention ? "progress-step current" : "progress-step complete"}><i>{needsAttention ? "3" : "✓"}</i><span>Cotización</span></div><div className="progress-step"><i>4</i><span>Reparación</span></div><div className="progress-step"><i>5</i><span>Listo</span></div></div><div className="next-step"><strong>¿Qué sigue?</strong><p>{needsAttention ? "Revisa la cotización y confirma qué servicios autorizas. El taller solo iniciará los trabajos aprobados." : "El taller actualizará aquí el avance de los trabajos autorizados."}</p><button className="button primary" onClick={() => setView("quote")}>Revisar cotización →</button></div></section><section className="panel"><div className="panel-head"><div><span className="eyebrow">INFORMACIÓN DEL TALLER</span><h2>Diagnóstico</h2></div></div><p className="body-copy">{order.diagnosis}</p></section></>}

        {role === "client" && view === "quote" && <section className="panel quote-panel"><div className="panel-head"><div><span className="eyebrow">COTIZACIÓN · VERSIÓN {order.versions.length + 1}</span><h2>Servicios recomendados</h2><p>Selecciona únicamente los trabajos que deseas autorizar.</p></div><StatusPill text={needsAttention ? "Requiere tu decisión" : "Decisión registrada"} kind={needsAttention ? "pending" : "approved"} /></div><div className="quote-list">{order.services.map(s => <label className={selected.includes(s.id) ? "quote-item selected" : "quote-item"} key={s.id}><input type="checkbox" checked={selected.includes(s.id)} disabled={s.status !== "pending"} onChange={e => setSelected(old => e.target.checked ? [...old, s.id] : old.filter(id => id !== s.id))} /><span className="check-custom">{selected.includes(s.id) ? "✓" : ""}</span><span className="quote-description"><strong>{s.name}</strong><small>{s.detail}</small><StatusPill text={statusText[s.status]} kind={statusClass[s.status]} /></span><strong className="price">{money(s.parts)}</strong></label>)}</div><div className="quote-totals"><div><span>Repuestos y materiales</span><strong>{money(selectedServices.reduce((sum,s) => sum+s.parts,0))}</strong></div><div><span>Mano de obra consolidada</span><strong>{money(labor)}</strong></div><div className="grand-total"><span>Total a autorizar</span><strong>{money(total)}</strong></div><small>La mano de obra compartida se contabiliza una sola vez cuando seleccionas servicios combinados.</small></div><div className="quote-actions"><button className="button secondary" onClick={rejectAll} disabled={!pending.length}>Rechazar todos</button><button className="button secondary" onClick={() => setSelected(order.services.filter(s => s.status === "pending").map(s => s.id))}>Seleccionar todos</button><button className="button primary" disabled={!selected.length} onClick={() => setShowConfirm(true)}>Confirmar selección</button></div>{showConfirm && <div className="confirm-overlay"><div className="confirm-card"><span className="eyebrow">CONFIRMACIÓN EXPLÍCITA</span><h3>¿Confirmas esta autorización?</h3><p>Autorizarás {selected.length} servicio(s) por {money(total)}. Los servicios no seleccionados quedarán rechazados en esta versión.</p><div className="confirm-actions"><button className="button secondary" onClick={() => setShowConfirm(false)}>Volver</button><button className="button primary" onClick={authorize}>Sí, confirmar</button></div></div></div>}</section>}

        {role === "client" && view === "decision" && <section className="panel"><div className="panel-head"><div><span className="eyebrow">REGISTRO DE AUTORIZACIÓN</span><h2>Mis decisiones</h2></div></div>{order.versions.filter(v => v.decisionAt).length ? order.versions.filter(v => v.decisionAt).map(v => <div className="history-row" key={v.version}><div className="version-badge">V{v.version}</div><div><strong>Decisión sobre cotización</strong><span>{v.decisionAt} · {v.acceptedIds?.length || 0} servicio(s) aceptado(s)</span></div><span className="history-total">{money(v.services.filter(s => v.acceptedIds?.includes(s.id)).reduce((sum,s) => sum+s.parts,0) + uniqueLabor(v.services.filter(s => v.acceptedIds?.includes(s.id))))}</span></div>) : <div className="empty-state">Aún no has confirmado ninguna decisión.</div>}</section>}
      </div>
      <footer className="footer"><span>TALLERLISTO · PROTOTIPO FUNCIONAL</span><span>Datos locales de demostración · No representa una conexión multiusuario real</span></footer>
    </main>
  </div>;
}

function StatusPill({ text, kind }: { text: string; kind: string }) { return <span className={"status-pill " + kind}><i />{text}</span>; }
function ServiceList({ services }: { services: Service[] }) { return <div className="service-list">{services.map(s => <div className="service-line" key={s.id}><div className="service-info"><strong>{s.name}</strong><span>{s.detail}</span><StatusPill text={statusText[s.status]} kind={statusClass[s.status]} /></div><strong>{money(s.parts)}</strong></div>)}</div>; }
