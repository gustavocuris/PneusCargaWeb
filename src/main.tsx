import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ArrowRight, BadgeCheck, Gauge, MapPin, MessageCircle, Phone, ShieldCheck, Truck, Wrench } from 'lucide-react';
import './styles.css';
import heroImage from './assets/Novo Fundo.png';
import logoImage from './assets/LOGO MAIOR.png';

const galleryModules = import.meta.glob('./assets/FOTOS/*.{png,jpg,jpeg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const galleryImages = Object.entries(galleryModules)
  .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath))
  .map(([path, src]) => ({
    src,
    alt:
      path
        .split('/')
        .pop()
        ?.replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ') ?? 'Foto Intercap Pneus',
  }));

const phoneNumber = '5511910729582';
const whatsappText = encodeURIComponent('Olá! Vim pela landing page e quero cotar pneus para caminhão.');
const whatsappUrl = `https://wa.me/${phoneNumber}?text=${whatsappText}`;

const stores = [
  {
    id: 'piratininga',
    name: 'Loja Piratininga',
    address: 'R. Montalverne, 136 - Piratininga, Osasco - SP, 06230-020',
    phone: '(11) 3656-0634',
    whatsapp: '551136560634',
  },
  {
    id: 'novo-osasco',
    name: 'Loja Novo Osasco',
    address: 'Av. Visc. de Nova Granada, 42A - Vila Osasco, Osasco - SP',
    phone: '(11) 3683-4125',
    whatsapp: '551136834125',
  },
] as const;

function App() {
  const isGalleryPage = window.location.pathname === '/galeria';
  const [selectedStoreId, setSelectedStoreId] = useState<(typeof stores)[number]['id']>('piratininga');
  const selectedStore = stores.find((store) => store.id === selectedStoreId) ?? stores[0];
  const selectedStoreMap = `https://www.google.com/maps?q=${encodeURIComponent(selectedStore.address)}&output=embed`;
  const selectedStoreWhatsapp = `https://wa.me/${selectedStore.whatsapp}?text=${encodeURIComponent(
    `Olá! Vim pela landing page e quero atendimento na ${selectedStore.name}.`,
  )}`;

  if (isGalleryPage) {
    return (
      <main className="site-shell">
        <header className="header">
          <a className="brand" href="/" aria-label="Intercap Pneus">
            <img className="brand-logo" src={logoImage} alt="Intercap Pneus" />
          </a>

          <nav className="nav" aria-label="Navegação principal">
            <a className="gallery-link" href="/">Voltar para a página inicial</a>
          </nav>

          <a className="header-cta" href="/#unidades">
            <MapPin size={18} />
            Endereços
          </a>
        </header>

        <section className="gallery-page">
          <div className="gallery-heading">
            <h1>Galeria de Fotos Intercap Pneus</h1>
          </div>

          {galleryImages.length > 0 ? (
            <div className="gallery-grid">
              {galleryImages.map((image) => (
                <figure key={image.src} className="gallery-item">
                  <img src={image.src} alt={image.alt} loading="lazy" />
                </figure>
              ))}
            </div>
          ) : (
            <div className="gallery-empty">
              Adicione fotos na pasta <strong>src/assets/FOTOS</strong> para elas aparecerem aqui.
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="site-shell">
      <header className="header">
        <a className="brand" href="#inicio" aria-label="Grupo M.N">
          <img className="brand-logo" src={logoImage} alt="Intercap Pneus" />
        </a>

        <nav className="nav" aria-label="Navegação principal">
          <a className="gallery-link" href="/galeria">
            <span className="gallery-text-desktop">Galeria de Fotos da Intercap Pneus</span>
            <span className="gallery-text-mobile">Galeria Intercap Pneus</span>
          </a>
        </nav>

        <a className="header-cta" href="#unidades">
          <MapPin size={18} />
          Endereços
        </a>
      </header>

      <section id="inicio" className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-overlay" />
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="eyebrow">
            <ShieldCheck size={18} />
            <span>Especialistas em pneus a mais de 30 anos</span>
          </div>

          <div className="hero-title-row">
            <h1>
              <span className="line">Pneus de Carga</span>
            </h1>
          </div>

          <p>
            Pneus de Carga, Recapagem de Pneus, Serviços de Borracharia, tudo aqui na <strong>Intercap Pneus.</strong>
          </p>

          <div className="hero-actions">
            <a className="primary-button title-button" href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={22} />
              Falar no WhatsApp
              <ArrowRight size={20} />
            </a>
            <div className="quick-proof">
              <BadgeCheck size={20} />
              CLIQUE AQUI E FAÇA SUA COTAÇÃO
            </div>
          </div>
        </div>
      </section>

      <section id="servicos" className="services">
        <div className="section-heading">
          <h2>Estrutura para manter sua frota pronta para rodar.</h2>
        </div>

        <div className="service-list">
          <article>
            <Truck />
            <h3>Pneus de carga</h3>
            <p>Pneus novos e pneus recapados para caminhões, carretas e veículos pesados.</p>
          </article>
          <article>
            <Gauge />
            <h3>Recapagem de pneus</h3>
            <p>Serviço para recuperar pneus com qualidade, economia e mais rendimento para a sua frota.</p>
          </article>
          <article>
            <Wrench />
            <h3>Borracharia</h3>
            <p>Atendimento ágil para reparos, consertos e suporte em pneus de veículos pesados.</p>
          </article>
          
        </div>
      </section>

      <section id="contato" className="contact-band">
        <div>
          <h2>Chame agora e encontre o pneu certo para o seu caminhão.</h2>
        </div>
        <a className="primary-button contact-button" href={whatsappUrl} target="_blank" rel="noreferrer">
          <MessageCircle size={22} />
          Abrir WhatsApp
        </a>
      </section>

      <section id="unidades" className="locations-section">
        <div className="locations-copy">
          <h2>ONDE ESTAMOS:</h2>

          <div className="store-tabs" role="tablist" aria-label="Selecionar unidade">
            {stores.map((store) => (
              <button
                key={store.id}
                className={store.id === selectedStore.id ? 'active' : ''}
                type="button"
                onClick={() => setSelectedStoreId(store.id)}
              >
                {store.name}
              </button>
            ))}
          </div>

          <div className="store-details">
            <h3>{selectedStore.name}</h3>
            <p>
              <MapPin size={19} />
              {selectedStore.address}
            </p>
            <p>
              <Phone size={19} />
              <strong>Telefone:</strong> {selectedStore.phone}
            </p>
            <a className="primary-button store-button" href={selectedStoreWhatsapp} target="_blank" rel="noreferrer">
              <MessageCircle size={21} />
              Chamar esta loja
              <ArrowRight size={19} />
            </a>
          </div>
        </div>

        <div className="map-panel">
          <iframe
            title={`Mapa ${selectedStore.name}`}
            src={selectedStoreMap}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <footer className="footer">
        <div className="footer-brand-block">
          <div className="brand footer-brand">
            <img className="brand-logo" src={logoImage} alt="Intercap Pneus" />
          </div>
        </div>

        <div className="footer-meta">
          <div className="footer-pill">
            <ShieldCheck size={17} />
            Security, trust and performance
          </div>
          <div className="footer-pill">
            <MapPin size={17} />
            Heavy-duty tire service in Osasco
          </div>
          <div className="footer-credit">
            Developed by <strong>Gustavo Curis de Francisco</strong>
          </div>
        </div>
      </footer>
      <a className="floating-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp">
        <MessageCircle size={30} />
      </a>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);

