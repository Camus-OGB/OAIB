import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FileText,
  Image,
  Calendar,
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Save,
  X,
  Upload,
  Link as LinkIcon,
  Bold,
  Italic,
  List,
  AlignLeft,
  Clock,
  CheckCircle,
  Globe,
  Users,
  Loader2
} from 'lucide-react';
import { Quote } from 'lucide-react';
import type { Page, NewsArticle, FAQItem as FAQItemType, MediaItem, Phase, Partner, Testimonial } from '../../shared/types';
import * as cmsService from '../../services/cmsService';
import { listPhases, createPhase, updatePhase } from '../../services/examService';
import { useToast } from '../../shared/hooks/useToast';
import Toast from '../../shared/components/ui/Toast';
import CMSHelp from '../components/CMSHelp';
import ImageUpload from '../components/ImageUpload';
import api from '../../lib/apiClient';

type ContentType = 'pages' | 'news' | 'faq' | 'media' | 'timeline' | 'partners' | 'testimonials';

const tabs = [
  // { id: 'pages', label: 'Pages', icon: FileText }, // Désactivé temporairement
  { id: 'news', label: 'Actualités', icon: Globe },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
  // { id: 'media', label: 'Médias', icon: Image }, // Désactivé (sera géré via upload direct)
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'partners', label: 'Partenaires', icon: Users },
  { id: 'testimonials', label: 'Témoignages', icon: Quote },
];

const AdminContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ContentType>('news');
  const [pages, setPages] = useState<Page[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [faq, setFaq] = useState<FAQItemType[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [timeline, setTimeline] = useState<Phase[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Form state ──────────────────────────────────────────
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formStatus, setFormStatus] = useState<'draft' | 'published'>('draft');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formWebsite, setFormWebsite] = useState('');
  const [formTier, setFormTier] = useState('gold');
  const [formDescription, setFormDescription] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formPhaseNumber, setFormPhaseNumber] = useState(1);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  // ── Data fetching ───────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'pages': {
          const res = await cmsService.listPages();
          if (res.ok) {
            setPages(res.data?.results || []);
          } else {
            console.error('Erreur chargement pages:', res.error);
            setPages([]);
          }
          break;
        }
        case 'news': {
          const res = await cmsService.listNews('', true);
          if (res.ok) {
            setNews(res.data?.results || []);
          } else {
            console.error('Erreur chargement news:', res.error);
            setNews([]);
          }
          break;
        }
        case 'faq': {
          const res = await cmsService.listFAQ('', true);
          if (res.ok) {
            setFaq(res.data?.results || []);
          } else {
            console.error('Erreur chargement FAQ:', res.error);
            setFaq([]);
          }
          break;
        }
        case 'media': {
          const res = await cmsService.listMedia();
          if (res.ok) {
            setMediaItems(res.data?.results || []);
          } else {
            console.error('Erreur chargement media:', res.error);
            setMediaItems([]);
          }
          break;
        }
        case 'timeline': {
          const res = await listPhases();
          if (res.ok) {
            setTimeline(res.data?.results || []);
          } else {
            console.error('Erreur chargement timeline:', res.error);
            setTimeline([]);
          }
          break;
        }
        case 'partners': {
          const res = await cmsService.listPartners('', true);
          if (res.ok) {
            setPartners(res.data?.results || []);
          } else {
            console.error('Erreur chargement partners:', res.error);
            setPartners([]);
          }
          break;
        }
        case 'testimonials': {
          const res = await cmsService.listTestimonials('', true);
          if (res.ok) {
            setTestimonials(res.data?.results || []);
          } else {
            console.error('Erreur chargement testimonials:', res.error);
            setTestimonials([]);
          }
          break;
        }
      }
    } catch (err) {
      console.error('Erreur chargement:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Editor helpers ──────────────────────────────────────
  const openEditor = (item?: any) => {
    setEditingItem(item || null);
    if (item) {
      setFormTitle(item.title || item.question || item.name || '');
      setFormContent(item.content || item.answer || item.quote || '');
      setFormStatus(item.status || 'draft');
      setFormExcerpt(item.excerpt || '');
      setFormCategory(item.category || item.role || '');
      setFormWebsite(item.website || '');
      setFormTier(item.tier || 'gold');
      setFormDescription(item.description || '');
      setFormStartDate(item.start_date || '');
      setFormEndDate(item.end_date || '');
      setFormVideoUrl(item.video_url || '');
      setFormPhaseNumber(item.phase_number || 1);
      setCurrentImageUrl(item.image || item.logo || null);
      setSelectedImage(null);
    } else {
      setFormTitle(''); setFormContent(''); setFormStatus('draft');
      setFormExcerpt(''); setFormCategory(''); setFormWebsite('');
      setFormTier('gold'); setFormDescription(''); setFormStartDate(''); setFormEndDate('');
      setFormVideoUrl(''); setFormPhaseNumber(1);
      setCurrentImageUrl(null); setSelectedImage(null);
    }
    setShowEditor(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Pages (pas d'image)
      if (activeTab === 'pages') {
        const data = { title: formTitle, content: formContent, status: formStatus };
        if (editingItem) await cmsService.updatePage(editingItem.slug, data);
        else await cmsService.createPage(data);
      }

      // News (avec ou sans image)
      else if (activeTab === 'news') {
        if (selectedImage) {
          const formData = new FormData();
          formData.append('title', formTitle);
          formData.append('excerpt', formExcerpt);
          formData.append('content', formContent);
          formData.append('status', formStatus);
          formData.append('author', 'Admin OAIB');
          formData.append('image', selectedImage);

          if (editingItem) {
            await api.patch(`/cms/news/${editingItem.id}/`, formData, { isFormData: true });
          } else {
            await api.post('/cms/news/', formData, { isFormData: true });
          }
        } else {
          const data = { title: formTitle, excerpt: formExcerpt, content: formContent, status: formStatus };
          if (editingItem) await cmsService.updateNewsArticle(editingItem.id, data);
          else await cmsService.createNewsArticle(data);
        }
      }

      // FAQ (pas d'image)
      else if (activeTab === 'faq') {
        const data = { question: formTitle, answer: formContent, category: formCategory };
        if (editingItem) await cmsService.updateFAQ(editingItem.id, data);
        else await cmsService.createFAQ(data);
      }

      // Timeline (pas d'image)
      else if (activeTab === 'timeline') {
        const data = {
          title: formTitle,
          description: formDescription,
          start_date: formStartDate,
          end_date: formEndDate,
          phase_number: formPhaseNumber,
          // edition est géré automatiquement par le backend
        };
        if (editingItem) {
          await updatePhase(editingItem.id, data);
        } else {
          await createPhase(data);
        }
      }

      // Partners (avec ou sans logo)
      else if (activeTab === 'partners') {
        if (selectedImage) {
          const formData = new FormData();
          formData.append('name', formTitle);
          formData.append('website', formWebsite);
          formData.append('tier', formTier);
          formData.append('logo', selectedImage);

          if (editingItem) {
            await api.patch(`/cms/partners/${editingItem.id}/`, formData, { isFormData: true });
          } else {
            await api.post('/cms/partners/', formData, { isFormData: true });
          }
        } else {
          const data = { name: formTitle, website: formWebsite, tier: formTier };
          if (editingItem) await cmsService.updatePartner(editingItem.id, data);
          else await cmsService.createPartner(data);
        }
      }

      // Testimonials (avec ou sans photo)
      else if (activeTab === 'testimonials') {
        if (selectedImage) {
          const formData = new FormData();
          formData.append('name', formTitle);
          formData.append('role', formCategory);
          formData.append('quote', formContent);
          formData.append('video_url', formVideoUrl || '');
          formData.append('image', selectedImage);

          if (editingItem) {
            await api.patch(`/cms/testimonials/${editingItem.id}/`, formData, { isFormData: true });
          } else {
            await api.post('/cms/testimonials/', formData, { isFormData: true });
          }
        } else {
          const data = { name: formTitle, role: formCategory, quote: formContent, video_url: formVideoUrl };
          if (editingItem) await cmsService.updateTestimonial(editingItem.id, data);
          else await cmsService.createTestimonial(data);
        }
      }

      setShowEditor(false);
      fetchData();
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      alert('Erreur lors de l\'enregistrement. Consultez la console.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (type: string, id: number | string) => {
    if (!confirm('Supprimer cet élément ?')) return;
    try {
      if (type === 'page') await cmsService.deletePage(String(id));
      else if (type === 'news') await cmsService.deleteNewsArticle(Number(id));
      else if (type === 'faq') await cmsService.deleteFAQ(Number(id));
      else if (type === 'media') await cmsService.deleteMedia(Number(id));
      else if (type === 'partner') await cmsService.deletePartner(Number(id));
      else if (type === 'testimonial') await cmsService.deleteTestimonial(Number(id));
      fetchData();
    } catch (err) {
      console.error('Erreur suppression:', err);
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    try {
      await cmsService.uploadMedia(formData);
      fetchData();
    } catch (err) {
      console.error('Erreur upload:', err);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Gestion de Contenu</h1>
          <p className="text-slate-400 mt-1">Éditez les pages, actualités et FAQ du site</p>
        </div>
        <button
          onClick={() => openEditor()}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors"
        >
          <Plus size={18} />
          {activeTab === 'pages' && 'Nouvelle page'}
          {activeTab === 'news' && 'Nouvelle actualité'}
          {activeTab === 'faq' && 'Nouvelle question'}
          {activeTab === 'media' && 'Uploader'}
          {activeTab === 'timeline' && 'Nouvelle phase'}
          {activeTab === 'partners' && 'Nouveau partenaire'}
          {activeTab === 'testimonials' && 'Nouveau témoignage'}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-2">
        <div className="flex overflow-x-auto gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ContentType)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-accent text-white'
                  : 'text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pages Tab */}
      {activeTab === 'pages' && (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
          ) : pages.length === 0 ? (
            <div className="text-center py-16 text-slate-400">Aucune page trouvée</div>
          ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Page</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">URL</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Statut</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Modifié</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="py-4 px-6">
                    <p className="text-white font-medium">{page.title}</p>
                  </td>
                  <td className="py-4 px-6">
                    <code className="text-accent text-sm">{page.slug}</code>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      page.status === 'published'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {page.status === 'published' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {page.status === 'published' ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-400 text-sm">{page.last_modified ? new Date(page.last_modified).toLocaleDateString('fr-FR') : '-'}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-600 rounded-lg transition-colors text-slate-400 hover:text-white">
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => openEditor(page)}
                        className="p-2 hover:bg-slate-600 rounded-lg transition-colors text-slate-400 hover:text-white"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete('page', page.slug)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      )}

      {/* News Tab */}
      {activeTab === 'news' && (
        loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-16 text-slate-400">Aucune actualité trouvée</div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {news.map((item) => (
            <div key={item.id} className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  item.status === 'published'
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-yellow-500/10 text-yellow-400'
                }`}>
                  {item.status === 'published' ? 'Publié' : 'Brouillon'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditor(item)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete('news', item.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{item.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>ID auteur: {item.author}</span>
                <span>{item.published_at ? new Date(item.published_at).toLocaleDateString('fr-FR') : 'Non publié'}</span>
              </div>
            </div>
          ))}
        </div>
        )
      )}

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : faq.length === 0 ? (
          <div className="text-center py-16 text-slate-400">Aucune FAQ trouvée</div>
        ) : (
        <div className="space-y-3">
          {faq.map((item) => (
            <div key={item.id} className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="text-xs text-accent font-bold mb-2 block">{item.category}</span>
                  <h3 className="text-white font-bold mb-2">{item.question}</h3>
                  <p className="text-slate-400 text-sm">{item.answer}</p>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => openEditor(item)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete('faq', item.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )
      )}

      {/* Media Tab */}
      {activeTab === 'media' && (
        <div>
          {/* Upload zone */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*,video/*,.pdf,.doc,.docx"
            onChange={handleMediaUpload}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="bg-slate-800 rounded-2xl border-2 border-dashed border-slate-600 p-12 text-center mb-6 hover:border-accent transition-colors cursor-pointer"
          >
            <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-white font-medium mb-1">Glissez-déposez vos fichiers ici</p>
            <p className="text-slate-500 text-sm">ou cliquez pour sélectionner (images, vidéos, PDF)</p>
          </div>

          {/* Media grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
          ) : mediaItems.length === 0 ? (
            <div className="text-center py-16 text-slate-400">Aucun média trouvé</div>
          ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mediaItems.map((item) => (
              <div key={item.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden group relative">
                <div className="aspect-square bg-slate-700 flex items-center justify-center">
                  {item.media_type?.startsWith('image') ? (
                    <img src={item.file} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <Image className="w-8 h-8 text-slate-500" />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-white text-sm truncate">{item.name}</p>
                  <p className="text-slate-500 text-xs">{formatBytes(item.size_bytes)}</p>
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {item.file && (
                    <a href={item.file} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30">
                      <Eye size={16} />
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete('media', item.id)}
                    className="p-2 bg-red-500/50 rounded-lg text-white hover:bg-red-500/70"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
          ) : timeline.length === 0 ? (
            <div className="text-center py-16 text-slate-400">Aucune phase trouvée</div>
          ) : (
          <div className="relative">
            {timeline.map((phase, index) => (
              <div key={phase.id} className="flex gap-6 pb-8 last:pb-0">
                {/* Line */}
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                    phase.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    phase.status === 'active' ? 'bg-accent text-white' :
                    'bg-slate-700 text-slate-400'
                  }`}>
                    {phase.phase_number}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className={`w-0.5 flex-1 mt-2 ${
                      phase.status === 'completed' ? 'bg-green-500/30' : 'bg-slate-700'
                    }`} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold mb-2 ${
                        phase.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                        phase.status === 'active' ? 'bg-accent/20 text-accent' :
                        'bg-slate-700 text-slate-400'
                      }`}>
                        {phase.status === 'completed' ? 'Terminé' : phase.status === 'active' ? 'En cours' : 'À venir'}
                      </span>
                      <h3 className="text-white font-bold text-lg">{phase.title}</h3>
                      <p className="text-slate-400 mt-1">{phase.description}</p>
                      <p className="text-slate-500 text-sm mt-2">
                        {phase.start_date ? new Date(phase.start_date).toLocaleDateString('fr-FR') : '?'} → {phase.end_date ? new Date(phase.end_date).toLocaleDateString('fr-FR') : '?'}
                      </p>
                    </div>
                    <button
                      onClick={() => openEditor(phase)}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      )}

      {/* Partners Tab */}
      {activeTab === 'partners' && (
        loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : partners.length === 0 ? (
          <div className="text-center py-16 text-slate-400">Aucun partenaire trouvé</div>
        ) : (
        <div className="space-y-6">
          {['gold', 'silver', 'bronze'].map((tier) => {
            const tierPartners = partners.filter(p => p.tier === tier);
            if (tierPartners.length === 0) return null;

            return (
              <div key={tier}>
                <h3 className={`text-lg font-bold mb-4 ${
                  tier === 'gold' ? 'text-yellow-400' :
                  tier === 'silver' ? 'text-slate-300' :
                  'text-orange-400'
                }`}>
                  Partenaires {tier === 'gold' ? 'Or' : tier === 'silver' ? 'Argent' : 'Bronze'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tierPartners.map((partner) => (
                    <div key={partner.id} className="bg-slate-800 rounded-2xl border border-slate-700 p-6 flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center overflow-hidden">
                        {partner.logo ? (
                          <img src={partner.logo} alt={partner.name} className="w-full h-full object-cover" />
                        ) : (
                          <Image className="w-8 h-8 text-slate-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold">{partner.name}</h4>
                        <a href={partner.website} className="text-accent text-sm hover:underline flex items-center gap-1" target="_blank" rel="noopener noreferrer">
                          <LinkIcon size={12} />
                          Site web
                        </a>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditor(partner)}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete('partner', partner.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        )
      )}

      {/* Testimonials Tab */}
      {activeTab === 'testimonials' && (
        loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-16 text-slate-400">Aucun témoignage trouvé</div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center overflow-hidden">
                    {testimonial.image ? (
                      <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-6 h-6 text-slate-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{testimonial.name}</h4>
                    <p className="text-accent text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditor(testimonial)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete('testimonial', testimonial.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-3 line-clamp-3">"{testimonial.quote}"</p>
              {testimonial.video_url && (
                <span className="inline-flex items-center gap-1 text-xs text-accent">
                  <LinkIcon size={12} />
                  Vidéo disponible
                </span>
              )}
            </div>
          ))}
        </div>
        )
      )}

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">
                {editingItem ? 'Modifier' : 'Créer'} {
                  activeTab === 'pages' ? 'une page' :
                  activeTab === 'news' ? 'une actualité' :
                  activeTab === 'faq' ? 'une FAQ' :
                  activeTab === 'timeline' ? 'une phase' :
                  activeTab === 'partners' ? 'un partenaire' :
                  'un témoignage'
                }
              </h2>
              <button
                onClick={() => setShowEditor(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Title/Question/Name input */}
              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  {activeTab === 'faq' ? 'Question' :
                   activeTab === 'partners' ? 'Nom' :
                   activeTab === 'testimonials' ? 'Nom' :
                   'Titre'}
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
                  placeholder={activeTab === 'faq' ? 'Entrez la question...' :
                               activeTab === 'partners' ? 'Nom du partenaire...' :
                               activeTab === 'testimonials' ? 'Nom de la personne...' :
                               'Entrez le titre...'}
                />
              </div>

              {/* Excerpt (news only) */}
              {activeTab === 'news' && (
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Extrait</label>
                  <input
                    type="text"
                    value={formExcerpt}
                    onChange={(e) => setFormExcerpt(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
                    placeholder="Résumé court de l'actualité..."
                  />
                </div>
              )}

              {/* Image upload for News */}
              {activeTab === 'news' && (
                <ImageUpload
                  currentImage={currentImageUrl}
                  onImageSelect={(file) => setSelectedImage(file)}
                  onImageRemove={() => {
                    setSelectedImage(null);
                    setCurrentImageUrl(null);
                  }}
                  label="Image de l'actualité"
                  helpText="Recommandé : 1200x600 px, JPG ou PNG, max 5 MB"
                />
              )}

              {/* Testimonials role field */}
              {activeTab === 'testimonials' && (
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Rôle / Titre</label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
                    placeholder="Ex: Gagnante Edition 2022 - Data Scientist"
                  />
                </div>
              )}

              {/* Content editor */}
              {(activeTab === 'pages' || activeTab === 'news' || activeTab === 'faq' || activeTab === 'testimonials') && (
                <div>
                  <label className="block text-slate-300 font-medium mb-2">
                    {activeTab === 'faq' ? 'Réponse' :
                     activeTab === 'testimonials' ? 'Témoignage' :
                     'Contenu'}
                  </label>
                  {/* Simple toolbar */}
                  <div className="flex items-center gap-1 p-2 bg-slate-700 border border-slate-600 rounded-t-xl border-b-0">
                    <button className="p-2 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white">
                      <Bold size={16} />
                    </button>
                    <button className="p-2 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white">
                      <Italic size={16} />
                    </button>
                    <button className="p-2 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white">
                      <List size={16} />
                    </button>
                    <button className="p-2 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white">
                      <AlignLeft size={16} />
                    </button>
                    <button className="p-2 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white">
                      <LinkIcon size={16} />
                    </button>
                    <button className="p-2 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white">
                      <Image size={16} />
                    </button>
                  </div>
                  <textarea
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-b-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent resize-none"
                    rows={activeTab === 'testimonials' ? 6 : 10}
                    placeholder={activeTab === 'testimonials' ? 'Entrez le témoignage...' : 'Entrez le contenu...'}
                  />
                </div>
              )}

              {/* Image upload for Testimonials */}
              {activeTab === 'testimonials' && (
                <ImageUpload
                  currentImage={currentImageUrl}
                  onImageSelect={(file) => setSelectedImage(file)}
                  onImageRemove={() => {
                    setSelectedImage(null);
                    setCurrentImageUrl(null);
                  }}
                  label="Photo du témoin"
                  helpText="Format portrait recommandé, JPG ou PNG, max 2 MB"
                />
              )}

              {/* Testimonials video URL */}
              {activeTab === 'testimonials' && (
                <div>
                  <label className="block text-slate-300 font-medium mb-2">URL Vidéo (optionnel)</label>
                  <input
                    type="url"
                    value={formVideoUrl}
                    onChange={(e) => setFormVideoUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
                    placeholder="https://www.youtube.com/embed/..."
                  />
                  <p className="text-xs text-slate-500 mt-1">💡 Astuce : Utilisez le format embed de YouTube (pas le lien de visionnage)</p>
                </div>
              )}

              {/* FAQ category */}
              {activeTab === 'faq' && (
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Catégorie</label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
                    placeholder="Ex: Inscription, Épreuves..."
                  />
                </div>
              )}

              {/* Timeline fields */}
              {activeTab === 'timeline' && (
                <>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Numéro de phase *</label>
                    <input
                      type="number"
                      value={formPhaseNumber}
                      onChange={(e) => setFormPhaseNumber(parseInt(e.target.value) || 1)}
                      min={1}
                      max={6}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                      placeholder="1 à 6"
                    />
                    <p className="text-xs text-slate-500 mt-1">L'édition active sera automatiquement utilisée</p>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Description</label>
                    <textarea
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent resize-none"
                      rows={3}
                      placeholder="Description de la phase..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-medium mb-2">Date début *</label>
                      <input
                        type="date"
                        value={formStartDate}
                        onChange={(e) => setFormStartDate(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-2">Date fin *</label>
                      <input
                        type="date"
                        value={formEndDate}
                        onChange={(e) => setFormEndDate(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Partner fields */}
              {activeTab === 'partners' && (
                <>
                  <ImageUpload
                    currentImage={currentImageUrl}
                    onImageSelect={(file) => setSelectedImage(file)}
                    onImageRemove={() => {
                      setSelectedImage(null);
                      setCurrentImageUrl(null);
                    }}
                    label="Logo du partenaire"
                    helpText="PNG avec fond transparent recommandé (400x200 px), max 2 MB"
                  />

                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Site web</label>
                    <input
                      type="url"
                      value={formWebsite}
                      onChange={(e) => setFormWebsite(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-accent"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Niveau</label>
                    <select
                      value={formTier}
                      onChange={(e) => setFormTier(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                    >
                      <option value="gold">Or</option>
                      <option value="silver">Argent</option>
                      <option value="bronze">Bronze</option>
                    </select>
                  </div>
                </>
              )}

              {/* Status */}
              {(activeTab === 'pages' || activeTab === 'news') && (
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Statut</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'draft' | 'published')}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-accent"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                  </select>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => setShowEditor(false)}
                  className="flex-1 py-3 border border-slate-600 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContent;
