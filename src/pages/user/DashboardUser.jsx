import React, { useState, useEffect } from 'react';
import '../styles/styles_user/DashboardUser.css';

import {
  MdSchool,
  MdAutoStories,
  MdHistory,
  MdEventAvailable,
  MdLocationOn,
  MdSchedule,
  MdBookmarkBorder,
  MdInfo,
  MdCheckCircle,
  MdWarning
} from 'react-icons/md';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/dashboard`
  : "http://localhost:3210/api/dashboard";

const DashboardUser = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const cargarStats = async () => {
      try {
        const res = await fetch(`${API_URL}/mis-estadisticas`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        const json = await res.json();

        if (!res.ok) {
          setError(true);
        } else {
          setStats(json.data);
        }
      } catch (err) {
        console.error("Error al cargar estadísticas:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    cargarStats();
  }, [token]);

  const formatearFecha = (fecha) => {
    if (!fecha) return "—";
    const date = new Date(fecha);
    if (Number.isNaN(date.getTime())) return fecha;
    return date.toLocaleDateString("es-PY", { year: "numeric", month: "short", day: "numeric" });
  };

  const construirFrecuenciaChart = () => {
    if (!stats) return [];
    const mesActual = new Date().getMonth() + 1;
    const ultimosSeisMeses = [];
    for (let i = 5; i >= 0; i--) {
      let mes = mesActual - i;
      if (mes <= 0) mes += 12;
      const registro = stats.frecuenciaMensual.find(f => f.mes === mes);
      ultimosSeisMeses.push({
        label: MESES[mes - 1],
        cantidad: registro ? parseInt(registro.cantidad) : 0
      });
    }
    const maxCantidad = Math.max(...ultimosSeisMeses.map(m => m.cantidad), 1);
    return ultimosSeisMeses.map(m => ({
      ...m,
      alturaPct: Math.max(Math.round((m.cantidad / maxCantidad) * 100), m.cantidad > 0 ? 8 : 2)
    }));
  };

  // SKELETON DE CARGA
  if (loading) {
    return (
      <>
        <header className="dashboard-header">
          <div className="dashboard-header__container">
            <div className="dashboard-header__brand">
              <span className="dashboard-header__label">Bienvenidos al portal</span>
              <div className="dashboard-header__title-wrapper">
                <MdSchool className="dashboard-header__icon" size={32} />
                <h1 className="dashboard-header__title">Biblioteca FCyT</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="dashboard-main">
          <section className="stats-grid">
            {[1, 2, 3, 4].map(i => (
              <article key={i} className="stat-card skeleton-card">
                <div className="skeleton-line skeleton-line--short"></div>
                <div className="skeleton-line skeleton-line--value"></div>
                <div className="skeleton-line skeleton-line--short"></div>
              </article>
            ))}
          </section>

          <section className="activity-chart-grid">
            <article className="activity-panel skeleton-card">
              <div className="skeleton-line skeleton-line--title"></div>
              <div className="skeleton-line skeleton-line--sub"></div>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="skeleton-bar-line"></div>
              ))}
            </article>

            <article className="chart-panel skeleton-card">
              <div className="skeleton-line skeleton-line--title"></div>
              <div className="skeleton-line skeleton-line--sub"></div>
              <div className="skeleton-chart-bars">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="skeleton-bar" style={{ height: `${30 + (i % 3) * 20}%` }}></div>
                ))}
              </div>
            </article>
          </section>
        </main>
      </>
    );
  }

  if (error || !stats) {
    return (
      <div className="dashboard-loading">
        <p>No se pudieron cargar tus estadísticas. Intentá nuevamente más tarde.</p>
      </div>
    );
  }

  const chartData = construirFrecuenciaChart();

  return (
    <>
      <header className="dashboard-header">
        <div className="dashboard-header__container">
          <div className="dashboard-header__brand">
            <span className="dashboard-header__label">Bienvenidos al portal</span>
            <div className="dashboard-header__title-wrapper">
              <MdSchool className="dashboard-header__icon" size={32} />
              <h1 className="dashboard-header__title">Biblioteca FCyT</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="stats-grid">
          <article className="stat-card stat-card--hover-primary">
            <span className="stat-card__label">Libros Leídos</span>
            <span className="stat-card__value">{stats.librosLeidos}</span>
            <div className="stat-card__meta">
              <MdAutoStories className="stat-card__meta-icon" />
              <span>Total acumulado</span>
            </div>
          </article>

          <article className="stat-card stat-card--hover-primary">
            <span className="stat-card__label">Préstamos Activos</span>
            <span className="stat-card__value">{String(stats.prestamosActivos).padStart(2, '0')}</span>
            <div className="stat-card__meta">
              <MdHistory className="stat-card__meta-icon" />
              <span>En posesión</span>
            </div>
          </article>

          <article className="stat-card stat-card--hover-primary">
            <span className="stat-card__label">Reservas</span>
            <span className="stat-card__value">{String(stats.reservas).padStart(2, '0')}</span>
            <div className="stat-card__meta">
              <MdBookmarkBorder className="stat-card__meta-icon" />
              <span>En espera</span>
            </div>
          </article>

          <article className={`stat-card stat-card--hover-primary ${stats.sancionado ? 'stat-card--alerta' : ''}`}>
            <span className="stat-card__label">Estado de Cuenta</span>
            <span className="stat-card__value">
              {stats.sancionado ? 'Sancionado' : 'Habilitado'}
            </span>
            <div className="stat-card__meta">
              {stats.sancionado
                ? <MdWarning className="stat-card__meta-icon" />
                : <MdCheckCircle className="stat-card__meta-icon" />
              }
              <span>{stats.sancionado ? 'Con sanciones activas' : 'Sin sanciones activas'}</span>
            </div>
          </article>
        </section>

        <section className="activity-chart-grid">
          <article className="activity-panel">
            <h2 className="activity-panel__title">Interés Académico</h2>
            <p className="activity-panel__subtitle">Distribución de tus lecturas por libro</p>

            <div className="progress-list">
              {stats.interesAcademico.length === 0 ? (
                <p className="activity-panel__vacio">Todavía no tenés libros devueltos registrados.</p>
              ) : (
                stats.interesAcademico.map((item, i) => (
                  <div key={i} className="progress-item">
                    <div className="progress-item__header">
                      <span>{item.titulo}</span>
                      <span>{item.porcentaje}%</span>
                    </div>
                    <div className="progress-item__bar">
                      <div
                        className={`progress-item__fill ${i === stats.interesAcademico.length - 1 ? 'progress-item__fill--secondary' : ''}`}
                        style={{ width: `${item.porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="chart-panel">
            <div className="chart-panel__header">
              <div>
                <h2 className="chart-panel__title">Frecuencia de mis Préstamos</h2>
                <p className="chart-panel__subtitle">Préstamos registrados año {new Date().getFullYear()}</p>
              </div>
            </div>

            <div className="chart-panel__body">
              {chartData.map((m, i) => (
                <div key={i} className="chart-bar">
                  <div className="chart-bar__container">
                    <div className="chart-bar__fill" style={{ height: `${m.alturaPct}%` }}></div>
                  </div>
                  <span className="chart-bar__label">{m.label} ({m.cantidad})</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="books-section">
          <div className="books-section__header">
            <h2 className="books-section__title">Últimos Recursos Utilizados</h2>
            <p className="books-section__subtitle">Historial de devoluciones</p>
          </div>

          {stats.ultimosRecursos.length === 0 ? (
            <p className="activity-panel__vacio">Todavía no devolviste ningún material.</p>
          ) : (
            <div className="books-grid">
              {stats.ultimosRecursos.map((lib, i) => (
                <article key={i} className="book-card">
                  <div className="book-card__content">
                    <div className="book-card__image-wrapper">
                      {lib.imagen_url
                        ? <img className="book-card__image" src={lib.imagen_url} alt={lib.titulo} />
                        : <span className="book-card__image-placeholder">{lib.titulo?.charAt(0)}</span>
                      }
                    </div>
                    <h3 className="book-card__title">{lib.titulo}</h3>
                    <p className="book-card__stats">
                      {formatearTipoEstado(lib.estado_devuelto)} · {formatearFecha(lib.fecha_devolucion)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="alerts-section">
          <h2 className="alerts-section__title">
            <MdInfo size={22} /> Información de Biblioteca
          </h2>

          <div className="alerts-grid">
            <article className="alert-card alert-card--primary">
              <MdSchedule size={22} />
              <div>
                <p className="alert-card__title">Horario</p>
                <p>Lunes a Viernes: 07:00 — 15:00</p>
              </div>
            </article>

            <article className="alert-card alert-card--primary">
              <MdLocationOn size={22} />
              <div>
                <p className="alert-card__title">Ubicación</p>
                <p>Campus FCyT</p>
              </div>
            </article>
          </div>
        </section>
      </main>
    </>
  );
};

const formatearTipoEstado = (estado) => {
  const map = {
    bueno: 'Finalizado',
    deteriorado: 'Devuelto con deterioro',
    danado: 'Devuelto con daño',
    reemplazado: 'Material reemplazado'
  };
  return map[estado] || estado;
};

export default DashboardUser;