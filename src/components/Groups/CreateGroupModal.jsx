import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';

const CreateGroupModal = ({ open, onClose }) => {
  const { users, createGroup } = useChat();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState('');
  const [selected, setSelected] = useState([]);

  if (!open) return null;

  const toggleSelect = (id) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const handleCreate = () => {
    if (!name.trim() || selected.length === 0) return;
    const group = createGroup({ name: name.trim(), description: description.trim(), avatar: avatar.trim(), members: selected });
    onClose(group);
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
      <div className="modal-card" style={{ width: 520, background: 'white', borderRadius: 8, padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>Create Group</h3>

        <div className="form-group">
          <label>Group Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Team Chat" />
        </div>

        <div className="form-group">
          <label>Description (optional)</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" />
        </div>

        <div className="form-group">
          <label>Avatar URL (optional)</label>
          <input value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." />
        </div>

        <div style={{ marginTop: 8 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>Add Members</label>
          <div style={{ maxHeight: 160, overflow: 'auto', border: '1px solid #eee', padding: 8, borderRadius: 6 }}>
            {Object.values(users).map((u) => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 6 }}>
                <input type="checkbox" checked={selected.includes(u.id)} onChange={() => toggleSelect(u.id)} />
                <img src={u.avatar} alt={u.username} style={{ width: 28, height: 28, borderRadius: 14 }} />
                <div>{u.username}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={() => onClose(null)} className="btn-primary" style={{ background: '#eee', color: '#333' }}>Cancel</button>
          <button onClick={handleCreate} className="btn-primary">Create</button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
