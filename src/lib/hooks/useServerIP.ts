import {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import useLocalIP from './useLocalIP.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useServerIP = () => {
  const localIP = useLocalIP();
  const [serverIP, setServerIP] = useState<string | null>(null);
  const [serverCheckProgress, setServerCheckProgress] = useState<number | null>(
    null,
  );
  const resetState = () => {
    setServerIP(null);
    setServerCheckProgress(null);
  };
  const checkDevices = async (ip: string | null) => {
    console.log('Local IP: ', ip);
    resetState();
    if (!ip || serverCheckProgress) {
      return;
    }
    const prevServerIP = await AsyncStorage.getItem('PREV_SERVER_IP');
    if (prevServerIP !== null) {
      const url = `http://${prevServerIP}:3500/check`;

      try {
        const response = await axios.request({
          timeout: 1000,
          method: 'GET',
          url: url,
        });
        const {code} = response.data;

        if (code === 1234) {
          setServerIP(prevServerIP);
          setServerCheckProgress(null);
          return;
        }
      } catch (error) {}
    }
    const ipParts = ip.split('.');
    const baseIP = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.`;

    for (let i = 1; i <= 255; i++) {
      const targetIP = `${baseIP}${i}`;
      const url = `http://${targetIP}:3500/check`;

      try {
        const response = await axios.request({
          timeout: 500,
          method: 'GET',
          url: url,
        });
        const {code} = response.data;

        if (code === 1234) {
          setServerIP(targetIP);
          setServerCheckProgress(null);
          await AsyncStorage.setItem('PREV_SERVER_IP', targetIP);
          return;
        }
      } catch (error) {}

      const progress = Math.round((i / 255) * 100);
      setServerCheckProgress(progress);
    }
    resetState();
  };

  const checkDevicesRef = useRef(checkDevices);

  useEffect(() => {
    checkDevicesRef.current(localIP);
  }, [localIP]);

  return {
    serverIP,
    serverCheckProgress,
  };
};

export default useServerIP;
