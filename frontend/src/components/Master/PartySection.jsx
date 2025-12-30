import React, { useState, useEffect, useCallback, memo } from 'react';
import { masterAPI } from '../../services/api';
import PartyForm from './PartyForm';
import PartyList from './PartyList';

const PartySection = memo(() => {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingParty, setEditingParty] = useState(null);
  const [error, setError] = useState('');

  const fetchParties = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await masterAPI.party.getAll();
      setParties(response.data || []);
    } catch (err) {
      setError('Failed to load parties');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParties();
  }, [fetchParties]);

  const handleCreate = useCallback(() => {
    setEditingParty(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((party) => {
    setEditingParty(party);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      await masterAPI.party.delete(id);
      await fetchParties();
    } catch (err) {
      setError('Failed to delete party');
    }
  }, [fetchParties]);

  const handleSubmit = useCallback(async (data) => {
    try {
      if (editingParty?._id) {
        await masterAPI.party.update(editingParty._id, data);
      } else {
        await masterAPI.party.create(data);
      }
      setShowForm(false);
      setEditingParty(null);
      await fetchParties();
    } catch (err) {
      throw err;
    }
  }, [editingParty, fetchParties]);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingParty(null);
  }, []);

  if (showForm) {
    return (
      <div className="p-6">
        <h3 className="text-xl font-bold mb-6">
          {editingParty ? 'Edit Party' : 'Create Party'}
        </h3>
        <PartyForm
          party={editingParty}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Parties</h3>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Party
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <PartyList
          parties={parties}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
});

PartySection.displayName = 'PartySection';

export default PartySection;


