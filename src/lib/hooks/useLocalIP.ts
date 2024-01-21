import {useEffect, useState} from 'react';
import {NetworkInfo} from 'react-native-network-info';
import {addEventListener as addNetworkListener} from '@react-native-community/netinfo';

const useLocalIP = () => {
  const [localIP, setLocalIP] = useState<string | null>(null);
  useEffect(() => {
    const unsubscribe = addNetworkListener(state => {
      if (state.type === 'wifi') {
        NetworkInfo.getIPV4Address().then(ipAddress => {
          setLocalIP(ipAddress || null);
        });
      } else {
        setLocalIP(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return localIP;
};

export default useLocalIP;
