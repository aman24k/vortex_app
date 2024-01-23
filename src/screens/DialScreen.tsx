import React, {useContext} from 'react';
import {View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import RTCContext from '../lib/contexts/RTCContext';
import SocketContext from '../lib/contexts/SocketContext';
const DialScreen = ({navigation}: {navigation: any}) => {
  const {callerId, otherUserId, peerConnection} = useContext(RTCContext);
  const {socket} = useContext(SocketContext);
  function sendCall(data: any) {
    socket.emit('call', data);
  }
  async function processCall() {
    const sessionDescription = await peerConnection.current.createOffer({
      mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true,
        VoiceActivityDetection: true,
      },
    });
    await peerConnection.current.setLocalDescription(sessionDescription);
    sendCall({
      calleeId: otherUserId.current,
      rtcMessage: sessionDescription,
    });
  }
  return (
    <View tw="flex flex-col justify-around grow">
      <Text>Your callerid: {callerId} </Text>
      <TextInput
        label="callee"
        value={otherUserId.current}
        onChangeText={number => (otherUserId.current = number)}
      />
      <Button
        disabled={!otherUserId}
        onPress={() => {
          processCall();
          navigation.navigate('InCall');
        }}>
        Dial Call
      </Button>
      <Button
        onPress={() => {
          navigation.navigate('IncomingCall');
        }}>
        Siml: Receive Call
      </Button>
    </View>
  );
};
export default DialScreen;
