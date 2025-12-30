import React from 'react';
import { useNavigate } from 'react-router-dom';

const GroupChatItem = ({ group }) => {
  const navigate = useNavigate();

  const openGroup = () => {
    navigate(`/group?id=${group.id}`);
  };

  return (
    <div className="chat-item" onClick={openGroup} role="button" tabIndex={0} style={{ display: 'flex', alignItems: 'center' }}>
      <img src={group.avatar || 'https://placehold.co/56x56/888/fff?text=G'} alt={group.name} className="avatar" />
      <div className="chat-info">
        <h4 className="chat-name" style={{ margin: 0 }}>{group.name}</h4>
        <p className="last-message" style={{ margin: 0 }}>{group.lastMessage || ''}</p>
      </div>
      <div style={{ textAlign: 'right', marginLeft: 8 }}>
        <div style={{ fontSize: 12, color: '#888' }}>{group.lastAt ? new Date(group.lastAt).toLocaleTimeString() : ''}</div>
        {group.unread > 0 && <div style={{ background: '#007bff', color: 'white', padding: '2px 6px', borderRadius: 12, fontSize: 12, marginTop: 6 }}>{group.unread}</div>}
      </div>
    </div>
  );
};

export default GroupChatItem;
