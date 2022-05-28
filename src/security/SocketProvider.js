//import {io} from "socket.io-client";
import {createContext, useContext} from "react";
import {server_uri} from "../config";

const SocketContext = createContext({});

export const SocketProvider = ({children}) => {
  const socket = server_uri/*io(`ws://${server_uri}`);*/

  //useEffect(() => {socket.current = io(`ws://${server_uri}`)}, [])

  return (
    <SocketContext.Provider
      value={socket}
    >
      {children}
      {socket}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext)/*.current*/;