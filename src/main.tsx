import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  ArrowRight,
  BadgeCheck,
  Gauge,
  Lock,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  Truck,
  Upload,
  Wrench,
} from 'lucide-react';
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

type Store = {
  id: string;
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  imageSrc?: string;
  imageSrcTwo?: string;
};

type GalleryImage = {
  src: string;
  alt: string;
};

const defaultStores: Store[] = [
  {
    id: 'piratininga',
    name: 'Loja Piratininga',
    address: 'R. Montalverne, 136 - Piratininga, Osasco - SP, 06230-020',
    phone: '(11) 3656-0634',
    whatsapp: '551136560634',
    imageSrc: galleryImages[0]?.src,
    imageSrcTwo: galleryImages[1]?.src,
  },
  {
    id: 'novo-osasco',
    name: 'Loja Novo Osasco',
    address: 'Av. Visc. de Nova Granada, 42A - Vila Osasco, Osasco - SP',
    phone: '(11) 3683-4125',
    whatsapp: '551136834125',
    imageSrc: galleryImages[1]?.src,
    imageSrcTwo: galleryImages[2]?.src,
  },
] as Store[];

type TireItem = {
  imageIndex: number;
  imageSrc?: string;
  measure: string;
  brand: string;
  value: string;
};

type TireSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  layout: 'grid' | 'recapagem';
  items: TireItem[];
};

type SiteContent = {
  tireShowcaseSlides: TireSlide[];
  galleryImages: GalleryImage[];
  stores: Store[];
};

const tireStorageKey = 'intercap-tire-showcase';
const galleryStorageKey = 'intercap-gallery-images';
const storesStorageKey = 'intercap-stores';
const employeePassword = 'IPN@2026';
const siteContentApi = '/api/site-content';

const defaultTireShowcaseSlides: TireSlide[] = [
  {
    id: 'novos',
    eyebrow: 'Pneus novos',
    title: 'Pneus novos',
    description: 'Opcoes para carga pesada com medida, marca e valor para consulta rapida.',
    layout: 'grid',
    items: [
      { imageIndex: 0, measure: '295/80R22.5', brand: 'Bridgestone', value: 'R$00,00' },
      { imageIndex: 1, measure: '275/80R22.5', brand: 'Goodyear', value: 'R$00,00' },
      { imageIndex: 2, measure: '215/75R17.5', brand: 'Pirelli', value: 'R$00,00' },
      { imageIndex: 3, measure: '11R22.5', brand: 'Michelin', value: 'R$00,00' },
      { imageIndex: 4, measure: '235/75R17.5', brand: 'Continental', value: 'R$00,00' },
      { imageIndex: 5, measure: '225/75R16', brand: 'Firestone', value: 'R$00,00' },
    ],
  },
  {
    id: 'recapados',
    eyebrow: 'Pneu recapado',
    title: 'Pneus recapados',
    description: 'Alternativas revisadas para reduzir custo por quilometro na sua frota.',
    layout: 'grid',
    items: [
      { imageIndex: 6, measure: '295/80R22.5', brand: 'Banda borrachuda', value: 'R$00,00' },
      { imageIndex: 7, measure: '275/80R22.5', brand: 'Banda lisa', value: 'R$00,00' },
      { imageIndex: 8, measure: '215/75R17.5', brand: 'Banda mista', value: 'R$00,00' },
      { imageIndex: 9, measure: '11R22.5', brand: 'Banda direcional', value: 'R$00,00' },
      { imageIndex: 10, measure: '235/75R17.5', brand: 'Banda regional', value: 'R$00,00' },
      { imageIndex: 11, measure: '225/75R16', brand: 'Banda urbana', value: 'R$00,00' },
    ],
  },
  {
    id: 'recapagem',
    eyebrow: 'Recapagem de pneus',
    title: 'Recapagem de pneus',
    description: 'Servicos de recapagem por medida para recuperar rendimento com seguranca.',
    layout: 'recapagem',
    items: [
      { imageIndex: 2, measure: '295/80-22.5', brand: 'LISO', value: 'R$00,00' },
      { imageIndex: 4, measure: '295/80-22.5', brand: 'MISTO', value: 'R$00,00' },
      { imageIndex: 6, measure: '295/80-22.5', brand: 'BORRACHUDO', value: 'R$00,00' },
      { imageIndex: 8, measure: '275/80-22.5', brand: 'LISO', value: 'R$00,00' },
      { imageIndex: 10, measure: '275/80-22.5', brand: 'MISTO', value: 'R$00,00' },
      { imageIndex: 0, measure: '275/80-22.5', brand: 'BORRACHUDO', value: 'R$00,00' },
      { imageIndex: 1, measure: '11R22.5', brand: 'LISO', value: 'R$00,00' },
      { imageIndex: 3, measure: '11R22.5', brand: 'MISTO', value: 'R$00,00' },
      { imageIndex: 5, measure: '11R22.5', brand: 'BORRACHUDO', value: 'R$00,00' },
    ],
  },
] as TireSlide[];

