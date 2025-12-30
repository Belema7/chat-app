import ChatHeader from '../components/Chat/ChatHeader';
import MessageList from '../components/Chat/MessageList';
import MessageInput from '../components/Chat/MessageInput';
import Sidebar from '../components/Common/Sidebar';

const OneToOneChat = () => {
    return (
        <div className="chat-layout">
            <Sidebar />
            <div className="chat-area">
                <ChatHeader />
                <MessageList />
                <MessageInput />
            </div>
        </div>
    );
};

export default OneToOneChat;
