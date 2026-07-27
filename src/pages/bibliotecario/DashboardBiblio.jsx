import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/DashboardBiblio.css';
import { getStaffEstadisticas } from '../../services/dashboard.services';

import {
  MdAccountBalance,
  MdTrendingUp,
  MdGroup,
  MdSchedule,
  MdWarning,
  MdNotificationsActive,
  MdHourglassEmpty,
  MdGavel,
  MdBookmark,
  MdAutorenew
} from 'react-icons/md';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const DashboardBiblio = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [failedImages, setFailedImages] = useState({});
  const navigate = useNavigate();

  const rolActivo = localStorage.getItem("rolActivo");

  useEffect(() => {
    const cargarStats = async () => {
      try {
        const data = await getStaffEstadisticas();
        setStats(data);
      } catch (err) {
        console.error("Error al cargar estadísticas del dashboard bibliotecario:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    cargarStats();
  }, []);

  const handleImageError = (idLibro) => {
    setFailedImages((prev) => ({ ...prev, [idLibro]: true }));
  };

  // Se unifica el state enviado con el que espera PrestamosAdmin.jsx
  // (mismo componente montado en /bibliotecario/prestamos y /admin/prestamos),
  // que solo lee "tab", "estadoFiltro" y "solicitudFiltro".
  const irAPrestamos = ({ tab, estadoLabel, solicitudFiltro }) => {
    const ruta = rolActivo === 'bibliotecario' ? '/bibliotecario/prestamos' : '/admin/prestamos';

    navigate(ruta, {
      state: {
        tab: tab || 'prestamos',
        estadoFiltro: estadoLabel,
        solicitudFiltro: solicitudFiltro,
        fromDashboard: true
      }
    });
  };

  const irADevoluciones = () => {
    if (rolActivo === 'bibliotecario') {
      navigate('/bibliotecario/devoluciones', {
        state: { tab: 'historial', fromDashboard: true }
      });
    } else {
      navigate('/admin/devoluciones', {
        state: { tab: 'historial', fromDashboard: true }
      });
    }
  };

  const construirTendenciaChart = () => {
    if (!stats) return [];
    const mesActual = new Date().getMonth() + 1;
    const ultimosSeisMeses = [];
    for (let i = 5; i >= 0; i--) {
      let mes = mesActual - i;
      if (mes <= 0) mes += 12;
      const registro = stats.tendenciaMensual.find(f => f.mes === mes);
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

  if (loading) {
    return (
      <div className="dashboard-spinner-page">
        <div className="dashboard-spinner"></div>
        <p className="dashboard-spinner-text">Cargando panel del bibliotecario...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="dashboard-loading">
        <p>No se pudieron cargar las estadísticas. Intentá nuevamente más tarde.</p>
      </div>
    );
  }

  const chartData = construirTendenciaChart();

  return (
    <>
      <header className="dashboard-header">
        <div className="dashboard-header__container">
          <div className="dashboard-header__brand">
            <MdAccountBalance className="dashboard-header__icon" size={32} />
            <h1 className="dashboard-header__title">Portal del Bibliotecario</h1>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {/* STATS GRID */}
        <section className="stats-grid">
          <article className="stat-card stat-card--hover-primary">
            <span className="stat-card__label">Total Libros</span>
            <span className="stat-card__value">{stats.totalLibros}</span>
            <div className="stat-card__meta">
              <MdTrendingUp className="stat-card__meta-icon" />
              <span className="stat-card__meta-text">En catálogo</span>
            </div>
          </article>

          <article className="stat-card stat-card--hover-primary">
            <span className="stat-card__label">Usuarios</span>
            <span className="stat-card__value">{stats.usuariosActivos}</span>
            <div className="stat-card__meta">
              <MdGroup className="stat-card__meta-icon" />
              <span className="stat-card__meta-text">Activos</span>
            </div>
          </article>

          <article className="stat-card stat-card--hover-primary">
            <span className="stat-card__label">Préstamos</span>
            <span className="stat-card__value">{stats.prestamosActivos}</span>
            <div className="stat-card__meta">
              <MdSchedule className="stat-card__meta-icon" />
              <span className="stat-card__meta-text">En circulación</span>
            </div>
          </article>

          <article className="stat-card stat-card--hover-error">
            <span className="stat-card__label">Préstamos Vencidos</span>
            <span className="stat-card__value">{stats.librosVencidos}</span>
            <div className="stat-card__meta">
              <MdWarning className="stat-card__meta-icon" />
              <span className="stat-card__meta-text">Acción requerida</span>
            </div>
          </article>
        </section>

        {/* ALERTAS */}
        <section className="alerts-section">
          <h2 className="alerts-section__title">
            <MdNotificationsActive className="alerts-section__title-icon" size={24} />
            Alertas Críticas
          </h2>

          <div className="alerts-grid">
            <article
              className="alert-card alert-card--warning alert-card--clickable"
              onClick={irADevoluciones}
            >
              <div className="alert-card__icon-wrapper"><MdHourglassEmpty size={24} /></div>
              <div className="alert-card__content">
                <p className="alert-card__title">{stats.librosDevueltosHoy} Libro{stats.librosDevueltosHoy !== 1 ? 's' : ''} devuelto{stats.librosDevueltosHoy !== 1 ? 's' : ''}</p>
                <p className="alert-card__description">Ver historial de devoluciones</p>
              </div>
            </article>

            <article
              className="alert-card alert-card--error alert-card--clickable"
              onClick={() => irAPrestamos({ tab: 'prestamos', estadoLabel: 'Vencido' })}
            >
              <div className="alert-card__icon-wrapper"><MdGavel size={24} /></div>
              <div className="alert-card__content">
                <p className="alert-card__title">{stats.librosVencidos} Libro{stats.librosVencidos !== 1 ? 's' : ''} atrasado{stats.librosVencidos !== 1 ? 's' : ''}</p>
                <p className="alert-card__description">Ver préstamos vencidos</p>
              </div>
            </article>

            <article
              className="alert-card alert-card--info alert-card--clickable"
              onClick={() => irAPrestamos({ tab: 'solicitudes', solicitudFiltro: 'RESERVA' })}
            >
              <div className="alert-card__icon-wrapper"><MdBookmark size={24} /></div>
              <div className="alert-card__content">
                <p className="alert-card__title">{stats.reservasPendientes} Reserva{stats.reservasPendientes !== 1 ? 's' : ''} pendiente{stats.reservasPendientes !== 1 ? 's' : ''}</p>
                <p className="alert-card__description">Asignar a estantería</p>
              </div>
            </article>

            <article
              className="alert-card alert-card--info alert-card--clickable"
              onClick={() => irAPrestamos({ tab: 'solicitudes', solicitudFiltro: 'RENOVACION' })}
            >
              <div className="alert-card__icon-wrapper"><MdAutorenew size={24} /></div>
              <div className="alert-card__content">
                <p className="alert-card__title">{stats.renovacionesPendientes} Renovación{stats.renovacionesPendientes !== 1 ? 'es' : ''} pendiente{stats.renovacionesPendientes !== 1 ? 's' : ''}</p>
                <p className="alert-card__description">Revisar solicitudes de renovación</p>
              </div>
            </article>
          </div>
        </section>

        {/* ACTIVIDAD Y TENDENCIAS */}
        <section className="activity-chart-grid">
          <article className="activity-panel">
            <div className="activity-panel__header">
              <h2 className="activity-panel__title">Actividad del Sistema</h2>
            </div>
            <p className="activity-panel__subtitle">Préstamos por Áreas (%)</p>
            <div className="progress-list">
              {stats.actividadPorArea.length === 0 ? (
                <p className="activity-panel__vacio">Todavía no hay préstamos registrados con área asignada.</p>
              ) : (
                stats.actividadPorArea.map((item, i) => (
                  <div key={i} className="progress-item">
                    <div className="progress-item__header">
                      <span className="progress-item__label">{item.area}</span>
                      <span className="progress-item__value">{item.porcentaje}%</span>
                    </div>
                    <div className="progress-item__bar">
                      <div
                        className={`progress-item__fill ${i === stats.actividadPorArea.length - 1 ? 'progress-item__fill--secondary' : ''}`}
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
                <h2 className="chart-panel__title">Tendencia de Préstamos</h2>
                <p className="chart-panel__subtitle">Datos consolidados año {new Date().getFullYear()}</p>
              </div>
              <span className="chart-panel__badge">Mensual</span>
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

        {/* LIBROS MÁS PRESTADOS (RESPONSIVO) */}
        <section className="books-section">
          <div className="books-section__header">
            <h2 className="books-section__title">Libros más Prestados</h2>
            <p className="books-section__subtitle">Top 5 histórico</p>
          </div>

          {stats.librosMasPrestados.length === 0 ? (
            <p className="activity-panel__vacio">Todavía no hay préstamos registrados.</p>
          ) : (
            <div className="books-grid">
              {stats.librosMasPrestados.map((lib, i) => {
                const idUnico = lib.id_libro || i;
                const tieneImagen = lib.imagen_url && !failedImages[idUnico];

                return (
                  <article key={idUnico} className="book-card">
                    <div className="book-card__content">
                      {/* Contenedor adaptativo para la portada del libro */}
                      <figure className="book-card__image-container">
                        {tieneImagen ? (
                          <img
                            className="book-card__image"
                            src={lib.imagen_url}
                            alt={lib.titulo}
                            loading="lazy"
                            onError={() => handleImageError(idUnico)}
                          />
                        ) : (
                          <div className="book-card__image-placeholder">
                            <span>{lib.titulo?.charAt(0)}</span>
                          </div>
                        )}
                      </figure>

                      <h3 className="book-card__title" title={lib.titulo}>{lib.titulo}</h3>
                      <p className="book-card__stats">
                        {lib.total_prestamos} préstamo{lib.total_prestamos !== 1 ? 's' : ''}
                      </p>
                      <div className="book-card__progress">
                        <div
                          className="book-card__progress-fill"
                          style={{ width: `${lib.porcentaje_relativo}%` }}
                        ></div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default DashboardBiblio;