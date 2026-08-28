import Link from "next/link";

import { enlaces, img } from "./content";

/** Nav fija: marca a la izquierda, MENÚ a la derecha. */
export function Nav() {
  return (
    <nav opacity="" no-scroll="" className="nav-boiler">
      <Link href="/" aria-current="page" className="nav-logo-wrap w-inline-block w--current">
        {/* Plegado: solo la marca AI. Al pasar el cursor se despliega el logotipo entero. */}
        <img src={img.marcaGradiente} alt="" className="nav-marca" />
        <img src={img.logo} alt="The AI Business" className="nav-logo-completo" />
      </Link>
      <div className="menu-w">
        <div className="menu-btn">
          <div className="menu-btn-text">menú</div>
          <svg width="100%" viewBox="0 0 6 6" fill="none" className="menu-svg">
            <rect y="4" width="2" height="2" fill="currentColor" />
            <rect x="4" y="4" width="2" height="2" fill="currentColor" />
            <rect width="2" height="2" fill="currentColor" />
            <rect x="4" width="2" height="2" fill="currentColor" />
          </svg>
        </div>
        <div className="menu-links-w">
          <a href="#casos" className="link-boiler">casos</a>
          <a href="#metodo" className="link-boiler">método</a>
          <a href="#contacto" className="link-boiler">contacto</a>
        </div>
      </div>
    </nav>
  );
}

/** Menú a pantalla completa, de tablet hacia abajo. */
export function MenuWrapper() {
  return (
    <div className="menu_wrapper">
      <div className="fake-el-menu" />
      <div className="div-block-10">
        <div className="link-menu">
          <a href="#casos" className="link-mob w-inline-block"><div>casos</div></a>
          <a href="#metodo" className="link-mob w-inline-block"><div>método</div></a>
        </div>
        <div className="link-btn-menu">
          <a href={enlaces.diagnostico} target="_blank" rel="noreferrer" className="btn mob-menu w-inline-block">
            <div className="btn__text"><p className="btn__text-p">Diagnóstico en 72h</p></div>
            <div className="arrow-w">
              <div className="arrow black-blend">
                <div className="line-arrow" />
                <div className="shape-arrow" />
              </div>
            </div>
          </a>
          <a href={enlaces.email} className="btn email white w-inline-block">
            <div className="btn__text"><p className="btn__text-p">info@theaibusiness.com</p></div>
            <div className="arobase">@</div>
          </a>
        </div>
      </div>
      <div className="link-hero-bottom-w">
        <div delay="1.5" line="" no-scroll="">Firma de ejecución de IA · Madrid</div>
        <div delay="1.5" opacity="" no-scroll="" className="link-hero-lang-w">
          <div className="link-hero-w">
            <a href={enlaces.linkedin} target="_blank" rel="noreferrer" className="link w-inline-block"><div>LinkedIn</div></a>
            <a href="#" className="link pointer-none w-inline-block"><div>/</div></a>
            <a href={enlaces.web} target="_blank" rel="noreferrer" className="link w-inline-block"><div>theaibusiness.com</div></a>
          </div>
          <a href="#" className="link-lang mob w-inline-block"><div>ES</div></a>
        </div>
      </div>
    </div>
  );
}

/* La placa de entrada: la marca en blanco se abre, desfilan los objetos por el
   hueco, la marca se cierra y la persiana sube. */
export function Loader() {
  return (
    <div className="loader">
      <div className="loader-c">
        {/* La marca se abre y por el hueco desfilan los objetos. La A y la I
            son las mismas piezas del logotipo vectorial, no texto. */}
        <div className="cargando-marca">
          <img src={img.letraA} alt="" loading="eager" className="cargando-letra cargando-a" />

          <div className="cargando-hueco">
            {img.cargando.map((src, i) => (
              <img key={src} src={src} alt="" loading="eager" className="cargando-objeto" data-i={i} />
            ))}
          </div>

          <img src={img.letraI} alt="" loading="eager" className="cargando-letra cargando-i" />
        </div>
      </div>
    </div>
  );
}
