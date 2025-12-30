import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';

const GroupInfoModal = ({ open, groupId, onClose }) => {
  const { chats, users, addMemberToGroup, removeMemberFromGroup } = useChat();
  const group = (chats || []).find((c) => c.id === groupId);
  const [selected, setSelected] = useState(null);

  if (!open || !group) return null;

  const available = Object.values(users).filter((u) => !(group.members || []).includes(u.id));

  const handleAdd = () => {
    if (!selected) return;
    addMemberToGroup(groupId, selected);
    setSelected(null);
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
      <div className="modal-card" style={{ width: 480, background: 'white', borderRadius: 8, padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>{group.name} — Info</h3>

        <div>
          <strong>Members</strong>
          <div style={{ marginTop: 8 }}>
            {(group.members || []).map((m) => (
              <div key={m} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={users[m]?.avatar} alt={users[m]?.username} style={{ width: 28, height: 28, borderRadius: 14 }} />
                  <div>{users[m]?.username || m}</div>
                </div>
                <div>
                  <button onClick={() => removeMemberFromGroup(groupId, m)} style={{ background: 'transparent', border: 'none', color: '#c00' }}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Add member</strong>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <select value={selected || ''} onChange={(e) => setSelected(e.target.value)}>
              <option value="">Select user</option>
              {available.map((u) => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </select>
            <button onClick={handleAdd} className="btn-primary">Add</button>
          </div>
        </div>

        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => onClose?.()} className="btn-primary" style={{ background: '#eee', color: '#333' }}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default GroupInfoModal;
