import {createContext, useContext, useEffect, useRef} from 'react';
import {io} from 'socket.io-client';

const SocketContext = createContext({});

export const SocketProvider = ({children}) => {
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(`http${process.env.REACT_APP_PROFILE === 'DEV'
      ? ''
      : 's'}://${process.env.REACT_APP_SERVER_URI}`);
  }, []);

  return (
    <SocketContext.Provider
      value={socket}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext).current;
