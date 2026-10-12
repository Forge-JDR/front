import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../config/api';
import './workshop.css';

const endpoint = '/api/mvp';
const emptyRpg = () => ({ name: '', description: '', fields: [] });
const errorMessage = (error) => error.response?.data?.detail || error.response?.data?.message || error.message || 'Une erreur est survenue.';

export function SheetForm({ sheet, fields, onSave, busy }) {
  const [name, setName] = useState(sheet?.name || '');
  const [notes, setNotes] = useState(sheet?.notes || '');
  const [values, setValues] = useState(sheet?.values || {});
  return <form onSubmit={(event) => { event.preventDefault(); onSave({ name, notes, values }); }}>
    <label>Nom du personnage<input required maxLength={255} value={name} onChange={(event) => setName(event.target.value)} /></label>
    {fields.map((field) => <label key={field.key}>{field.label}
      <input type={field.type === 'boolean' ? 'checkbox' : field.type === 'number' ? 'number' : 'text'}
        step={field.type === 'number' ? 'any' : undefined}
        checked={field.type === 'boolean' ? Boolean(values[field.key]) : undefined}
        value={field.type === 'boolean' ? undefined : values[field.key] ?? ''}
        onChange={(event) => {
          const next = { ...values };
          if (field.type === 'number' && event.target.value === '') delete next[field.key];
          else next[field.key] = field.type === 'boolean' ? event.target.checked : field.type === 'number' ? Number(event.target.value) : event.target.value;
          setValues(next);
        }} />
    </label>)}
    <label>Notes du personnage<textarea value={notes} onChange={(event) => setNotes(event.target.value)} /></label>
    <button disabled={busy}>Enregistrer la fiche</button>
  </form>;
}

function TemplateFields({ fields, onChange }) {
  return <fieldset><legend>Modèle de fiche de personnage</legend>
    <p>Ajoutez les caractéristiques de votre système. Chaque nouvelle fiche reprend ce modèle.</p>
    {fields.map((field, index) => <div className="workshop-field" key={field.key}>
      <label>Libellé<input required maxLength={100} value={field.label} onChange={(event) => onChange(fields.map((item, i) => i === index ? { ...item, label: event.target.value } : item))} /></label>
      <label>Type<select value={field.type} onChange={(event) => onChange(fields.map((item, i) => i === index ? { ...item, type: event.target.value } : item))}>
        <option value="text">Texte</option><option value="number">Nombre</option><option value="boolean">Case à cocher</option>
      </select></label>
      <button type="button" className="secondary" aria-label={`Retirer le champ ${index + 1}`} onClick={() => onChange(fields.filter((_, i) => i !== index))}>Retirer</button>
    </div>)}
    <button type="button" className="secondary" disabled={fields.length >= 40} onClick={() => onChange([...fields, { key: `field_${Date.now()}_${fields.length}`, label: '', type: 'text' }])}>Ajouter un champ</button>
    <p className="muted">Les fiches existantes conservent leur modèle lorsque vous modifiez le JDR.</p>
  </fieldset>;
}