function loadGalleryImages() {
  try {
    const savedImages = window.localStorage.getItem(galleryStorageKey);
    if (!savedImages) {
      return galleryImages;
    }

    return JSON.parse(savedImages) as GalleryImage[];
  } catch {
    return galleryImages;
  }
}

function loadStores() {
  try {
    const savedStores = window.localStorage.getItem(storesStorageKey);
    if (!savedStores) {
      return defaultStores;
    }

    return JSON.parse(savedStores) as Store[];
  } catch {
    return defaultStores;
  }
}

function loadTireShowcaseSlides() {
  try {
    const savedSlides = window.localStorage.getItem(tireStorageKey);
    if (!savedSlides) {
      return defaultTireShowcaseSlides;
    }

    return JSON.parse(savedSlides) as TireSlide[];
  } catch {
    return defaultTireShowcaseSlides;
  }
}

function getCurrentSiteContent(tireShowcaseSlides: TireSlide[], editableGalleryImages: GalleryImage[], editableStores: Store[]) {
  return {
    tireShowcaseSlides,
    galleryImages: editableGalleryImages,
    stores: editableStores,
  };
}

function persistLocalContent(content: SiteContent) {
  window.localStorage.setItem(tireStorageKey, JSON.stringify(content.tireShowcaseSlides));
  window.localStorage.setItem(galleryStorageKey, JSON.stringify(content.galleryImages));
  window.localStorage.setItem(storesStorageKey, JSON.stringify(content.stores));
}

function getItemImage(item: TireItem) {
  return item.imageSrc || galleryImages[item.imageIndex % galleryImages.length]?.src;
}

function getStoreImage(store: Store) {
  return store.imageSrc || galleryImages[0]?.src;
}

function getStoreSecondImage(store: Store) {
  return store.imageSrcTwo || store.imageSrc || galleryImages[1]?.src || galleryImages[0]?.src;
}

function compressImageFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const source = String(reader.result);
      const image = new Image();

      image.onerror = () => resolve(source);
      image.onload = () => {
        const maxSize = 1200;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
          resolve(source);
          return;
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };

      image.src = source;
    };

    reader.readAsDataURL(file);
  });
}

