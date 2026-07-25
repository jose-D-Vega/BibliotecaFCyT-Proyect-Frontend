import React, { useState, useEffect } from 'react';
import './styles/DashboardUser.css';
import { getMisEstadisticas } from '../../services/dashboard.services';

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

const DashboardUser = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const cargarStats = async () => {
      try {
        const data = await getMisEstadisticas();
        setStats(data);
      } catch (err) {
        console.error("Error al cargar estadísticas:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    cargarStats();
  }, []);

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

  // CARGA
  if (loading) {
    return (
      <div className="ud-spinner-page">
        <div className="ud-spinner"></div>
        <p className="ud-spinner-text">Cargando tu biblioteca...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="ud-loading">
        <p>No se pudieron cargar tus estadísticas. Intentá nuevamente más tarde.</p>
      </div>
    );
  }

  const chartData = construirFrecuenciaChart();

  return (
    <div className="ud-page">
      <header className="ud-header">
        <div className="ud-header__container">
          <div className="ud-header__brand">
            <div className="ud-header__icon-box">
              <MdSchool size={24} />
            </div>
            <div className="ud-header__text-group">
              <span className="ud-header__badge">
                <span className="ud-header__badge-dot"></span>
                PORTAL DEL ESTUDIANTE
              </span>
              <h1 className="ud-header__title">Mi Biblioteca</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="ud-main">
        <section className="ud-stats-grid">
          <article className="ud-stat-card ud-stat-card--hover-primary">
            <span className="ud-stat-card__label">Libros Leídos</span>
            <span className="ud-stat-card__value">{stats.librosLeidos}</span>
            <div className="ud-stat-card__meta">
              <MdAutoStories className="ud-stat-card__meta-icon" />
              <span>Total acumulado</span>
            </div>
          </article>

          <article className="ud-stat-card ud-stat-card--hover-primary">
            <span className="ud-stat-card__label">Préstamos Activos</span>
            <span className="ud-stat-card__value">{String(stats.prestamosActivos).padStart(2, '0')}</span>
            <div className="ud-stat-card__meta">
              <MdHistory className="ud-stat-card__meta-icon" />
              <span>En posesión</span>
            </div>
          </article>

          <article className="ud-stat-card ud-stat-card--hover-primary">
            <span className="ud-stat-card__label">Reservas</span>
            <span className="ud-stat-card__value">{String(stats.reservas).padStart(2, '0')}</span>
            <div className="ud-stat-card__meta">
              <MdBookmarkBorder className="ud-stat-card__meta-icon" />
              <span>En espera</span>
            </div>
          </article>

          <article className={`ud-stat-card ud-stat-card--hover-primary ${stats.sancionado ? 'ud-stat-card--alerta' : ''}`}>
            <span className="ud-stat-card__label">Estado de Cuenta</span>
            <span className="ud-stat-card__value">
              {stats.sancionado ? 'Sancionado' : 'Habilitado'}
            </span>
            <div className="ud-stat-card__meta">
              {stats.sancionado
                ? <MdWarning className="ud-stat-card__meta-icon" />
                : <MdCheckCircle className="ud-stat-card__meta-icon" />
              }
              <span>{stats.sancionado ? 'Con sanciones activas' : 'Sin sanciones activas'}</span>
            </div>
          </article>
        </section>

        <section className="ud-activity-chart-grid">
          <article className="ud-activity-panel">
            <h2 className="ud-activity-panel__title">Interés Académico</h2>
            <p className="ud-activity-panel__subtitle">Distribución de tus lecturas por libro</p>

            <div className="ud-progress-list">
              {stats.interesAcademico.length === 0 ? (
                <p className="ud-activity-panel__vacio">Todavía no tenés libros devueltos registrados.</p>
              ) : (
                stats.interesAcademico.map((item, i) => (
                  <div key={i} className="ud-progress-item">
                    <div className="ud-progress-item__header">
                      <span>{item.titulo}</span>
                      <span>{item.porcentaje}%</span>
                    </div>
                    <div className="ud-progress-item__bar">
                      <div
                        className={`ud-progress-item__fill ${i === stats.interesAcademico.length - 1 ? 'ud-progress-item__fill--secondary' : ''}`}
                        style={{ width: `${item.porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="ud-chart-panel">
            <div className="ud-chart-panel__header">
              <div>
                <h2 className="ud-chart-panel__title">Frecuencia de mis Préstamos</h2>
                <p className="ud-chart-panel__subtitle">Préstamos registrados año {new Date().getFullYear()}</p>
              </div>
            </div>

            <div className="ud-chart-panel__body">
              {chartData.map((m, i) => (
                <div key={i} className="ud-chart-bar">
                  <div className="ud-chart-bar__container">
                    <div className="ud-chart-bar__fill" style={{ height: `${m.alturaPct}%` }}></div>
                  </div>
                  <span className="ud-chart-bar__label">{m.label} ({m.cantidad})</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="ud-books-section">
          <div className="ud-books-section__header">
            <h2 className="ud-books-section__title">Últimos Recursos Utilizados</h2>
            <p className="ud-books-section__subtitle">Historial de devoluciones</p>
          </div>

          {stats.ultimosRecursos.length === 0 ? (
            <p className="ud-activity-panel__vacio">Todavía no devolviste ningún material.</p>
          ) : (
            <div className="ud-books-grid">
              {stats.ultimosRecursos.map((lib, i) => (
                <article key={i} className="ud-book-card">
                  <div className="ud-book-card__content">
                    <div className="ud-book-card__image-wrapper">
                      {lib.imagen_url
                        ? <img className="ud-book-card__image" src={lib.imagen_url} alt={lib.titulo} />
                        : <span className="ud-book-card__image-placeholder">{lib.titulo?.charAt(0)}</span>
                      }
                    </div>
                    <h3 className="ud-book-card__title">{lib.titulo}</h3>
                    <p className="ud-book-card__stats">
                      {formatearTipoEstado(lib.estado_devuelto)} · {formatearFecha(lib.fecha_devolucion)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="ud-info-section">
          <h2 className="ud-info-section__title">
            <MdInfo size={22} /> Información de Biblioteca
          </h2>

          <div className="ud-info-grid">
            <article className="ud-info-card">
              <div className="ud-info-card__icon-box">
                <MdSchedule size={22} />
              </div>
              <div className="ud-info-card__body">
                <p className="ud-info-card__title">Horario</p>
                <p className="ud-info-card__text">Lunes a Viernes: 07:00 — 15:00</p>
              </div>
            </article>

            <article className="ud-info-card">
              <div className="ud-info-card__icon-box">
                <MdLocationOn size={22} />
              </div>
              <div className="ud-info-card__body">
                <p className="ud-info-card__title">Ubicación</p>
                <p className="ud-info-card__text">Campus FCyT</p>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
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