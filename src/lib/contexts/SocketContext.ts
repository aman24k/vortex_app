import {createContext} from 'react';
interface Socket {
  socket: any;
  setSocket: any;
}
const SocketContext = createContext<Socket>({
  socket: null,
  setSocket: () => {},
});
export default SocketContext;
