import {createContext} from 'react';
const ServerContext = createContext<{
  serverIP: string | null;
  serverCheckProgress: number | null;
}>({
  serverIP: null,
  serverCheckProgress: null,
});
export default ServerContext;
