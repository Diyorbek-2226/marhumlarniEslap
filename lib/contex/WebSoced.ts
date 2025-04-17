// context/WebSocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createStompClient } from '../utils/stompClient';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ token, children }) => {
  const [stompClient, setStompClient] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    if (!token) return;

    const client = createStompClient(token);
    client.onConnect = () => {
      console.log('✅ Connected to WebSocket');
    };
    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
      console.log('🔌 WebSocket disconnected');
    };
  }, [token]);

  const subscribeToCommentSize = (postId) => {
    if (!stompClient) return;

    return stompClient.subscribe(`/topic/comments/size/${postId}`, (message) => {
      setCommentCount(parseInt(message.body));
    });
  };

  const subscribeToLikeSize = (postId) => {
    if (!stompClient) return;

    return stompClient.subscribe(`/topic/likes/${postId}`, (message) => {
      setLikes(parseInt(message.body));
    });
  };

  const subscribeToComments = (postId) => {
    if (!stompClient) return;

    return stompClient.subscribe(`/topic/comments/${postId}`, (message) => {
      const newComment = JSON.parse(message.body);
      setComments((prev) => [newComment, ...prev]);
    });
  };

  return (
    <WebSocketContext.Provider
      value={{
        stompClient,
        likes,
        comments,
        commentCount,
        subscribeToCommentSize,
        subscribeToLikeSize,
        subscribeToComments,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
