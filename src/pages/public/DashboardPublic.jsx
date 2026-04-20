import React from 'react';
import '../styles/DashboardPublic.css';

// Importamos los iconos de la librería React Icons (familia Material Design)
import { 
  MdAutoStories, 
  MdCheckCircle, 
  MdNewReleases, 
  MdSchedule, 
  MdLocationOn 
} from "react-icons/md";

const Dashboard = () => {
  return (
    <main className="max-w-custom">
      
      {/* Hero Section */}
      <section className="academic-card mb-12" style={{height: '350px', display: 'flex', alignItems: 'center'}}>
        <div style={{position: 'absolute', inset: 0, zIndex: 0}}>
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to right, #801515, rgba(128, 21, 21, 0.9), transparent)', zIndex: 10}}></div>
          <img style={{width: '100%', height: '100%', objectFit: 'cover'}} src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ38fZJtRLrHNSDgBUVKl4dqSS9Bw-MwwrpfOA4D-LmOb-dpZcGfTMYBFC60EBpzC-vxgXL3faZuAqlvA6N_crijuyocQ5s2gNe_O30671DRyhb9ckSGtg66nQTltNczaFCBf4-28T83StyshUqsM_ngJUONUosfRg1AbHtDAABfwx2maZF-en1WhGc1304wb00eFxx4Ekp56MUtKz4k_vYkXfAw70rBS4r8-xrmDDzbZ-EH2lF2zNUdqBMcy6rkL1CgXy_w2cKBo" alt="Biblioteca Principal"/>
        </div>
        <div style={{position: 'relative', zIndex: 20, padding: '0 3rem', maxWidth: '600px'}}>
          <h2 style={{fontSize: '3rem', fontWeight: 900, color: 'white', marginBottom: '1rem', lineHeight: 1.1}}>
            Biblioteca FCyT
          </h2>
          <p style={{color: 'rgba(255,255,255,0.8)', fontSize: '1.25rem', fontWeight: 300}}>
            Excelencia en recursos académicos para la Facultad de Ciencias y Tecnologías.
          </p>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="grid-3 mb-12">
        <div className="metric-card">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
            <div className="icon-box" style={{color: '#801515', background: 'rgba(128, 21, 21, 0.1)'}}>
              <MdAutoStories size={24} />
            </div>
            <span style={{fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8'}}>Acervo</span>
          </div>
          <p style={{color: '#64748b', fontWeight: 500, margin: 0}}>Libros Totales</p>
          <h3 style={{fontSize: '1.875rem', fontWeight: 900, margin: 0}}>12,450</h3>
        </div>

        <div className="metric-card">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
            <div className="icon-box" style={{color: '#047857', background: '#ecfdf5'}}>
              <MdCheckCircle size={24} />
            </div>
            <span style={{fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8'}}>Stock</span>
          </div>
          <p style={{color: '#64748b', fontWeight: 500, margin: 0}}>Disponibles</p>
          <h3 style={{fontSize: '1.875rem', fontWeight: 900, margin: 0}}>8,920</h3>
        </div>

        <div className="metric-card">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
            <div className="icon-box" style={{color: '#1d4ed8', background: '#eff6ff'}}>
              <MdNewReleases size={24} />
            </div>
            <span style={{fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8'}}>Novedad</span>
          </div>
          <p style={{color: '#64748b', fontWeight: 500, margin: 0}}>Nuevos este mes</p>
          <h3 style={{fontSize: '1.875rem', fontWeight: 900, margin: 0}}>+142</h3>
        </div>
      </section>

      {/* Áreas Académicas */}
      <section>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem'}}>
          <div style={{height: '32px', width: '8px', backgroundColor: '#801515', borderRadius: '999px'}}></div>
          <h2 style={{fontSize: '1.5rem', fontWeight: 900, margin: 0}}>Áreas Académicas</h2>
        </div>
        
        <div className="grid-3">
          <div className="academic-card lg-col-2" style={{height: '400px'}}>
            <img className="card-image" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCWlggA7cCyK-FhV5x9Oxu0E6cXn3_28XUsnzVnv3HKSeQPjQruxjx03FUq5rgho57C-96ZU2rVb5rq6mAVK_ikA8MMadg0ERSm1bM6LE_JajSrf82IprtzCZWvg_6Mo0CXHGWW5_sK4x8i-bL0T0Ehf2goenDPEXDKKS2wjc_MiHlXgVlTfSw4lpvh4NALHh_O8kah69tZwANL5ieSUMsJE0ld9bbY2AK-JUW6-VxoDrHAsWF1PrjkT4Iof4qti-EidLXqXTWFtU" alt="General"/>
            <div className="card-overlay"></div>
            <div style={{position: 'absolute', inset: 0, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
              <span className="tag">Básicas</span>
              <h4 style={{fontSize: '1.875rem', fontWeight: 900, color: 'white', margin: '0.5rem 0 0 0'}}>Área General</h4>
              <p style={{color: 'rgba(255,255,255,0.7)', margin: '0.5rem 0'}}>Base fundamental en Cálculo Diferencial e Integral, Fisica, Quimica, Ciencias Humanas.</p>
              <span style={{color: 'white', fontWeight: 700}}>2,090 Volúmenes</span>
            </div>
          </div>

          <div className="academic-card" style={{height: '400px'}}>
            <img className="card-image" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVyPFV-N8Dz6Ub3bgJWCXucrsR6v2_XSxl5994IW-hgMlkmxlgQP_6lZ4XGFYru6SKyF0IDwAkQWZ8-m2CfMhNCpSY4E-w9kJhCLM2MVRU-UHG8lWtjYplZYyIKjmRS9Zk5vdaujMsKMZ9ZDuO4_uk6ykoB5A9idWojugbyyGCTo4yckVqw722fTtygVceEBDRhi0Lvp-TBAIJjvXwX_WYH3JYXs4n4on_Id16Coeu_nHojUyJio0WnD3Z0Ltca8_8NaN1nh6WeYk" alt="Informática"/>
            <div className="card-overlay"></div>
            <div style={{position: 'absolute', inset: 0, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
              <span className="tag">TICs</span>
              <h4 style={{fontSize: '1.5rem', fontWeight: 900, color: 'white', margin: '0.5rem 0 0 0'}}>Informática</h4>
              <p style={{color: 'rgba(255,255,255,0.7)', margin: '0.5rem 0'}}>Foco en Ingenieria de Software, Programación, Algoritmos, Bases de Datos.</p>
              <span style={{color: 'white', fontWeight: 700}}>3,120 Volúmenes</span>
            </div>
          </div>

          <div className="academic-card" style={{height: '400px'}}>
            <img className="card-image" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxfOFDAAPp_6GUsconQpbcCKKk_aRyKkcOVOVNtzlmz-ZhXUALyf8z1p9YRUlIzbfAQbERBu91_-8k2N9LXKMy_lxOLkPU_XPAWQJFZOCS1SbaDitVheQAWVFI5g7z7-_g1C7HEOw4d1ukxL-3S0nyJx6BRCZDISc4MHYmhGbmtWaolT4yoMtnqyQyfDaQtcAj78Z-CNM28a10ezDoZq_ZKOrE4Ko1FMtwHaYwHPmGbOwiSDUuxVpGHNy5Af-Z74ocj0UUMcDqiwc" alt="Civil"/>
            <div className="card-overlay"></div>
            <div style={{position: 'absolute', inset: 0, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
              <span className="tag">Obras</span>
              <h4 style={{fontSize: '1.5rem', fontWeight: 900, color: 'white', margin: '0.5rem 0 0 0'}}>Civil</h4>
              <p style={{color: 'rgba(255,255,255,0.7)', margin: '0.5rem 0'}}>Foco en Estructuras, Hidráulica, Mecánica de Suelos, Gestión de la Construcción.</p>
              <span style={{color: 'white', fontWeight: 700}}>2,850 Volúmenes</span>
            </div>
          </div>

          <div className="academic-card" style={{height: '400px'}}>
            <img className="card-image" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPYswJ82A8fzu03NsKD2eO__yu10h2JoPdF-VR1_ncu9pkt4rF1eGNLXThRruEohBdJDgXCnSWj65cC_cIxe2zZ52DH8oTg3BlPZAm6X3QCqEcqkrGHdEiCq7a7bxuEiAQ32mMz0OSb0CfKr5II0vBF00_U0wLJDApKzKTErQ_F0GsyoaeFtedoiNo0Qr0irTNZyl1yrkhlG8ibkNxYXNUFo2zfjFAvCieybLh5aPgA0oVhjrBEzktaOgIpn36P8bblvXtrelFVNs" alt="Electrónica"/>
            <div className="card-overlay"></div>
            <div style={{position: 'absolute', inset: 0, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
              <span className="tag">Sistemas</span>
              <h4 style={{fontSize: '1.5rem', fontWeight: 900, color: 'white', margin: '0.5rem 0 0 0'}}>Electrónica</h4>
              <p style={{color: 'rgba(255,255,255,0.7)', margin: '0.5rem 0'}}>Foco Diseño de Circuitos, Sistemas Digitales, Microprocesadores.</p>
              <span style={{color: 'white', fontWeight: 700}}>2,410 Volúmenes</span>
            </div>
          </div>

          <div className="academic-card" style={{height: '400px'}}>
            <img className="card-image" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaYX6xjyw9MO5rYfJNSCjI7o5yd6_vjVNclBttV1JaIRREqfAmktp5wyL5OziPFmap4YbLorQ8a5nre9tlSBhj9Fe5yj4kY8hoqMn8HtoHMYArHQSJf_If-1DXS19wH_25CXMUuUSjndKfESTMldrGnZF97VGg46zR5kXoTKjYRmJoR8k_lT6S6Cb_6R-hzmD0Bl5cQUV009H3tJCittdmw4qwVFeankg-VEGC4Y5ZAunGnFuGjPXPmJjvIB4AhAL5a3hPu_pfpuE" alt="Electricidad"/>
            <div className="card-overlay"></div>
            <div style={{position: 'absolute', inset: 0, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
              <span className="tag">Energía</span>
              <h4 style={{fontSize: '1.5rem', fontWeight: 900, color: 'white', margin: '0.5rem 0 0 0'}}>Electricidad</h4>
              <p style={{color: 'rgba(255,255,255,0.7)', margin: '0.5rem 0'}}>Foco en Sistemas de Potencia, Energias Renovables, Máquinas Eléctricas.</p>
              <span style={{color: 'white', fontWeight: 700}}>1,980 Volúmenes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="grid-2" style={{marginTop: '3rem'}}>
        <div className="info-card">
          <div className="info-icon" style={{backgroundColor: '#801515'}}>
            <MdSchedule size={24} />
          </div>
          <div>
            <p style={{fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', margin: 0}}>Horario de Atención</p>
            <p style={{fontSize: '1.25rem', fontWeight: 900, margin: 0}}>Atención de 07:00 — 15:00 hs</p>
            <p style={{color: 'rgba(128,21,21,0.7)', marginTop: '0.5rem', fontSize: '0.875rem'}}>De lunes a viernes, exceptuando feriados académicos.</p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon" style={{backgroundColor: '#1e293b'}}>
            <MdLocationOn size={24} />
          </div>
          <div>
            <p style={{fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', margin: 0}}>Ubicación</p>
            <p style={{fontSize: '1.25rem', fontWeight: 900, margin: 0}}>FCyT - Coronel Oviedo</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;