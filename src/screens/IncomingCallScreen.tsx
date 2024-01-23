import React, {useContext, useEffect, useState} from 'react';
import {View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {RTCSessionDescription} from 'react-native-webrtc';
import SocketContext from '../lib/contexts/SocketContext';
import RTCContext from '../lib/contexts/RTCContext';

const IncomingCallScreen = ({navigation}: {navigation: any}) => {
  const [enableBack, setEnableBack] = useState<boolean>(false);
  const {socket} = useContext(SocketContext);
  const {otherUserId, peerConnection, remoteRTCMessage} =
    useContext(RTCContext);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      if (!enableBack) {
        e.preventDefault();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [enableBack, navigation]);

  useEffect(() => {
    if (enableBack) {
      navigation.navigate('Home');
    }
  }, [enableBack, navigation]);

  async function processAccept() {
    peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(remoteRTCMessage.current),
    );
    const sessionDescription = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(sessionDescription);
    answerCall({
      callerId: otherUserId.current,
      rtcMessage: sessionDescription,
    });
  }

  function answerCall(data: any) {
    socket?.emit('answerCall', data);
  }
  // useEffect(() => {
  //}, [peerConnection, otherUserId, remoteRTCMessage, socket]);

  const handleAnswerCall = () => {
    processAccept();
    navigation.navigate('InCall');
  };
  const handleRejectCall = () => {
    setEnableBack(true);
  };

  return (
    <View tw="flex flex-col justify-around grow">
      <Text tw="self-center py-3 text-2xl font-semibold">Incoming Call</Text>
      <View>
        <Button onPress={handleAnswerCall}>Answer</Button>
        <Button onPress={handleRejectCall}>Reject</Button>
      </View>
    </View>
  );
};

export default IncomingCallScreen;
