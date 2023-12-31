'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FullMessageType } from '@/app/types';
import useConversation from '@/app/hooks/use-conversation.hook';
import MessageBox
    from '@/app/conversations/[conversationId]/components/message-box';
import axios from 'axios';


interface BodyProps {
    initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({
    initialMessages,
}) => {
    const [ messages, setMessages ] = useState(initialMessages);
    const bottomRef                 = useRef<HTMLDivElement>(null);
    const { conversationId }        = useConversation();

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`);
    }, [conversationId]);

    return (
        <div className={ 'flex-1 overflow-y-auto' }>
            { messages.map((message, index) =>
                <MessageBox
                    key={ message.id }
                    isLast={ index === (messages.length - 1) }
                    data={ message }
                />,
            ) }
            <div ref={ bottomRef } className={ 'pt-24' }/>
        </div>
    );
};

export default Body;