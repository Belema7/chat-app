import React, { useState } from 'react';

const MessageInput = ({ placeholder = 'Type a message...', onSend }) => {
    const [value, setValue] = useState('');

    const submit = (e) => {
        e?.preventDefault();
        if (!value.trim()) return;
        onSend?.(value.trim());
        setValue('');
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            submit(e);
        }
    };

    return (
        <form className="message-input" onSubmit={submit} style={{ display: 'flex', gap: 8 }}>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                style={{ flex: 1, padding: '8px 12px' }}
            />
            <button type="submit" className="btn-send">Send</button>
        </form>
    );
};

export default MessageInput;
