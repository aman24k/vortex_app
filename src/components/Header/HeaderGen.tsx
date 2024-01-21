import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import useServerContext from '../../lib/hooks/useServerContext';

const HeaderGen = (headerName: string) => {
  const {serverIP, serverCheckProgress} = useServerContext();
  return () => (
    <View tw="flex flex-col bg-white">
      <View tw="bg-red-600">
        {!serverIP && <Text tw="self-center">Not connected.</Text>}
      </View>
      {serverCheckProgress != null && (
        <Text tw="self-center">
          Looking for Vortex receiver: {serverCheckProgress.toString()}%
        </Text>
      )}
      <Text tw="self-center py-3 text-2xl font-semibold">{headerName}</Text>
    </View>
  );
};
export default HeaderGen;
