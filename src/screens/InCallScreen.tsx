import React, {useContext, useEffect, useState} from 'react';
import {View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import RTCContext from '../lib/contexts/RTCContext';
import {RTCView} from 'react-native-webrtc';

const InCallScreen = ({navigation}: {navigation: any}) => {
  const [enableBack, setEnableBack] = useState<boolean>(false);
  const [enableMute, setEnableMute] = useState<boolean>(false);
  const [enableSpeaker, setEnableSpeaker] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const {
    otherUserId,
    peerConnection,
    localStream,
    setLocalStream,
    remoteStream,
  } = useContext(RTCContext);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      if (!enableBack) {
        e.preventDefault();
      }
    });
    const elapsed = setInterval(() => {
      setTimer(time => time + 1);
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(elapsed);
    };
  }, [enableBack, navigation]);

  useEffect(() => {
    if (enableBack) {
      navigation.navigate('Home');
    }
  }, [enableBack, navigation]);

  const handleEndCall = () => {
    peerConnection.current.close();
    setLocalStream(null);
    setEnableBack(true);
  };

  const handleMute = () => {
    setEnableMute(Mute => !Mute);
  };

  const handleSpeaker = () => {
    setEnableSpeaker(Speaker => !Speaker);
  };

  return (
    <View tw="flex flex-col justify-around grow">
      <View>
        {localStream ? (
          <RTCView
            objectFit={'cover'}
            streamURL={localStream.toURL()}
            tw="flex"
          />
        ) : null}
        {remoteStream ? (
          <RTCView
            objectFit={'cover'}
            streamURL={remoteStream.toURL()}
            tw="flex"
          />
        ) : null}

        {otherUserId.current && <Text tw="self-center">In call</Text>}
        <Text tw="self-center py-3 text-2xl font-semibold">
          {otherUserId.current ? otherUserId.current : 'In Call'}
        </Text>
        <Text tw="self-center text-xl font-bold">
          {timer < 600 && '0'}
          {Math.floor(timer / 60)}:{timer % 60 < 10 && '0'}
          {(timer % 60).toString()}
        </Text>
      </View>
      <View>
        <Button onPress={handleMute}>{enableMute ? 'Unmute' : 'Mute'}</Button>
        <Button onPress={handleSpeaker}>
          {enableSpeaker ? 'Turn off Speaker' : 'Speaker'}
        </Button>
        <Button onPress={handleEndCall}>End Call</Button>
      </View>
    </View>
  );
};

export default InCallScreen;
