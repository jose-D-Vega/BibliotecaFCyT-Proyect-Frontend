import "./styles/Footer.css";
import logoCompleto from "../assets/icons/logo-web-blanco.png";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="app-footer__container">
        <div className="app-footer__col">
          <img
            src={logoCompleto}
            alt="FCyT UNCA"
            className="app-footer__logo"
          />

          <div className="app-footer__links">
            <a href="http://fctunca.edu.py" target="_blank" rel="noreferrer">
              Sitio Web
            </a>
            <span>·</span>
            <a href="http://soporte.fctunca.edu.py" target="_blank" rel="noreferrer">
              Soporte
            </a>
            <span>·</span>
            <a
              href="https://mail.google.com/a/fctunca.edu.py"
              target="_blank"
              rel="noreferrer"
            >
              Web Mail
            </a>
          </div>

          <p className="app-footer__copy">Biblioteca FCyT © 2018 - 2026</p>
        </div>

        <div className="app-footer__col app-footer__col--center">
          <div className="app-footer__info-item">
            <span className="app-footer__icon">📍</span>
            <p>
              Sgto. Florentino Benítez e/ Padre Molas y Fabián Ojeda
              <br />
              Coronel Oviedo, Paraguay
            </p>
          </div>

          <div className="app-footer__info-item">
            <span className="app-footer__icon">📞</span>
            <p>+595 521 201548</p>
          </div>

          <div className="app-footer__info-item">
            <span className="app-footer__icon">✉</span>
            <p>
              <a href="mailto:soporte@fctunca.edu.py">soporte@fctunca.edu.py</a>
            </p>
          </div>
        </div>

        <div className="app-footer__col app-footer__col--right">
          <p className="app-footer__note">
            <strong>Biblioteca FCyT UNCA:</strong> sistema de gestión y consulta
            de catálogo para la comunidad académica. Accedé a información de
            libros, préstamos y servicios institucionales desde un solo lugar.
          </p>

          <div className="app-footer__social">
            <a
              href="https://www.facebook.com/fcyt.unca/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>

            <a
              href="https://twitter.com/FcytUnca"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </svg>
            </a>

            <a
              href="https://www.youtube.com/channel/UCgR6pDGuyrN-OZ5a2PjgZnQ"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                <polygon
                  points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
                  fill="white"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;