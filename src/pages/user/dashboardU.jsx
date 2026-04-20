import React from 'react';
import './stylesU.css';

// Importación de iconos (Material Design)
import {
  MdSchool,
  MdAutoStories,
  MdHistory,
  MdEventAvailable,
  MdLocationOn,
  MdSchedule,
  MdBookmarkBorder,
  MdInfo
} from 'react-icons/md';

const DashboardU = () => {
  return (
    <>
      {/* ===== ENCABEZADO / TOP APP BAR ===== */}
      <header className="dashboard-header">
        <div className="dashboard-header__container">
          {/* Identidad de la Biblioteca */}
          <div className="dashboard-header__brand">
            <span className="dashboard-header__label">Bienvenidos al portal</span>
            <div className="dashboard-header__title-wrapper">
              <MdSchool className="dashboard-header__icon" size={32} />
              <h1 className="dashboard-header__title">Biblioteca FCyT</h1>
            </div>
          </div>
        </div>
      </header>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <main className="dashboard-main">
        
        {/* SECCIÓN DE ESTADÍSTICAS (KPIs del Estudiante) */}
        {/* Estas tarjetas muestran el resumen de actividad del alumno */}
        <section className="stats-grid">
          <article className="stat-card stat-card--hover-primary">
            <span className="stat-card__label">Libros Leídos</span>
            <span className="stat-card__value">24</span>
            <div className="stat-card__meta">
              <MdAutoStories className="stat-card__meta-icon" />
              <span className="stat-card__meta-text">Total acumulado</span>
            </div>
          </article>

          <article className="stat-card stat-card--hover-primary">
            <span className="stat-card__label">Préstamos Activos</span>
            <span className="stat-card__value">02</span>
            <div className="stat-card__meta">
              <MdHistory className="stat-card__meta-icon" />
              <span className="stat-card__meta-text">En posesión</span>
            </div>
          </article>

          <article className="stat-card stat-card--hover-primary">
            <span className="stat-card__label">Reservas</span>
            <span className="stat-card__value">01</span>
            <div className="stat-card__meta">
              <MdBookmarkBorder className="stat-card__meta-icon" />
              <span className="stat-card__meta-text">En espera</span>
            </div>
          </article>

          <article className="stat-card stat-card--hover-primary">
            <span className="stat-card__label">Estado Socio</span>
            <span className="stat-card__value">Regular</span>
            <div className="stat-card__meta">
              <MdEventAvailable className="stat-card__meta-icon" />
              <span className="stat-card__meta-text">Vence Dic 2026</span>
            </div>
          </article>
        </section>

        {/* SECCIÓN DE GRÁFICOS Y ACTIVIDAD */}
        <section className="activity-chart-grid">
          {/* Distribución por áreas de estudio */}
          <article className="activity-panel">
            <div className="activity-panel__header">
              <h2 className="activity-panel__title">Interés Académico</h2>
            </div>
            <p className="activity-panel__subtitle">Distribución de tus consultas (%)</p>
            <div className="progress-list">
              {[
                { L: "Calculo diferencial", V: "45%" },
                { L: "Geometria analitica", V: "35%" },
                { L: "Programación", V: "12%" },
                { L: "Base de Datos", V: "8%", S: true }
              ].map((item, i) => (
                <div key={i} className="progress-item">
                  <div className="progress-item__header">
                    <span className="progress-item__label">{item.L}</span>
                    <span className="progress-item__value">{item.V}</span>
                  </div>
                  <div className="progress-item__bar">
                    <div className={`progress-item__fill ${item.S ? 'progress-item__fill--secondary' : ''}`} style={{width: item.V}}></div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* Gráfico de barras de visitas mensuales */}
          <article className="chart-panel">
            <div className="chart-panel__header">
              <div>
                <h2 className="chart-panel__title">Frecuencia de mis Prestamos</h2>
                <p className="chart-panel__subtitle">Prestamos registrados año 2026</p>
              </div>
              <span className="chart-panel__badge">Reporte</span>
            </div>
            <div className="chart-panel__body">
              {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'].map((m, i) => {
                const H = ['20%', '40%', '90%', '60%', '30%', '80%'];
                return (
                  <div key={m} className="chart-bar">
                    <div className="chart-bar__container">
                      <div className="chart-bar__fill" style={{height: H[i]}}></div>
                    </div>
                    <span className="chart-bar__label">{m}</span>
                  </div>
                );
              })}
            </div>
          </article>
        </section>

        {/* SECCIÓN DE HISTORIAL DE LECTURAS */}
        <section className="books-section">
          <div className="books-section__header">
            <h2 className="books-section__title">Últimos Recursos Utilizados</h2>
            <p className="books-section__subtitle">Historial de devoluciones </p>
          </div>
          <div className="books-grid">
            {[
              { T: 'Cálculo Stewart', D: 'Oct 2026', R: '100%', I: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCApG2Jc7v9rY_Jy8Bt5yoVr-giXKHupbwlpn-afqTZAY0LfsTNBKjZ6oeCRd1Cjromew1myUfV-vkK-LEHZvFSpb3VCHSNgbKEFfquv-Yy92Acqlo6j7DU6xWpFWB91A6lRASIXHkBfkQHgjUwNZMqTN_Rtpz0iPjMJzmKeX9tbzM1D8PkLK2lWY1a-BrsthR7L8pA2946XSkHWtHLNNxRsG_r8mvATdrobA-AASM1SnYjLde1AhjRMuAvPOvQtkFiVQQn0P3eWr8' },
              { T: 'Clean Architecture', D: 'Sep 2026', R: '100%', I: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACzUqcDPx-hf5Q9mBh8iCMNL_7vD89ZbOYSMsftIOvCM0IIqvlr_256uMjT_Cc6CWiPlDuOTzHS-CInMjsTKX57qU4Bm5uckGi6leO2hexnU3js9FBlOg_CbYi_AViytC1V_cdus6953CHIV2GsN4XKjc-mbucxhsXxDNCyTFMmtdD64oJqdbdv3-zYo7AMzRaoSmAn9V-zhIa3IsPidaZG1nlndx5F-NSFdaq0DbnJrZuATTRO1rKOZIeLVaFiSy1UldW3-AK5BM' },
              { T: 'Redes de Computadoras', D: 'Ago 2026', R: '100%', I: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1AGtSnCyeCEpwFwSzu58ewOZh_T5SnRGhW8nEEntjQo2W_uAMNO2cNvNZK707n7nUMDg1AjiyfXbTJ9nQjwTxqJZ6JocY3rwpRPcLFvDpq8PcPTyJlEAHSfQ9CjzmsoFxVj0fyYg26llr1AIyiLiK7NeoZ9FavYv1AHMwMfjR3FBwhhKFdlszl2CMr1GD0BTECNy0L2DavRUycxUKbZjAKCZtkGfhhWkctmhbCG2via6eieJrgC3z75ByLgtU-50j84Icg_KUZkk' }
            ].map((lib, i) => (
              <article key={i} className="book-card">
                <div className="book-card__content">
                  <div className="book-card__image-wrapper">
                    <img className="book-card__image" src={lib.I} alt={lib.T} />
                  </div>
                  <h3 className="book-card__title">{lib.T}</h3>
                  <p className="book-card__stats">Finalizado en: {lib.D}</p>
                  <div className="book-card__progress">
                    <div className="book-card__progress-fill" style={{width: lib.R}}></div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
              {/* SECCIÓN DE INFORMACIÓN (Estilo Rojo Institucional) */}
        {/* Se eliminó el aviso de mantenimiento y se unificó el color a Rojo */}
        <section className="alerts-section">
          <h2 className="alerts-section__title">
            <MdInfo className="alerts-section__title-icon" size={24} />
            Información de Biblioteca
          </h2>
          
          <div className="alerts-grid">
            {/* Tarjeta de Horario */}
            <article className="alert-card alert-card--primary">
              <div className="alert-card__icon-wrapper"><MdSchedule size={24} /></div>
              <div className="alert-card__content">
                <p className="alert-card__title">Horario de Atención</p>
                <p className="alert-card__description">Lunes a Viernes: 07:00 — 15:00 hs</p>
              </div>
            </article>

            {/* Tarjeta de Ubicación */}
            <article className="alert-card alert-card--primary">
              <div className="alert-card__icon-wrapper"><MdLocationOn size={24} /></div>
              <div className="alert-card__content">
                <p className="alert-card__title">Ubicación </p>
                <p className="alert-card__description">Campus FCyT - (Coronel Oviedo)</p>
              </div>
            </article>
          </div>
        </section>
    </>
    
  );
};

export default DashboardU;