function App() {
  const isGalleryPage = window.location.pathname === '/galeria';
  const isEmployeePage = window.location.pathname === '/funcionario';
  const [editableStores, setEditableStores] = useState<Store[]>(loadStores);
  const [editableGalleryImages, setEditableGalleryImages] = useState<GalleryImage[]>(loadGalleryImages);
  const [selectedStoreId, setSelectedStoreId] = useState('piratininga');
  const [tireShowcaseSlides, setTireShowcaseSlides] = useState<TireSlide[]>(loadTireShowcaseSlides);
  const [activeTireSlide, setActiveTireSlide] = useState(0);
  const [isTireShowcasePinned, setIsTireShowcasePinned] = useState(false);
  const [activeEmployeeSection, setActiveEmployeeSection] = useState<'pneus' | 'galeria' | 'enderecos'>('pneus');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [typedEmployeePassword, setTypedEmployeePassword] = useState('');
  const [isEmployeeUnlocked, setIsEmployeeUnlocked] = useState(false);
  const [employeeError, setEmployeeError] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const selectedStore = editableStores.find((store) => store.id === selectedStoreId) ?? editableStores[0] ?? defaultStores[0];
  const selectedTireSlide = tireShowcaseSlides[activeTireSlide] ?? tireShowcaseSlides[0] ?? defaultTireShowcaseSlides[0];
  const selectedStoreMap = `https://www.google.com/maps?q=${encodeURIComponent(selectedStore.address)}&output=embed`;
  const selectedStoreWhatsapp = `https://wa.me/${selectedStore.whatsapp}?text=${encodeURIComponent(
    `Olá! Vim pela landing page e quero atendimento na ${selectedStore.name}.`,
  )}`;

  const applySiteContent = useCallback((content: SiteContent) => {
    setTireShowcaseSlides(content.tireShowcaseSlides);
    setEditableGalleryImages(content.galleryImages);
    setEditableStores(content.stores);
    persistLocalContent(content);
  }, []);

  const loadOnlineContent = useCallback(async () => {
    try {
      const response = await fetch(siteContentApi, { cache: 'no-store' });

      if (response.status === 404) {
        return;
      }

      if (!response.ok) {
        throw new Error('Nao foi possivel carregar os dados online.');
      }

      const content = (await response.json()) as SiteContent;
      applySiteContent(content);
    } catch {
      setSaveStatus('Modo offline: usando dados salvos neste aparelho.');
    }
  }, [applySiteContent]);

  const persistTireSlides = (nextSlides: TireSlide[]) => {
    setTireShowcaseSlides(nextSlides);
    setHasUnsavedChanges(true);
  };

  const updateTireItem = (slideIndex: number, itemIndex: number, field: keyof TireItem, value: string | number) => {
    persistTireSlides(
      tireShowcaseSlides.map((slide, currentSlideIndex) =>
        currentSlideIndex === slideIndex
          ? {
              ...slide,
              items: slide.items.map((item, currentItemIndex) =>
                currentItemIndex === itemIndex ? { ...item, [field]: value } : item,
              ),
            }
          : slide,
      ),
    );
  };

  const uploadTireImage = (slideIndex: number, itemIndex: number, file: File | null) => {
    if (!file) {
      return;
    }

    compressImageFile(file).then((imageSrc) => updateTireItem(slideIndex, itemIndex, 'imageSrc', imageSrc));
  };

  const addTireItem = (slideIndex: number) => {
    const targetSlide = tireShowcaseSlides[slideIndex];
    const nextItem: TireItem = {
      imageIndex: targetSlide.items.length % Math.max(galleryImages.length, 1),
      measure: targetSlide.layout === 'recapagem' ? '295/80-22.5' : 'Nova medida',
      brand: targetSlide.layout === 'recapagem' ? 'LISO' : 'Nova marca',
      value: 'R$00,00',
    };

    persistTireSlides(
      tireShowcaseSlides.map((slide, currentSlideIndex) =>
        currentSlideIndex === slideIndex ? { ...slide, items: [...slide.items, nextItem] } : slide,
      ),
    );
  };

  const removeTireItem = (slideIndex: number, itemIndex: number) => {
    if (!window.confirm('Deseja mesmo excluir este quadro?')) {
      return;
    }

    persistTireSlides(
      tireShowcaseSlides.map((slide, currentSlideIndex) =>
        currentSlideIndex === slideIndex
          ? { ...slide, items: slide.items.filter((_, currentItemIndex) => currentItemIndex !== itemIndex) }
          : slide,
      ),
    );
  };

  const unlockEmployeePage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (typedEmployeePassword === employeePassword) {
      setIsEmployeeUnlocked(true);
      setEmployeeError('');
      return;
    }

    setEmployeeError('Senha incorreta.');
  };

  const persistGalleryImages = (nextImages: GalleryImage[]) => {
    setEditableGalleryImages(nextImages);
    setHasUnsavedChanges(true);
  };

  const updateGalleryImage = (imageIndex: number, field: keyof GalleryImage, value: string) => {
    persistGalleryImages(
      editableGalleryImages.map((image, currentImageIndex) =>
        currentImageIndex === imageIndex ? { ...image, [field]: value } : image,
      ),
    );
  };

  const uploadGalleryImage = (imageIndex: number, file: File | null) => {
    if (!file) {
      return;
    }

    compressImageFile(file).then((imageSrc) => updateGalleryImage(imageIndex, 'src', imageSrc));
  };

  const addGalleryImage = () => {
    persistGalleryImages([
      ...editableGalleryImages,
      {
        src: galleryImages[0]?.src ?? '',
        alt: 'Nova foto da galeria',
      },
    ]);
  };

  const removeGalleryImage = (imageIndex: number) => {
    if (!window.confirm('Deseja mesmo excluir esta foto da galeria?')) {
      return;
    }

    persistGalleryImages(editableGalleryImages.filter((_, currentImageIndex) => currentImageIndex !== imageIndex));
  };

  const persistStores = (nextStores: Store[]) => {
    setEditableStores(nextStores);
    setHasUnsavedChanges(true);
    if (!nextStores.some((store) => store.id === selectedStoreId)) {
      setSelectedStoreId(nextStores[0]?.id ?? defaultStores[0].id);
    }
  };

  const saveEmployeeChanges = async () => {
    const content = getCurrentSiteContent(tireShowcaseSlides, editableGalleryImages, editableStores);

    try {
      setSaveStatus('Salvando para todos...');
      const response = await fetch(siteContentApi, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Employee-Password': employeePassword,
        },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        throw new Error('Nao foi possivel salvar online.');
      }

      persistLocalContent(content);
      setHasUnsavedChanges(false);
      setSaveStatus('Alteracao salva para todos os visitantes.');
    } catch {
      try {
        persistLocalContent(content);
      } catch {
        window.alert('Nao foi possivel salvar. Tente usar imagens menores.');
        return;
      }

      setSaveStatus('Nao foi possivel salvar online. Verifique o armazenamento da Cloudflare.');
    }
  };

  const updateStore = (storeIndex: number, field: keyof Store, value: string) => {
    persistStores(
      editableStores.map((store, currentStoreIndex) =>
        currentStoreIndex === storeIndex ? { ...store, [field]: value } : store,
      ),
    );
  };

  const uploadStoreImage = (storeIndex: number, file: File | null) => {
    if (!file) {
      return;
    }

    compressImageFile(file).then((imageSrc) => updateStore(storeIndex, 'imageSrc', imageSrc));
  };

  const uploadStoreSecondImage = (storeIndex: number, file: File | null) => {
    if (!file) {
      return;
    }

    compressImageFile(file).then((imageSrc) => updateStore(storeIndex, 'imageSrcTwo', imageSrc));
  };

  const addStore = () => {
    const nextStoreNumber = editableStores.length + 1;
    persistStores([
      ...editableStores,
      {
        id: `loja-${Date.now()}`,
        name: `Nova loja ${nextStoreNumber}`,
        address: 'Digite o endereco completo',
        phone: '(11) 0000-0000',
        whatsapp: '5511910729582',
        imageSrc: galleryImages[0]?.src,
        imageSrcTwo: galleryImages[1]?.src,
      },
    ]);
  };

  const removeStore = (storeIndex: number) => {
    if (!window.confirm('Deseja mesmo excluir esta loja?')) {
      return;
    }

    persistStores(editableStores.filter((_, currentStoreIndex) => currentStoreIndex !== storeIndex));
  };

  useEffect(() => {
    if (isTireShowcasePinned) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveTireSlide((currentSlide) => (currentSlide + 1) % tireShowcaseSlides.length);
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [isTireShowcasePinned, tireShowcaseSlides.length]);

  useEffect(() => {
    loadOnlineContent();
  }, [loadOnlineContent]);

  useEffect(() => {
    if (isEmployeePage && hasUnsavedChanges) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      loadOnlineContent();
    }, 15000);

    return () => window.clearInterval(intervalId);
  }, [hasUnsavedChanges, isEmployeePage, loadOnlineContent]);

  if (isEmployeePage) {
    return (
      <main className="site-shell employee-shell">
        <header className="header">
          <a className="brand" href="/" aria-label="Intercap Pneus">
            <img className="brand-logo" src={logoImage} alt="Intercap Pneus" />
          </a>

          <nav className="nav" aria-label="Navegacao funcionario">
            <a className="gallery-link" href="/">Voltar para o site</a>
          </nav>
        </header>

        <section className="employee-page">
          {!isEmployeeUnlocked ? (
            <form className="employee-login" onSubmit={unlockEmployeePage}>
              <Lock size={34} />
              <h1>Acesso funcionario</h1>
              <label>
                Senha
                <input
                  type="password"
                  value={typedEmployeePassword}
                  onChange={(event) => setTypedEmployeePassword(event.target.value)}
                  autoFocus
                />
              </label>
              {employeeError && <p className="employee-error">{employeeError}</p>}
              <button type="submit">
                <Lock size={18} />
                Entrar
              </button>
            </form>
          ) : (
            <div className="employee-editor">
              <div className="employee-editor-heading">
                <div>
                  <span>Area interna</span>
                  <h1>Painel de edicao</h1>
                  <p>Depois de alterar, clique em Salvar alteracao para publicar para todos.</p>
                  {saveStatus && <p className="employee-save-status">{saveStatus}</p>}
                </div>
                <a className="employee-save-note" href="/">
                  <Save size={18} />
                  Ver no site
                </a>
              </div>

              <div className="employee-section-tabs" role="tablist" aria-label="Escolher area para editar">
                <button className={activeEmployeeSection === 'pneus' ? 'active' : ''} type="button" onClick={() => setActiveEmployeeSection('pneus')}>
                  1. Pneus e valores
                </button>
                <button className={activeEmployeeSection === 'galeria' ? 'active' : ''} type="button" onClick={() => setActiveEmployeeSection('galeria')}>
                  2. Galeria de fotos
                </button>
                <button className={activeEmployeeSection === 'enderecos' ? 'active' : ''} type="button" onClick={() => setActiveEmployeeSection('enderecos')}>
                  3. Enderecos
                </button>
              </div>

              {activeEmployeeSection === 'pneus' && tireShowcaseSlides.map((slide, slideIndex) => (
                <section key={slide.id} className="employee-category">
                  <div className="employee-category-heading">
                    <div>
                      <h2>{slideIndex + 1}. {slide.title}</h2>
                      <p>{slide.layout === 'recapagem' ? 'Edite medida, tipo, imagem e valor.' : 'Edite medida, marca, imagem e valor.'}</p>
                    </div>
                    <button type="button" onClick={() => addTireItem(slideIndex)}>
                      <Plus size={18} />
                      Adicionar quadro
                    </button>
                  </div>

                  <div className="employee-items-grid">
                    {slide.items.map((item, itemIndex) => (
                      <article key={`${slide.id}-${itemIndex}`} className="employee-item-card">
                        <span className="employee-item-number">{itemIndex + 1}</span>
                        <img src={getItemImage(item)} alt={item.brand || item.measure} />
                        <div className="employee-item-fields">
                          <label>
                            Medida
                            <input
                              value={item.measure}
                              onChange={(event) => updateTireItem(slideIndex, itemIndex, 'measure', event.target.value)}
                            />
                          </label>
                          <label>
                            {slide.layout === 'recapagem' ? 'Tipo' : 'Marca'}
                            <input
                              value={item.brand}
                              onChange={(event) => updateTireItem(slideIndex, itemIndex, 'brand', event.target.value)}
                            />
                          </label>
                          <label>
                            Valor
                            <input
                              value={item.value}
                              onChange={(event) => updateTireItem(slideIndex, itemIndex, 'value', event.target.value)}
                            />
                          </label>
                          <div className="employee-upload-actions">
                            <label className="employee-upload">
                              <Upload size={17} />
                              Tirar foto
                              <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={(event) => uploadTireImage(slideIndex, itemIndex, event.target.files?.[0] ?? null)}
                              />
                            </label>
                            <label className="employee-upload">
                              <Upload size={17} />
                              Escolher da galeria
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(event) => uploadTireImage(slideIndex, itemIndex, event.target.files?.[0] ?? null)}
                              />
                            </label>
                          </div>
                        </div>
                        <button className="employee-remove" type="button" onClick={() => removeTireItem(slideIndex, itemIndex)}>
                          <Trash2 size={17} />
                          Remover
                        </button>
                      </article>
                    ))}
                  </div>
                </section>
              ))}

              {activeEmployeeSection === 'galeria' && (
                <section className="employee-category">
                  <div className="employee-category-heading">
                    <div>
                      <h2>2. Galeria de fotos</h2>
                      <p>Troque imagens, tire uma foto na hora ou remova fotos da galeria.</p>
                    </div>
                    <button type="button" onClick={addGalleryImage}>
                      <Plus size={18} />
                      Adicionar foto
                    </button>
                  </div>

                  <div className="employee-gallery-grid">
                    {editableGalleryImages.map((image, imageIndex) => (
                      <article key={`${image.src}-${imageIndex}`} className="employee-gallery-card">
                        <span className="employee-item-number">{imageIndex + 1}</span>
                        <img src={image.src} alt={image.alt} />
                        <label>
                          Nome/descricao da foto
                          <input value={image.alt} onChange={(event) => updateGalleryImage(imageIndex, 'alt', event.target.value)} />
                        </label>
                        <div className="employee-upload-actions">
                          <label className="employee-upload">
                            <Upload size={17} />
                            Tirar foto
                            <input
                              type="file"
                              accept="image/*"
                              capture="environment"
                              onChange={(event) => uploadGalleryImage(imageIndex, event.target.files?.[0] ?? null)}
                            />
                          </label>
                          <label className="employee-upload">
                            <Upload size={17} />
                            Escolher da galeria
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(event) => uploadGalleryImage(imageIndex, event.target.files?.[0] ?? null)}
                            />
                          </label>
                        </div>
                        <button className="employee-remove" type="button" onClick={() => removeGalleryImage(imageIndex)}>
                          <Trash2 size={17} />
                          Remover foto
                        </button>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {activeEmployeeSection === 'enderecos' && (
                <section className="employee-category">
                  <div className="employee-category-heading">
                    <div>
                      <h2>3. Enderecos</h2>
                      <p>Edite as lojas existentes ou adicione uma nova unidade.</p>
                    </div>
                    <button type="button" onClick={addStore}>
                      <Plus size={18} />
                      Adicionar loja
                    </button>
                  </div>

                  <div className="employee-store-grid">
                    {editableStores.map((store, storeIndex) => (
                      <article key={store.id} className="employee-store-card">
                        <span className="employee-item-number">{storeIndex + 1}</span>
                        <div className="employee-store-images">
                          <img className="employee-store-image" src={getStoreImage(store)} alt={`${store.name} imagem 1`} />
                          <img className="employee-store-image" src={getStoreSecondImage(store)} alt={`${store.name} imagem 2`} />
                        </div>
                        <label>
                          Nome da loja
                          <input value={store.name} onChange={(event) => updateStore(storeIndex, 'name', event.target.value)} />
                        </label>
                        <label>
                          Endereco completo
                          <input value={store.address} onChange={(event) => updateStore(storeIndex, 'address', event.target.value)} />
                        </label>
                        <label>
                          Telefone
                          <input value={store.phone} onChange={(event) => updateStore(storeIndex, 'phone', event.target.value)} />
                        </label>
                        <label>
                          WhatsApp com codigo do pais
                          <input value={store.whatsapp} onChange={(event) => updateStore(storeIndex, 'whatsapp', event.target.value)} />
                        </label>
                        <div className="employee-store-upload-group">
                          <span>Imagem 1</span>
                          <div className="employee-upload-actions">
                            <label className="employee-upload">
                              <Upload size={17} />
                              Tirar foto
                              <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={(event) => uploadStoreImage(storeIndex, event.target.files?.[0] ?? null)}
                              />
                            </label>
                            <label className="employee-upload">
                              <Upload size={17} />
                              Escolher da galeria
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(event) => uploadStoreImage(storeIndex, event.target.files?.[0] ?? null)}
                              />
                            </label>
                          </div>
                        </div>
                        <div className="employee-store-upload-group">
                          <span>Imagem 2</span>
                          <div className="employee-upload-actions">
                            <label className="employee-upload">
                              <Upload size={17} />
                              Tirar foto
                              <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={(event) => uploadStoreSecondImage(storeIndex, event.target.files?.[0] ?? null)}
                              />
                            </label>
                            <label className="employee-upload">
                              <Upload size={17} />
                              Escolher da galeria
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(event) => uploadStoreSecondImage(storeIndex, event.target.files?.[0] ?? null)}
                              />
                            </label>
                          </div>
                        </div>
                        <button className="employee-remove" type="button" onClick={() => removeStore(storeIndex)}>
                          <Trash2 size={17} />
                          Remover loja
                        </button>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </section>
        {isEmployeeUnlocked && hasUnsavedChanges && (
          <button className="employee-floating-save" type="button" onClick={saveEmployeeChanges}>
            <Save size={19} />
            Salvar alteracao
          </button>
        )}
      </main>
    );
  }

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

          {editableGalleryImages.length > 0 ? (
            <div className="gallery-grid">
              {editableGalleryImages.map((image) => (
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
            <a className="primary-button title-button" href="#unidades">
              <MessageCircle size={22} />
              <span>
                Conheca as nossas lojas e
                <br />
                fale com nossos atendentes
              </span>
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

      <section className="tire-showcase" aria-labelledby="tire-showcase-title">
        <div className="tire-showcase-heading">
          <div>
            <span>{selectedTireSlide.eyebrow}</span>
            <h2 id="tire-showcase-title">{selectedTireSlide.title}</h2>
            <p>{selectedTireSlide.description}</p>
          </div>

          <div className="showcase-tabs" role="tablist" aria-label="Selecionar tipo de pneu">
            {tireShowcaseSlides.map((slide, slideIndex) => (
              <button
                key={slide.id}
                className={slideIndex === activeTireSlide ? 'active' : ''}
                type="button"
                role="tab"
                aria-selected={slideIndex === activeTireSlide}
                onClick={() => {
                  setActiveTireSlide(slideIndex);
                  setIsTireShowcasePinned(true);
                }}
              >
                {slide.title}
              </button>
            ))}
          </div>
        </div>

        <div className={`showcase-panel showcase-panel-${selectedTireSlide.layout}`}>
          {selectedTireSlide.layout === 'recapagem' ? (
            <div className="recapage-mural">
              {Array.from(new Set(selectedTireSlide.items.map((item) => item.measure))).map((measure) => (
                <div key={measure} className="recapage-row">
                  <h3>{measure}</h3>
                  <div className="price-mural">
                    {selectedTireSlide.items
                      .filter((item) => item.measure === measure)
                      .map((item) => {
                        const imageSrc = getItemImage(item);
                        const imageAlt = galleryImages[item.imageIndex % galleryImages.length]?.alt ?? item.brand;

                        return (
                          <article key={`${selectedTireSlide.id}-${item.measure}-${item.brand}`} className="price-card recapage-card">
                            <img className="price-card-image" src={imageSrc} alt={imageAlt} loading="lazy" />
                            <div className="price-card-copy">
                              <strong>{item.brand}</strong>
                              <em>{item.value}</em>
                            </div>
                            <a className="price-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer">
                              CHAME AGORA!
                            </a>
                          </article>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <div className="price-mural">
            {selectedTireSlide.items.map((item) => {
              const imageSrc = getItemImage(item);
              const imageAlt = galleryImages[item.imageIndex % galleryImages.length]?.alt ?? item.brand;

              return (
                <article key={`${selectedTireSlide.id}-${item.measure}-${item.brand}`} className="price-card">
                  <img className="price-card-image" src={imageSrc} alt={imageAlt} loading="lazy" />
                  <div className="price-card-copy">
                    <strong>{item.measure}</strong>
                    <span>{item.brand}</span>
                    <em>{item.value}</em>
                  </div>
                  <a className="price-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer">
                    CHAME AGORA!
                  </a>
                </article>
              );
            })}
          </div>
          )}
        </div>
      </section>

      <section id="contato" className="contact-band">
        <div>
          <h2>CHAME AGORA E ENCONTRE O PNEU CERTO PARA O SEU CAMINHÃO.</h2>
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
            {editableStores.map((store) => (
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

        <figure className="selected-store-photo">
          <div className="selected-store-photo-grid">
            <img src={getStoreImage(selectedStore)} alt={`Foto 1 ${selectedStore.name}`} loading="lazy" />
            <img src={getStoreSecondImage(selectedStore)} alt={`Foto 2 ${selectedStore.name}`} loading="lazy" />
          </div>
          <figcaption>{selectedStore.name}</figcaption>
        </figure>
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
          <a className="employee-access-link" href="/funcionario">Acesso funcionario</a>
        </div>
      </footer>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);

