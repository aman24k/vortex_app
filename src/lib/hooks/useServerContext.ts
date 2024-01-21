import {useContext} from 'react';
import ServerContext from '../contexts/ServerContext.ts';

const useServerContext = () => {
  const {serverIP, serverCheckProgress} = useContext(ServerContext);
  return {serverIP, serverCheckProgress};
};

export default useServerContext;
