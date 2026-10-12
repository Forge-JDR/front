import React, { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  Compass,
  FileText,
  LoaderCircle,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import api from "../../../config/api";
import {
  Button,
  EmptyState,
  Field,
  Landscape,
  Modal,
  Notice,
  PageHeader,
} from "../../design-system";
import "./workshop.css";

const endpoint = "/api/mvp";
const emptyRpg = () => ({ name: "", description: "", fields: [] });
const errorMessage = (error) =>
  error.response?.data?.detail ||
  error.response?.data?.message ||
  error.message ||
  "Une erreur est survenue.";
const localDate = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};
const formatDate = (date) =>
  new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date + "T12:00:00"));

export function SheetForm({ sheet, fields, onSave, busy }) {
  const [name, setName] = useState(sheet?.name || "");
  const [notes, setNotes] = useState(sheet?.notes || "");
  const [values, setValues] = useState(sheet?.values || {});
  const change = (field, event) => {
    const next = { ...values };
    if (field.type === "number" && event.target.value === "")
      delete next[field.key];
    else
      next[field.key] =
        field.type === "boolean"
          ? event.target.checked
          : field.type === "number"
            ? Number(event.target.value)
            : event.target.value;
    setValues(next);
  };
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSave({ name, notes, values });
      }}
    >
      <fieldset disabled={busy} className="plain-fieldset">
        <Field
          label="Nom du personnage"
          required
          maxLength={255}
          placeholder="Le nom de votre prochain héros"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        {fields.length > 0 && (
          <div className="sheet-attributes">
            <h3>Caractéristiques</h3>
            <div className="form-grid">
              {fields.map((field) =>
                field.type === "boolean" ? (
                  <label className="ui-checkbox" key={field.key}>
                    <input
                      type="checkbox"
                      checked={Boolean(values[field.key])}
                      onChange={(event) => change(field, event)}
                    />
                    {field.label}
                  </label>
                ) : (
                  <Field
                    key={field.key}
                    label={field.label}
                    type={field.type === "number" ? "number" : "text"}
                    step={field.type === "number" ? "any" : undefined}
                    value={values[field.key] ?? ""}
                    onChange={(event) => change(field, event)}
                  />
                ),
              )}
            </div>
          </div>
        )}
        <Field
          as="textarea"
          label="Notes du personnage"
          placeholder="Son histoire, ses motivations, ce qu’il garde secret…"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
        <div className="form-actions">
          <Button type="submit" busy={busy} icon={Check}>
            Enregistrer la fiche
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
function TemplateFields({ fields, onChange }) {
  return (
    <fieldset className="template-builder">
      <legend>Modèle de fiche de personnage</legend>
      <p>
        Les caractéristiques que vous retrouverez sur les nouvelles fiches de ce
        JDR.
      </p>
      {fields.length === 0 && (
        <div className="template-empty">
          <FileText size={24} />
          <span>Commencez avec un champ, ou inspirez-vous d’un modèle.</span>
          <Button
            variant="secondary"
            onClick={() =>
              onChange([
                { key: "health", label: "Points de vie", type: "number" },
                { key: "origin", label: "Origine", type: "text" },
                { key: "inspired", label: "Inspiré", type: "boolean" },
              ])
            }
          >
            Utiliser un modèle de départ
          </Button>
        </div>
      )}
      {fields.map((field, index) => (
        <div className="template-row" key={field.key}>
          <FileText size={15} className="muted" aria-hidden="true" />
          <Field
            label={`Nom du champ ${index + 1}`}
            required
            maxLength={100}
            value={field.label}
            placeholder="Ex. Points de vie"
            onChange={(event) =>
              onChange(
                fields.map((item, i) =>
                  i === index ? { ...item, label: event.target.value } : item,
                ),
              )
            }
          />
          <Field
            as="select"
            label={`Type du champ ${index + 1}`}
            value={field.type}
            onChange={(event) =>
              onChange(
                fields.map((item, i) =>
                  i === index ? { ...item, type: event.target.value } : item,
                ),
              )
            }
          >
            <option value="text">Texte</option>
            <option value="number">Nombre</option>
            <option value="boolean">Case à cocher</option>
          </Field>
          <Button
            variant="ghost"
            icon={Trash2}
            aria-label={`Retirer le champ ${index + 1}`}
            onClick={() => onChange(fields.filter((_, i) => i !== index))}
          />
        </div>
      ))}
      <Button
        variant="secondary"
        icon={Plus}
        disabled={fields.length >= 40}
        onClick={() =>
          onChange([
            ...fields,
            {
              key: `field_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
              label: "",
              type: "text",
            },
          ])
        }
      >
        Ajouter un champ
      </Button>
      <p className="template-hint">
        Les fiches existantes gardent leurs caractéristiques lorsque vous
        modifiez ce modèle.
      </p>
    </fieldset>
  );
}
export default function Workshop() {
  const location = useLocation();
  const [params] = useSearchParams();
  const view = ["rpgs", "campaigns", "characters"].includes(params.get("view"))
    ? params.get("view")
    : "overview";
  const [modal, setModal] = useState(null);
  const [tab, setTab] = useState("campaign");
  const [search, setSearch] = useState("");
  const [characterCampaigns, setCharacterCampaigns] = useState(null);
  const [rpgs, setRpgs] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const [campaignDetails, setCampaignDetails] = useState({
    name: "",
    description: "",
    notes: "",
  });
  const [rpgDraft, setRpgDraft] = useState(emptyRpg);
  const [campaignDraft, setCampaignDraft] = useState({
    name: "",
    description: "",
    rpgId: "",
  });
  const [session, setSession] = useState({
    title: "",
    date: localDate(),
    notes: "",
  });
  const [sheetId, setSheetId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [newSheetKey, setNewSheetKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadFailed(false);
    setError("");
    Promise.all([api.get(`${endpoint}/rpgs`), api.get(`${endpoint}/campaigns`)])
      .then(([rpgResponse, campaignResponse]) => {
        if (active) {
          setRpgs(rpgResponse.data);
          setCampaigns(campaignResponse.data);
        }
      })
      .catch((err) => {
        if (active) {
          setError(errorMessage(err));
          setLoadFailed(true);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [loadAttempt]);

  const run = async (operation, success) => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await operation();
      setMessage(success);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  const openCampaign = (id) =>
    run(async () => {
      const { data } = await api.get(`${endpoint}/campaigns/${id}`);
      setCampaign(data);
      setCampaignDetails({
        name: data.name,
        description: data.description,
        notes: data.notes,
      });
      setSheetId(null);
      setNewSheetKey((key) => key + 1);
      setTab("campaign");
    }, "");
  const rememberCampaign = (data) => {
    if (campaign?.id !== data.id)
      setCampaignDetails({
        name: data.name,
        description: data.description,
        notes: data.notes,
      });
    setCampaign(data);
    setCampaigns((items) => [
      data,
      ...items.filter((item) => item.id !== data.id),
    ]);
  };
  const saveRpg = (event) => {
    event.preventDefault();
    run(async () => {
      const body = {
        name: rpgDraft.name,
        description: rpgDraft.description,
        fields: rpgDraft.fields,
      };
      if (rpgDraft.id) body.expectedTemplateVersion = rpgDraft.templateVersion;
      const { data } = await api[rpgDraft.id ? "put" : "post"](
        `${endpoint}/rpgs${rpgDraft.id ? "/" + rpgDraft.id : ""}`,
        body,
      );
      setRpgs((items) => [
        data,
        ...items.filter((item) => item.id !== data.id),
      ]);
      setRpgDraft(emptyRpg());
      setModal(null);
    }, "JDR enregistré.");
  };
  const currentRpg = rpgs.find((rpg) => rpg.id === campaign?.rpgId);
  const editedSheet = campaign?.sheets.find((sheet) => sheet.id === sheetId);

  useEffect(() => {
    setCampaign(null);
    setSearch("");
  }, [view, location.key]);
  useEffect(() => {
    if (view !== "characters") return;
    let active = true;
    setCharacterCampaigns(null);
    Promise.all(
      campaigns.map((item) => api.get(`${endpoint}/campaigns/${item.id}`)),
    )
      .then((responses) => {
        if (active)
          setCharacterCampaigns(responses.map((response) => response.data));
      })
      .catch((err) => {
        if (active) setError(errorMessage(err));
      });
    return () => {
      active = false;
    };
  }, [view, campaigns]);
  const createRpg = () => {
    setError("");
    setRpgDraft(emptyRpg());
    setModal("rpg");
  };
  const createCampaign = () => {
    setError("");
    setCampaignDraft({ name: "", description: "", rpgId: rpgs[0]?.id || "" });
    setModal("party");
  };
  const createSheet = () => {
    setError("");
    setSheetId(null);
    setNewSheetKey((key) => key + 1);
    setModal("sheet");
  };
  const filteredRpgs = rpgs.filter((item) =>
    item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  );
  const filteredCampaigns = campaigns.filter((item) =>
    `${item.name} ${item.rpgName}`
      .toLocaleLowerCase()
      .includes(search.toLocaleLowerCase()),
  );
  const title =
    {
      overview: "Votre atelier",
      rpgs: "Mes JDR",
      campaigns: "Mes parties",
      characters: "Mes personnages",
    }[view] || "Votre atelier";
  const description = {
    overview: "Une place pour chaque idée. Un monde pour chaque aventure.",
    rpgs: "Vos univers et les règles qui leur donnent vie.",
    campaigns: "Toutes vos aventures, prêtes pour la prochaine séance.",
    characters: "Les héros qui font vivre vos campagnes.",
  }[view];
  const renderCampaignCard = (item) => (
    <article className="party-card" key={item.id}>
      <span className="party-emblem">
        <Compass size={24} strokeWidth={1.5} />
      </span>
      <div>
        <span className="card-kicker">{item.rpgName}</span>
        <h3>{item.name}</h3>
        <p>{item.description || "Une nouvelle histoire à écrire."}</p>
        <span className="party-meta">
          <CalendarDays size={13} />
          {item.journal.length} séance{item.journal.length > 1 ? "s" : ""}{" "}
          consignée{item.journal.length > 1 ? "s" : ""}
        </span>
      </div>
      <Button
        variant="ghost"
        icon={ArrowUpRight}
        disabled={busy}
        aria-label={`Ouvrir ${item.name}`}
        onClick={() => openCampaign(item.id)}
      />
    </article>
  );
  return (
    <div className="workshop">
      {!campaign && (
        <PageHeader
          eyebrow="L'ATELIER DES AVENTURES"
          title={title}
          description={description}
          action={
            <Button
              icon={Plus}
              disabled={busy || loading || loadFailed}
              onClick={
                view === "campaigns" && rpgs.length ? createCampaign : createRpg
              }
            >
              {view === "campaigns" && rpgs.length
                ? "Créer une partie"
                : "Créer un JDR"}
            </Button>
          }
        />
      )}
      {!modal && (
        <>
          <Notice>{error}</Notice>
          <Notice variant="success">{message}</Notice>
        </>
      )}
      {loading ? (
        <div className="loading-state" role="status">
          <LoaderCircle size={25} className="spin" />
          <p>Chargement de votre atelier…</p>
        </div>
      ) : loadFailed ? (
        <div className="ui-card">
          <EmptyState
            icon={Compass}
            title="Votre atelier n’est pas disponible pour le moment."
            action={
              <Button onClick={() => setLoadAttempt((attempt) => attempt + 1)}>
                Réessayer
              </Button>
            }
          >
            Vos créations n’ont pas pu être chargées. Réessayez dans un instant.
          </EmptyState>
        </div>
      ) : campaign ? (
        <>
          <button className="back-link" onClick={() => setCampaign(null)}>
            <ArrowLeft size={14} />
            Retour à mes parties
          </button>
          <PageHeader
            eyebrow={campaign.rpgName}
            title={campaign.name}
            description="L’histoire s’écrit une séance à la fois."
            action={
              <Button icon={Plus} onClick={createSheet} disabled={busy}>
                Ajouter un personnage
              </Button>
            }
          />
          <div
            className="campaign-tabs"
            role="tablist"
            aria-label="Contenu de la partie"
          >
            {[
              { key: "campaign", label: "La campagne", icon: Compass },
              {
                key: "characters",
                label: `Personnages (${campaign.sheets.length})`,
                icon: Users,
              },
              {
                key: "journal",
                label: `Journal (${campaign.journal.length})`,
                icon: CalendarDays,
              },
            ].map(({ key, label, icon: Icon }) => (
              <button
                role="tab"
                key={key}
                id={`tab-${key}`}
                aria-controls={`panel-${key}`}
                aria-selected={tab === key}
                tabIndex={tab === key ? 0 : -1}
                onKeyDown={(event) => {
                  const keys = ["campaign", "characters", "journal"];
                  const index = keys.indexOf(key);
                  const next =
                    event.key === "ArrowRight"
                      ? keys[(index + 1) % 3]
                      : event.key === "ArrowLeft"
                        ? keys[(index + 2) % 3]
                        : event.key === "Home"
                          ? keys[0]
                          : event.key === "End"
                            ? keys[2]
                            : null;
                  if (next) {
                    event.preventDefault();
                    setTab(next);
                    document.getElementById(`tab-${next}`)?.focus();
                  }
                }}
                className={tab === key ? "is-active" : ""}
                onClick={() => setTab(key)}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
          <section
            role="tabpanel"
            id={`panel-${tab}`}
            aria-labelledby={`tab-${tab}`}
            className="campaign-panel"
          >
            {tab === "campaign" && (
              <div className="campaign-grid">
                <section className="ui-card campaign-notes">
                  <div className="section-heading">
                    <h2>Le carnet de campagne</h2>
                    <FileText size={18} className="muted" />
                  </div>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      run(async () => {
                        const { data } = await api.put(
                          `${endpoint}/campaigns/${campaign.id}`,
                          campaignDetails,
                        );
                        rememberCampaign(data);
                      }, "Campagne enregistrée.");
                    }}
                  >
                    <fieldset disabled={busy} className="plain-fieldset">
                      <Field
                        label="Titre"
                        required
                        maxLength={255}
                        value={campaignDetails.name}
                        onChange={(event) =>
                          setCampaignDetails({
                            ...campaignDetails,
                            name: event.target.value,
                          })
                        }
                      />
                      <Field
                        label="Présentation"
                        as="textarea"
                        value={campaignDetails.description}
                        placeholder="Le cadre de votre histoire, ses enjeux et ses mystères…"
                        onChange={(event) =>
                          setCampaignDetails({
                            ...campaignDetails,
                            description: event.target.value,
                          })
                        }
                      />
                      <Field
                        label="Progression et notes"
                        as="textarea"
                        className="campaign-progress"
                        placeholder="Où en sont les héros ? Que reste-t-il à découvrir ?"
                        value={campaignDetails.notes}
                        onChange={(event) =>
                          setCampaignDetails({
                            ...campaignDetails,
                            notes: event.target.value,
                          })
                        }
                      />
                      <div className="form-actions">
                        <Button type="submit" busy={busy} icon={Check}>
                          Enregistrer la campagne
                        </Button>
                      </div>
                    </fieldset>
                  </form>
                </section>
                <aside className="campaign-side">
                  <section className="ui-card">
                    <div className="section-heading">
                      <h3>Les aventuriers</h3>
                      <Users size={17} />
                    </div>
                    {campaign.sheets.length === 0 ? (
                      <p className="muted small">
                        Votre groupe n’attend que ses premiers héros.
                      </p>
                    ) : (
                      campaign.sheets.map((sheet) => (
                        <button
                          className="character-row"
                          key={sheet.id}
                          onClick={() => {
                            setSheetId(sheet.id);
                            setError("");
                            setModal("sheet");
                          }}
                        >
                          <span className="avatar">
                            {sheet.name.slice(0, 1).toUpperCase()}
                          </span>
                          <strong>{sheet.name}</strong>
                          <ArrowUpRight size={14} />
                        </button>
                      ))
                    )}
                    <Button
                      variant="secondary"
                      icon={Plus}
                      onClick={createSheet}
                      disabled={busy}
                    >
                      Nouvelle fiche
                    </Button>
                  </section>
                  <section className="campaign-journal-prompt">
                    <CalendarDays size={22} />
                    <h3>Gardez une trace de l’aventure.</h3>
                    <p>
                      Un compte rendu, quelques souvenirs, la suite de votre
                      histoire.
                    </p>
                    <Button
                      variant="secondary"
                      icon={Plus}
                      onClick={() => {
                        setError("");
                        setModal("session");
                      }}
                    >
                      Ajouter une séance
                    </Button>
                  </section>
                </aside>
              </div>
            )}
            {tab === "characters" && (
              <>
                <div className="section-heading">
                  <h2>Le groupe d’aventuriers</h2>
                  <Button icon={Plus} onClick={createSheet} disabled={busy}>
                    Nouvelle fiche
                  </Button>
                </div>
                {campaign.sheets.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    title="Les héros entrent bientôt en scène."
                    action={
                      <Button onClick={createSheet} icon={Plus}>
                        Créer un personnage
                      </Button>
                    }
                  >
                    Créez une première fiche à partir du modèle de votre JDR.
                  </EmptyState>
                ) : (
                  <div className="character-grid">
                    {campaign.sheets.map((sheet) => (
                      <article
                        className="ui-card character-card"
                        key={sheet.id}
                      >
                        <span className="avatar">
                          {sheet.name.slice(0, 1).toUpperCase()}
                        </span>
                        <h3>{sheet.name}</h3>
                        <p>{sheet.notes || "Une histoire encore à écrire."}</p>
                        <span className="character-meta">
                          {sheet.fields.length} caractéristiques
                        </span>
                        <Button
                          variant="secondary"
                          icon={ArrowUpRight}
                          onClick={() => {
                            setSheetId(sheet.id);
                            setError("");
                            setModal("sheet");
                          }}
                        >
                          Éditer
                        </Button>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
            {tab === "journal" && (
              <>
                <div className="section-heading">
                  <h2>Le journal de l’aventure</h2>
                  <Button
                    icon={Plus}
                    onClick={() => {
                      setError("");
                      setModal("session");
                    }}
                  >
                    Ajouter une séance
                  </Button>
                </div>
                {campaign.journal.length === 0 ? (
                  <EmptyState
                    icon={CalendarDays}
                    title="La première page attend votre histoire."
                  >
                    Ajoutez votre première séance pour garder le fil de la
                    campagne.
                  </EmptyState>
                ) : (
                  <div className="journal-list">
                    {[...campaign.journal].reverse().map((item, index) => (
                      <article className="ui-card journal-entry" key={item.id}>
                        <span className="journal-number">
                          {String(campaign.journal.length - index).padStart(
                            2,
                            "0",
                          )}
                        </span>
                        <div>
                          <time dateTime={item.date}>
                            {formatDate(item.date)}
                          </time>
                          <h3>{item.title}</h3>
                          <p>
                            {item.notes || "Aucune note pour cette séance."}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </>
      ) : (
        <>
          {view === "overview" && (
            <>
              <section className="atelier-banner">
                <div>
                  <span className="eyebrow">VOS MONDES PRENNENT VIE ICI</span>
                  <h2>
                    La prochaine aventure
                    <br />
                    commence avec vous.
                  </h2>
                  <p>
                    Un nouvel univers, un personnage inattendu,
                    <br />
                    une histoire qui ne demande qu’à être écrite.
                  </p>
                  <Button variant="copper" icon={Plus} onClick={createRpg}>
                    {rpgs.length
                      ? "Imaginer un nouveau JDR"
                      : "Créer mon premier JDR"}
                  </Button>
                </div>
                <div className="banner-art" aria-hidden="true">
                  <Compass size={200} strokeWidth={0.5} />
                  <span className="art-ring" />
                  <span className="art-star">✦</span>
                  <span className="art-caption">SUIVEZ VOTRE IMAGINATION</span>
                </div>
              </section>
              <div className="atelier-stats">
                {[
                  {
                    icon: BookOpen,
                    value: rpgs.length,
                    label: "Univers créés",
                    note: "Vos systèmes, vos règles",
                  },
                  {
                    icon: Compass,
                    value: campaigns.length,
                    label: "Parties préparées",
                    note: "Des histoires à poursuivre",
                  },
                  {
                    icon: CalendarDays,
                    value: campaigns.reduce(
                      (sum, item) => sum + item.journal.length,
                      0,
                    ),
                    label: "Séances consignées",
                    note: "Le fil de vos aventures",
                  },
                ].map(({ icon: Icon, value, label, note }) => (
                  <div className="ui-card stat-card" key={label}>
                    <span className="stat-icon">
                      <Icon size={21} strokeWidth={1.5} />
                    </span>
                    <div>
                      <strong>
                        {value}
                        <span>{label}</span>
                      </strong>
                      <p>{note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="workshop-toolbar">
            <span className="eyebrow">
              {view === "overview" ? "VOS CRÉATIONS" : "VOTRE COLLECTION"}
            </span>
            <div className="workshop-search">
              <Search size={15} />
              <input
                aria-label="Rechercher dans mon atelier"
                placeholder="Rechercher dans mon atelier…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
          {(view === "overview" || view === "rpgs") && (
            <section className="worlds-section">
              <div className="section-heading">
                <h2>
                  Mes JDR <span className="count-badge">{rpgs.length}</span>
                </h2>
                {view === "overview" && (
                  <Link className="section-link" to="/atelier?view=rpgs">
                    Tout voir
                    <ArrowRight size={13} />
                  </Link>
                )}
              </div>
              {rpgs.length === 0 ? (
                <div className="ui-card">
                  <EmptyState
                    icon={BookOpen}
                    title="Le premier chapitre commence ici."
                    action={
                      <Button
                        variant="secondary"
                        icon={Plus}
                        onClick={createRpg}
                      >
                        Créer un JDR personnalisé
                      </Button>
                    }
                  >
                    Imaginez votre univers, définissez ses règles et donnez-lui
                    un modèle de personnage.
                  </EmptyState>
                </div>
              ) : filteredRpgs.length === 0 ? (
                <p className="search-empty">
                  Aucun JDR ne correspond à votre recherche.
                </p>
              ) : (
                <div className="world-grid">
                  {filteredRpgs.map((rpg) => (
                    <article className="ui-card world-card" key={rpg.id}>
                      <Landscape seed={rpg.id} />
                      <div className="world-card-body">
                        <span className="card-kicker">VOTRE UNIVERS</span>
                        <h3>{rpg.name}</h3>
                        <p>
                          {rpg.description ||
                            "Un monde à façonner, une histoire à inventer."}
                        </p>
                        <div className="world-card-footer">
                          <span>
                            <FileText size={12} />
                            {rpg.fields.length} champs de fiche
                          </span>
                          <Button
                            variant="ghost"
                            icon={ArrowUpRight}
                            aria-label={`Modifier ${rpg.name}`}
                            onClick={() => {
                              setError("");
                              setRpgDraft(rpg);
                              setModal("rpg");
                            }}
                          >
                            Modifier
                          </Button>
                        </div>
                      </div>
                    </article>
                  ))}
                  <button className="new-world-card" onClick={createRpg}>
                    <span>
                      <Plus size={23} />
                    </span>
                    <strong>Un nouvel univers ?</strong>
                    <small>Laissez place à vos idées.</small>
                  </button>
                </div>
              )}
            </section>
          )}
          {(view === "overview" || view === "campaigns") && (
            <section className="parties-section">
              <div className="section-heading">
                <h2>
                  Mes parties{" "}
                  <span className="count-badge">{campaigns.length}</span>
                </h2>
                {rpgs.length > 0 && (
                  <Button
                    variant="secondary"
                    icon={Plus}
                    onClick={createCampaign}
                  >
                    Créer une partie
                  </Button>
                )}
              </div>
              {campaigns.length === 0 ? (
                <div className="ui-card">
                  <EmptyState
                    icon={Compass}
                    title="Une table prête pour l’aventure."
                  >
                    {rpgs.length
                      ? "Créez votre première partie et rassemblez vos personnages."
                      : "Commencez par créer un JDR, puis lancez votre première partie."}
                  </EmptyState>
                </div>
              ) : filteredCampaigns.length === 0 ? (
                <p className="search-empty">
                  Aucune partie ne correspond à votre recherche.
                </p>
              ) : (
                <div className="party-list">
                  {filteredCampaigns.map(renderCampaignCard)}
                </div>
              )}
            </section>
          )}
          {view === "characters" && (
            <section>
              {characterCampaigns === null ? (
                <div className="loading-state" role="status">
                  Chargement des personnages…
                </div>
              ) : characterCampaigns.every(
                  (item) => item.sheets.length === 0,
                ) ? (
                <div className="ui-card">
                  <EmptyState
                    icon={Users}
                    title="Vos héros n’attendent que vous."
                    action={
                      <Link
                        to="/atelier?view=campaigns"
                        className="ui-button ui-button--primary"
                      >
                        Voir mes parties
                        <ArrowRight size={15} />
                      </Link>
                    }
                  >
                    Ouvrez une partie pour créer vos premières fiches de
                    personnage.
                  </EmptyState>
                </div>
              ) : (
                <div className="character-grid">
                  {characterCampaigns.flatMap((party) =>
                    party.sheets
                      .filter((sheet) =>
                        sheet.name
                          .toLocaleLowerCase()
                          .includes(search.toLocaleLowerCase()),
                      )
                      .map((sheet) => (
                        <article
                          className="ui-card character-card"
                          key={sheet.id}
                        >
                          <span className="avatar">
                            {sheet.name.slice(0, 1).toUpperCase()}
                          </span>
                          <span className="card-kicker">{party.name}</span>
                          <h3>{sheet.name}</h3>
                          <p>
                            {sheet.notes || "Une histoire encore à écrire."}
                          </p>
                          <Button
                            variant="secondary"
                            icon={ArrowUpRight}
                            onClick={() => openCampaign(party.id)}
                          >
                            Ouvrir la partie
                          </Button>
                        </article>
                      )),
                  )}
                </div>
              )}
            </section>
          )}
          {view === "overview" && (
            <div className="atelier-tip">
              <span>
                <Sparkles size={18} />
              </span>
              <div>
                <strong>Un atelier qui s’adapte à votre imagination.</strong>
                <p>
                  Les modèles de fiche se construisent avec vous. Un champ de
                  texte, une valeur, une case à cocher : commencez simplement.
                </p>
              </div>
            </div>
          )}
        </>
      )}
      {modal === "rpg" && (
        <Modal
          title={
            rpgDraft.id ? "Modifier votre JDR" : "Créer un JDR personnalisé"
          }
          description="Un nom, un univers et les règles de vos prochaines aventures."
          onClose={() => setModal(null)}
          busy={busy}
          wide
        >
          <Notice>{error}</Notice>
          <form onSubmit={saveRpg}>
            <fieldset disabled={busy} className="plain-fieldset">
              <Field
                label="Nom du JDR"
                required
                maxLength={255}
                placeholder="Ex. Les terres d’Astrée"
                value={rpgDraft.name}
                onChange={(event) =>
                  setRpgDraft({ ...rpgDraft, name: event.target.value })
                }
              />
              <Field
                label="Univers et règles"
                as="textarea"
                placeholder="Dans quel monde se déroule l’aventure ? Quelles sont ses règles ?"
                value={rpgDraft.description}
                onChange={(event) =>
                  setRpgDraft({ ...rpgDraft, description: event.target.value })
                }
              />
              <TemplateFields
                fields={rpgDraft.fields}
                onChange={(fields) => setRpgDraft({ ...rpgDraft, fields })}
              />
              <div className="form-actions">
                <Button variant="secondary" onClick={() => setModal(null)}>
                  Annuler
                </Button>
                <Button type="submit" icon={Check} busy={busy}>
                  Enregistrer le JDR
                </Button>
              </div>
            </fieldset>
          </form>
        </Modal>
      )}
      {modal === "party" && (
        <Modal
          title="Créer une partie"
          description="Choisissez un univers et donnez un cadre à votre campagne."
          onClose={() => setModal(null)}
          busy={busy}
        >
          <Notice>{error}</Notice>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              run(async () => {
                const { data } = await api.post(`${endpoint}/campaigns`, {
                  ...campaignDraft,
                  rpgId: Number(campaignDraft.rpgId),
                });
                rememberCampaign(data);
                setSheetId(null);
                setTab("campaign");
                setNewSheetKey((key) => key + 1);
                setCampaignDraft({ name: "", description: "", rpgId: "" });
                setModal(null);
              }, "Partie créée.");
            }}
          >
            <fieldset disabled={busy} className="plain-fieldset">
              <Field
                label="Nom de la partie"
                required
                maxLength={255}
                placeholder="Ex. Les gardiens de la brume"
                value={campaignDraft.name}
                onChange={(event) =>
                  setCampaignDraft({
                    ...campaignDraft,
                    name: event.target.value,
                  })
                }
              />
              <Field
                label="JDR"
                as="select"
                required
                value={campaignDraft.rpgId}
                onChange={(event) =>
                  setCampaignDraft({
                    ...campaignDraft,
                    rpgId: event.target.value,
                  })
                }
              >
                <option value="">Choisir un JDR</option>
                {rpgs.map((rpg) => (
                  <option key={rpg.id} value={rpg.id}>
                    {rpg.name}
                  </option>
                ))}
              </Field>
              <Field
                label="Présentation de la campagne"
                as="textarea"
                value={campaignDraft.description}
                placeholder="Les enjeux, les lieux, ce qui attend vos aventuriers…"
                onChange={(event) =>
                  setCampaignDraft({
                    ...campaignDraft,
                    description: event.target.value,
                  })
                }
              />
              <div className="form-actions">
                <Button variant="secondary" onClick={() => setModal(null)}>
                  Annuler
                </Button>
                <Button type="submit" icon={Plus} busy={busy}>
                  Créer la partie
                </Button>
              </div>
            </fieldset>
          </form>
        </Modal>
      )}
      {modal === "sheet" && campaign && (
        <Modal
          title={
            editedSheet ? `Modifier ${editedSheet.name}` : "Créer un personnage"
          }
          description={`Une nouvelle page de ${campaign.name}.`}
          onClose={() => setModal(null)}
          busy={busy}
        >
          <Notice>{error}</Notice>
          <SheetForm
            key={editedSheet?.id || `new-${campaign.id}-${newSheetKey}`}
            sheet={editedSheet}
            fields={editedSheet?.fields || currentRpg?.fields || []}
            busy={busy}
            onSave={(body) =>
              run(async () => {
                await api[editedSheet ? "put" : "post"](
                  `${endpoint}${editedSheet ? "/sheets/" + editedSheet.id : "/campaigns/" + campaign.id + "/sheets"}`,
                  body,
                );
                const { data } = await api.get(
                  `${endpoint}/campaigns/${campaign.id}`,
                );
                rememberCampaign(data);
                setSheetId(null);
                setNewSheetKey((key) => key + 1);
                setModal(null);
              }, "Fiche enregistrée.")
            }
          />
        </Modal>
      )}
      {modal === "session" && campaign && (
        <Modal
          title="Ajouter une séance"
          description="Les événements de la séance, avant qu’ils ne deviennent des légendes."
          onClose={() => setModal(null)}
          busy={busy}
        >
          <Notice>{error}</Notice>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              run(async () => {
                const { data } = await api.post(
                  `${endpoint}/campaigns/${campaign.id}/sessions`,
                  session,
                );
                rememberCampaign(data);
                setSession({ title: "", date: localDate(), notes: "" });
                setModal(null);
              }, "Séance ajoutée.");
            }}
          >
            <fieldset disabled={busy} className="plain-fieldset">
              <Field
                label="Titre de la séance"
                required
                maxLength={255}
                placeholder="Ex. La traversée des brumes"
                value={session.title}
                onChange={(event) =>
                  setSession({ ...session, title: event.target.value })
                }
              />
              <Field
                label="Date"
                required
                type="date"
                value={session.date}
                onChange={(event) =>
                  setSession({ ...session, date: event.target.value })
                }
              />
              <Field
                label="Compte rendu"
                as="textarea"
                value={session.notes}
                placeholder="Les découvertes, les rencontres et les décisions qui comptent…"
                onChange={(event) =>
                  setSession({ ...session, notes: event.target.value })
                }
              />
              <div className="form-actions">
                <Button variant="secondary" onClick={() => setModal(null)}>
                  Annuler
                </Button>
                <Button type="submit" busy={busy} icon={Check}>
                  Ajouter la séance
                </Button>
              </div>
            </fieldset>
          </form>
        </Modal>
      )}
    </div>
  );
}