export default function Workshop() {
  const [rpgs, setRpgs] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const [campaignDetails, setCampaignDetails] = useState({ name: '', description: '', notes: '' });
  const [rpgDraft, setRpgDraft] = useState(emptyRpg);
  const [campaignDraft, setCampaignDraft] = useState({ name: '', description: '', rpgId: '' });
  const [session, setSession] = useState({ title: '', date: new Date().toISOString().slice(0, 10), notes: '' });
  const [sheetId, setSheetId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [newSheetKey, setNewSheetKey] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.all([api.get(`${endpoint}/rpgs`), api.get(`${endpoint}/campaigns`)])
      .then(([rpgResponse, campaignResponse]) => {
        if (active) { setRpgs(rpgResponse.data); setCampaigns(campaignResponse.data); }
      }).catch((err) => { if (active) setError(errorMessage(err)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const run = async (operation, success) => {
    setBusy(true); setError(''); setMessage('');
    try { await operation(); setMessage(success); }
    catch (err) { setError(errorMessage(err)); }
    finally { setBusy(false); }
  };
  const openCampaign = (id) => run(async () => {
    const { data } = await api.get(`${endpoint}/campaigns/${id}`);
    setCampaign(data); setCampaignDetails({ name: data.name, description: data.description, notes: data.notes }); setSheetId(null); setNewSheetKey((key) => key + 1);
  }, 'Partie ouverte.');
  const rememberCampaign = (data) => {
    if (campaign?.id !== data.id) setCampaignDetails({ name: data.name, description: data.description, notes: data.notes });
    setCampaign(data);
    setCampaigns((items) => [data, ...items.filter((item) => item.id !== data.id)]);
  };
  const saveRpg = (event) => {
    event.preventDefault();
    run(async () => {
      const body = { name: rpgDraft.name, description: rpgDraft.description, fields: rpgDraft.fields };
      if (rpgDraft.id) body.expectedTemplateVersion = rpgDraft.templateVersion;
      const { data } = await api[rpgDraft.id ? 'put' : 'post'](`${endpoint}/rpgs${rpgDraft.id ? '/' + rpgDraft.id : ''}`, body);
      setRpgs((items) => [data, ...items.filter((item) => item.id !== data.id)]);
      setRpgDraft(emptyRpg());
    }, 'JDR enregistré.');
  };
  const currentRpg = rpgs.find((rpg) => rpg.id === campaign?.rpgId);
  const editedSheet = campaign?.sheets.find((sheet) => sheet.id === sheetId);

  return <div className="workshop">
    <header className="workshop-header"><Link to="/" className="workshop-brand">FORGE JDR</Link><nav aria-label="Navigation principale"><Link to="/user">Mon compte</Link><Link to="/disconnect">Déconnexion</Link></nav></header>
    <main>
      <div className="workshop-intro"><span className="eyebrow">VOTRE ATELIER</span><h1>Donnez vie à vos aventures.</h1><p>Créez votre système, préparez vos personnages et gardez le fil de votre campagne.</p></div>
      {error && <p role="alert" className="workshop-error">{error}</p>}
      {message && <p role="status" className="workshop-success">{message}</p>}
      {loading ? <p role="status">Chargement de votre atelier…</p> : <>
        <div className="workshop-grid">
          <section className="workshop-panel"><h2>Mes JDR</h2>
            {rpgs.length === 0 && <p>Votre premier univers commence ici.</p>}
            <ul className="workshop-list">{rpgs.map((rpg) => <li key={rpg.id}><div><strong>{rpg.name}</strong><span className="muted">{rpg.fields.length} champs de personnage</span></div><button className="secondary" disabled={busy} onClick={() => setRpgDraft(rpg)}>Modifier</button></li>)}</ul>
            <details open={rpgDraft.id ? true : undefined}><summary>{rpgDraft.id ? 'Modifier le JDR' : 'Créer un JDR personnalisé'}</summary>
              <form onSubmit={saveRpg}>
                <label>Nom du JDR<input required maxLength={255} value={rpgDraft.name} onChange={(event) => setRpgDraft({ ...rpgDraft, name: event.target.value })} /></label>
                <label>Univers et règles<textarea value={rpgDraft.description} onChange={(event) => setRpgDraft({ ...rpgDraft, description: event.target.value })} /></label>
                <TemplateFields fields={rpgDraft.fields} onChange={(fields) => setRpgDraft({ ...rpgDraft, fields })} />
                <div className="workshop-actions"><button disabled={busy}>Enregistrer le JDR</button>{rpgDraft.id && <button className="secondary" type="button" onClick={() => setRpgDraft(emptyRpg())}>Annuler</button>}</div>
              </form>
            </details>
          </section>
          <section className="workshop-panel"><h2>Mes parties</h2>
            {campaigns.length === 0 && <p>Rassemblez vos personnages autour d'une nouvelle campagne.</p>}
            <ul className="workshop-list">{campaigns.map((item) => <li key={item.id}><div><strong>{item.name}</strong><span className="muted">{item.rpgName}</span></div><button disabled={busy} className="secondary" onClick={() => openCampaign(item.id)}>Ouvrir</button></li>)}</ul>
            {rpgs.length > 0 ? <details><summary>Créer une partie</summary><form onSubmit={(event) => {
              event.preventDefault(); run(async () => {
                const { data } = await api.post(`${endpoint}/campaigns`, { ...campaignDraft, rpgId: Number(campaignDraft.rpgId) });
                rememberCampaign(data); setSheetId(null); setNewSheetKey((key) => key + 1);
                setCampaignDraft({ name: '', description: '', rpgId: '' });
              }, 'Partie créée.');
            }}>
              <label>Nom de la partie<input required maxLength={255} value={campaignDraft.name} onChange={(event) => setCampaignDraft({ ...campaignDraft, name: event.target.value })} /></label>
              <label>JDR<select required value={campaignDraft.rpgId} onChange={(event) => setCampaignDraft({ ...campaignDraft, rpgId: event.target.value })}><option value="">Choisir un JDR</option>{rpgs.map((rpg) => <option key={rpg.id} value={rpg.id}>{rpg.name}</option>)}</select></label>
              <label>Présentation de la campagne<textarea value={campaignDraft.description} onChange={(event) => setCampaignDraft({ ...campaignDraft, description: event.target.value })} /></label>
              <button disabled={busy}>Créer la partie</button>
            </form></details> : <p className="muted">Créez un JDR pour démarrer une partie.</p>}
          </section>
        </div>
        {campaign && <section className="workshop-panel workshop-campaign" aria-label="Partie en cours">
          <span className="eyebrow">{campaign.rpgName}</span><h2>{campaign.name}</h2>
          <div className="workshop-grid">
            <div><h3>La campagne</h3><form onSubmit={(event) => { event.preventDefault(); run(async () => {
              const { data } = await api.put(`${endpoint}/campaigns/${campaign.id}`, campaignDetails);
              rememberCampaign(data);
            }, 'Campagne enregistrée.'); }}>
              <label>Titre<input required maxLength={255} value={campaignDetails.name} onChange={(event) => setCampaignDetails({ ...campaignDetails, name: event.target.value })} /></label>
              <label>Présentation<textarea value={campaignDetails.description} onChange={(event) => setCampaignDetails({ ...campaignDetails, description: event.target.value })} /></label>
              <label>Progression et notes<textarea value={campaignDetails.notes} onChange={(event) => setCampaignDetails({ ...campaignDetails, notes: event.target.value })} /></label>
              <button disabled={busy}>Enregistrer la campagne</button>
            </form>
              <h3>Journal des séances</h3>
              {campaign.journal.length === 0 && <p className="muted">Aucune séance enregistrée.</p>}
              {campaign.journal.map((item) => <article className="workshop-session" key={item.id}><time>{item.date}</time><h4>{item.title}</h4><p>{item.notes}</p></article>)}
              <details><summary>Ajouter une séance</summary><form onSubmit={(event) => { event.preventDefault(); run(async () => {
                const { data } = await api.post(`${endpoint}/campaigns/${campaign.id}/sessions`, session);
                rememberCampaign(data); setSession({ ...session, title: '', notes: '' });
              }, 'Séance ajoutée.'); }}>
                <label>Titre de la séance<input required maxLength={255} value={session.title} onChange={(event) => setSession({ ...session, title: event.target.value })} /></label>
                <label>Date<input required type="date" value={session.date} onChange={(event) => setSession({ ...session, date: event.target.value })} /></label>
                <label>Compte rendu<textarea value={session.notes} onChange={(event) => setSession({ ...session, notes: event.target.value })} /></label>
                <button disabled={busy}>Ajouter la séance</button>
              </form></details>
            </div>
            <div><h3>Personnages</h3>
              <ul className="workshop-list">{campaign.sheets.map((sheet) => <li key={sheet.id}><strong>{sheet.name}</strong><button className="secondary" disabled={busy} onClick={() => setSheetId(sheet.id)}>Éditer</button></li>)}</ul>
              <button className="secondary" disabled={busy} onClick={() => { setSheetId(null); setNewSheetKey((key) => key + 1); }}>Nouvelle fiche</button>
              <h4>{editedSheet ? `Modifier ${editedSheet.name}` : 'Créer un personnage'}</h4>
              <SheetForm key={editedSheet?.id || `new-${campaign.id}-${newSheetKey}`} sheet={editedSheet} fields={editedSheet?.fields || currentRpg?.fields || []} busy={busy} onSave={(body) => run(async () => {
                await api[editedSheet ? 'put' : 'post'](`${endpoint}${editedSheet ? '/sheets/' + editedSheet.id : '/campaigns/' + campaign.id + '/sheets'}`, body);
                const { data } = await api.get(`${endpoint}/campaigns/${campaign.id}`);
                rememberCampaign(data); setSheetId(null); setNewSheetKey((key) => key + 1);
              }, 'Fiche enregistrée.')} />
            </div>
          </div>
        </section>}
      </>}
    </main><footer>Forge JDR · Vos mondes, vos règles.</footer>
  </div>;
}
