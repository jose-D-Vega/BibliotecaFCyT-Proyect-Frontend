import React from 'react';
import '../styles/DashboardUser.css';

// Importación de iconos
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

const DashboardUser = () => {
  return (
    <>
      <header className="dashboard-header">
        <div className="dashboard-header__container">
          <div className="dashboard-header__brand">
            <span className="dashboard-header__label">
              Bienvenidos al portal
            </span>

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
            <span className="stat-card__value">24</span>
            <div className="stat-card__meta">
              <MdAutoStories className="stat-card__meta-icon" />
              <span>Total acumulado</span>
            </div>
          </article>

          <article className="stat-card stat-card--hover-primary">
            <span className="stat-card__label">Préstamos Activos</span>
            <span className="stat-card__value">02</span>
            <div className="stat-card__meta">
              <MdHistory className="stat-card__meta-icon" />
              <span>En posesión</span>
            </div>
          </article>

          <article className="stat-card stat-card--hover-primary">
            <span className="stat-card__label">Reservas</span>
            <span className="stat-card__value">01</span>
            <div className="stat-card__meta">
              <MdBookmarkBorder className="stat-card__meta-icon" />
              <span>En espera</span>
            </div>
          </article>

          <article className="stat-card stat-card--hover-primary">
            <span className="stat-card__label">Estado Socio</span>
            <span className="stat-card__value">Regular</span>
            <div className="stat-card__meta">
              <MdEventAvailable className="stat-card__meta-icon" />
              <span>Vence Dic 2026</span>
            </div>
          </article>
        </section>

        <section className="activity-chart-grid">
          <article className="activity-panel">
            <h2 className="activity-panel__title">Interés Académico</h2>
            <p className="activity-panel__subtitle">
              Distribución de tus consultas (%)
            </p>

            <div className="progress-list">
              {[
                { L: 'Calculo diferencial', V: '45%' },
                { L: 'Geometria analitica', V: '35%' },
                { L: 'Programación', V: '12%' },
                { L: 'Base de Datos', V: '8%', S: true }
              ].map((item, i) => (
                <div key={i} className="progress-item">
                  <div className="progress-item__header">
                    <span>{item.L}</span>
                    <span>{item.V}</span>
                  </div>

                  <div className="progress-item__bar">
                    <div
                      className={`progress-item__fill ${
                        item.S ? 'progress-item__fill--secondary' : ''
                      }`}
                      style={{ width: item.V }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="chart-panel">
            <div className="chart-panel__header">
              <div>
                <h2 className="chart-panel__title">
                  Frecuencia de mis Prestamos
                </h2>
                <p className="chart-panel__subtitle">
                  Prestamos registrados año 2026
                </p>
              </div>

              <span className="chart-panel__badge">Reporte</span>
            </div>

            <div className="chart-panel__body">
              {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'].map((m, i) => {
                const H = ['20%', '40%', '90%', '60%', '30%', '80%'];

                return (
                  <div key={m} className="chart-bar">
                    <div className="chart-bar__container">
                      <div
                        className="chart-bar__fill"
                        style={{ height: H[i] }}
                      ></div>
                    </div>
                    <span className="chart-bar__label">{m}</span>
                  </div>
                );
              })}
            </div>
          </article>
        </section>

        <section className="books-section">
          <div className="books-section__header">
            <h2 className="books-section__title">Últimos Recursos Utilizados</h2>
            <p className="books-section__subtitle">Historial de devoluciones</p>
          </div>

           <div className="books-grid">
            {[
              { T: 'Cálculo de Granville', P: 24, R: '90%', I: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsm2sbkf5zlAwm2cvGw3EwttE4d9b8Fi5f3MzavP9UEqFGqT_mF-6PXPekcUQNCHdwNrhI_M7CxbT4ykSYwUrxfD3hVFWvEAf7pH_XkZ5qucM0683aZ43rgEvXBJS6iJvTYqrFzwBUAkgZ3GDXe0v0Z70KRfMd6H_zKp43qCVjlF_Y6z4ms7-TD5fb_vpmDG0_DvDNvGJf2VnY6_Glzi_1mRo3Vz0v5nOp1X1tFxHvBNb2k1J02r3Mxd75ymXeWxOpkYPOo1Eabko' },
              { T: 'Clean Code', P: 19, R: '75%', I: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGbY_xx1a-jyihnxMMUSb1aldZAHPGj3KGllR2Fi7dQAIX_rHDG8BOkPziksGFcd9hjK6FBOuG_2gJLqbXHUfY3ieoONSvP7WQgaxtr4IVFZd-XabfbrMvQ07RMSOntBef_uMvMefGn_3UvMNSisDPupQM3AMP5nYfy_BeIG6X5pt6wTVQvRR-xz1zJA-IxazZNUlY0nJt2bGX9KlUB5vIbpHBadcwTyWhzuQSnfNAirtfCShU-pcbmlTtQO5pe10qsUwJyUWt5ms' },
              { T: 'Mecánica de Suelos', P: 15, R: '60%', I: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSAkaZJFAg3dYfw_S-mLWD6gGYA3nfIKEWHH2ynTP0q7L5zxs-PIc5Q9PRmpvDcB5Amiv-WrhatsHNMcR6V-QofZl9qlf31j-Bf-jfSM3CJ7EZI8BoHQpmpYCBZAdJYm_GOQ-SI1l8Yxtj2RyNSjPR6UmD_y3gohtGAVzXJNMW1GJzwaZwFlCEyhrYI27PUHZJF5VDjXtOXcBiTvdQ3ziQX4QhL_2kodFlsfxaxEiLb2e3I7Fr_bJTD7E3WkDG1dj3B1zGSUVDrDM' },
              { T: 'Máquinas Eléctricas', P: 12, R: '45%', I: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADUhGtKkt-X3ZkXdWwfSPPa3eBYxYvep5uOR8d-e6rSdqf_C4ruR4LLr1SXZbMURQOhcpMH19tnZQDJbViVaVdFY1LSVzK4RSeT_-fUALLtWuKtMWx-n-zjGLo03pwKdIAu8zQZdPD6xMhyzxtHxje542e9HQCrhfsDeqISizyqImZSM5TK6_vapm_fvedAR2JvdbxTeEnHoF_q1Q7UjIpod7jiPrAmapQHuyCxg_Q1vihw0yjDTFhzms_XODFnYsxrhBtIyYQWWg' },
              { T: 'Sistemas Digitales', P: 10, R: '35%', I: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMRrReMOvwIEmk4KBKtNCjZx1b0VsdOgEJ7OyIL4gA6J_y55SOUyGPzFXAFOSfQYe5ILDYr1Jc2mHJUYa8yTdBzJnz6uHXS9jPaalIaiJgM4UcXIvalXIUFqjrVGMHgscE5PG5Bn_qgj6Sx5eXfDvmmIvOAH7n5ukndWfv9yAJtgpW24xuU9gjJkAGbv78FG88_yqOqueRLl_VtAHAcuNe82mAexWz87FI1A4LkGjmJwHUL8gbd5TtLKcCD_MpFdnNADcOmzk5ULQ' }
            ].map((lib, i) => (
              <article key={i} className="book-card">
                <div className="book-card__content">
                  <div className="book-card__image-wrapper">
                    <img className="book-card__image" src={lib.I} alt={lib.T} />
                  </div>
                  <h3 className="book-card__title">{lib.T}</h3>
                  <p className="book-card__stats">Finalizado</p>
                  <div className="book-card__progress">
                    <div className="book-card__progress-fill" ></div>
                  </div>
                </div>
              </article>
            ))}
          </div>
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

export default DashboardUser;