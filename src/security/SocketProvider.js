import {io} from "socket.io-client";
import {createContext, useContext, useEffect, useRef} from "react";
import {server_uri} from "../config";

const SocketContext = createContext({});

export const SocketProvider = ({children}) => {
  const socket = useRef(null);

  useEffect(() => {socket.current = io(`ws://${server_uri}`)}, [])

  return (
    <SocketContext.Provider
      value={socket}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext).current;