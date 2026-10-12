import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Workshop, { SheetForm } from './Workshop';
import api from '../../../config/api';

jest.mock('../../../config/api', () => ({ get: jest.fn(), post: jest.fn(), put: jest.fn() }));

beforeEach(() => jest.clearAllMocks());

test('sheet inputs submit numbers and booleans with their correct types', () => {
  const save = jest.fn();
  render(<SheetForm fields={[
    { key: 'health', label: 'PV', type: 'number' },
    { key: 'alive', label: 'Vivant', type: 'boolean' },
    { key: 'story', label: 'Histoire', type: 'text' },
  ]} onSave={save} busy={false} />);
  fireEvent.change(screen.getByLabelText('Nom du personnage'), { target: { value: 'Ari' } });
  fireEvent.change(screen.getByLabelText('PV'), { target: { value: '12' } });
  fireEvent.click(screen.getByLabelText('Vivant'));
  fireEvent.change(screen.getByLabelText('Histoire'), { target: { value: 'Voyageur' } });
  fireEvent.click(screen.getByText('Enregistrer la fiche'));
  expect(save).toHaveBeenCalledWith({ name: 'Ari', notes: '', values: { health: 12, alive: true, story: 'Voyageur' } });
});

test('an empty numeric field is omitted rather than converted to zero', () => {
  const save = jest.fn();
  render(<SheetForm sheet={{ name: 'Ari', values: { health: 12 } }} fields={[{ key: 'health', label: 'PV', type: 'number' }]} onSave={save} busy={false} />);
  fireEvent.change(screen.getByLabelText('PV'), { target: { value: '' } });
  fireEvent.click(screen.getByText('Enregistrer la fiche'));
  expect(save).toHaveBeenCalledWith({ name: 'Ari', notes: '', values: {} });
});

test('initial loading failures are visible to the user', async () => {
  api.get.mockRejectedValue(new Error('Serveur indisponible'));
  render(<MemoryRouter><Workshop /></MemoryRouter>);
  expect(await screen.findByRole('alert')).toHaveTextContent('Serveur indisponible');
});

test('failed JDR saves retain the draft and do not announce success', async () => {
  api.get.mockResolvedValue({ data: [] });
  api.post.mockRejectedValue({ response: { data: { detail: 'Modèle invalide' } } });
  render(<MemoryRouter><Workshop /></MemoryRouter>);
  await waitFor(() => expect(screen.queryByText('Chargement de votre atelier…')).not.toBeInTheDocument());
  fireEvent.click(screen.getByText('Créer un JDR personnalisé'));
  fireEvent.change(screen.getByLabelText('Nom du JDR'), { target: { value: 'Mon univers' } });
  fireEvent.click(screen.getByText('Enregistrer le JDR'));
  expect(await screen.findByRole('alert')).toHaveTextContent('Modèle invalide');
  expect(screen.getByLabelText('Nom du JDR')).toHaveValue('Mon univers');
  expect(screen.queryByText('JDR enregistré.')).not.toBeInTheDocument();
});

test('adding a session preserves unsaved campaign notes in the form', async () => {
  const campaign = { id: 2, rpgId: 1, rpgName: 'JDR', name: 'Partie', description: '', notes: '', journal: [], sheets: [] };
  api.get.mockImplementation((url) => Promise.resolve({ data: url.endsWith('/rpgs') ? [{ id: 1, name: 'JDR', fields: [] }] : url.endsWith('/campaigns') ? [campaign] : campaign }));
  api.post.mockResolvedValue({ data: { ...campaign, journal: [{ id: 's1', title: 'Départ', date: '2026-10-12', notes: '' }] } });
  render(<MemoryRouter><Workshop /></MemoryRouter>);
  fireEvent.click(await screen.findByRole('button', { name: 'Ouvrir' }));
  fireEvent.change(await screen.findByLabelText('Progression et notes'), { target: { value: 'Brouillon à conserver' } });
  fireEvent.click(screen.getByText('Ajouter une séance', { selector: 'summary' }));
  fireEvent.change(screen.getByLabelText('Titre de la séance'), { target: { value: 'Départ' } });
  fireEvent.click(screen.getByRole('button', { name: 'Ajouter la séance' }));
  expect(await screen.findByText('Séance ajoutée.')).toBeInTheDocument();
  expect(screen.getByLabelText('Progression et notes')).toHaveValue('Brouillon à conserver');
});
