import React, { useState, useEffect } from 'react';
import '../styles/styles_admin/DashboardAdmin.css';

import {
  MdAccountBalance,
  MdTrendingUp,
  MdGroup,
  MdSchedule,
  MdWarning,
  MdNotificationsActive,
  MdHourglassEmpty,
  MdGavel,
  MdBookmark
} from 'react-icons/md';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/admin-dashboard`
  : "http://localhost:3210/api/admin-dashboard";

const DashboardAdmin = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const token = localStorage.getItem("token");
  const rolActivo = localStorage.getItem("rolActivo");

  useEffect(() => {
    const cargarStats = async () => {
      try {
        const res = await fetch(`${API_URL}/mis-estadisticas`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            ...(rolActivo ? { "x-rol-activo": rolActivo } : {})
          }
        });
        const json = await res.json();

        if (!res.ok) {
          setError(true);
        } else {
          setStats(json.data);
        }
      } catch (err) {
        console.error("Error al cargar estadísticas del dashboard admin:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    cargarStats();
  }, [token, rolActivo]);

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

  // SKELETON DE CARGA
  if (loading) {
    return (
      <>
        <header className="dashboard-header">
          <div className="dashboard-header__container">
            <div className="dashboard-header__brand">
              <span className="dashboard-header__label">Portal Administrativo</span>
              <div className="dashboard-header__title-wrapper">
                <MdAccountBalance className="dashboard-header__icon" size={32} />
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

          <section className="alerts-section">
            <div className="alerts-grid">
              {[1, 2, 3].map(i => (
                <article key={i} className="alert-card skeleton-card">
                  <div className="skeleton-line skeleton-line--short"></div>
                  <div className="skeleton-line skeleton-line--sub"></div>
                </article>
              ))}
            </div>
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
            <span className="dashboard-header__label">Portal Administrativo</span>
            <div className="dashboard-header__title-wrapper">
              <MdAccountBalance className="dashboard-header__icon" size={32} />
              <h1 className="dashboard-header__title">Biblioteca FCyT</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
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
            <span className="stat-card__label">Libros Vencidos</span>
            <span className="stat-card__value">{stats.librosVencidos}</span>
            <div className="stat-card__meta">
              <MdWarning className="stat-card__meta-icon" />
              <span className="stat-card__meta-text">Acción requerida</span>
            </div>
          </article>
        </section>

        <section className="alerts-section">
          <h2 className="alerts-section__title">
            <MdNotificationsActive className="alerts-section__title-icon" size={24} />
            Alertas Críticas
          </h2>

          <div className="alerts-grid">
            <article className="alert-card alert-card--warning">
              <div className="alert-card__icon-wrapper"><MdHourglassEmpty size={24} /></div>
              <div className="alert-card__content">
                <p className="alert-card__title">{stats.porVencer} Libro{stats.porVencer !== 1 ? 's' : ''} por vencer</p>
                <p className="alert-card__description">Revisar avisos automáticos</p>
              </div>
            </article>

            <article className="alert-card alert-card--error">
              <div className="alert-card__icon-wrapper"><MdGavel size={24} /></div>
              <div className="alert-card__content">
                <p className="alert-card__title">{stats.librosVencidos} Libro{stats.librosVencidos !== 1 ? 's' : ''} atrasado{stats.librosVencidos !== 1 ? 's' : ''}</p>
                <p className="alert-card__description">Iniciar proceso de multa</p>
              </div>
            </article>

            <article className="alert-card alert-card--info">
              <div className="alert-card__icon-wrapper"><MdBookmark size={24} /></div>
              <div className="alert-card__content">
                <p className="alert-card__title">{stats.reservasPendientes} Reserva{stats.reservasPendientes !== 1 ? 's' : ''} pendiente{stats.reservasPendientes !== 1 ? 's' : ''}</p>
                <p className="alert-card__description">Asignar a estantería</p>
              </div>
            </article>
          </div>
        </section>

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

        <section className="books-section">
          <div className="books-section__header">
            <h2 className="books-section__title">Libros más Prestados</h2>
            <p className="books-section__subtitle">Top 5 histórico</p>
          </div>

          {stats.librosMasPrestados.length === 0 ? (
            <p className="activity-panel__vacio">Todavía no hay préstamos registrados.</p>
          ) : (
            <div className="books-grid">
              {stats.librosMasPrestados.map((lib, i) => (
                <article key={i} className="book-card">
                  <div className="book-card__content">
                    <div className="book-card__image-wrapper">
                      {lib.imagen_url
                        ? <img className="book-card__image" src={lib.imagen_url} alt={lib.titulo} />
                        : <span className="book-card__image-placeholder">{lib.titulo?.charAt(0)}</span>
                      }
                    </div>
                    <h3 className="book-card__title">{lib.titulo}</h3>
                    <p className="book-card__stats">{lib.total_prestamos} préstamo{lib.total_prestamos !== 1 ? 's' : ''}</p>
                    <div className="book-card__progress">
                      <div className="book-card__progress-fill" style={{ width: `${lib.porcentaje_relativo}%` }}></div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default DashboardAdmin;