import 'react-native-gesture-handler';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import useServerIP from './src/lib/hooks/useServerIP.ts';
import ServerContext from './src/lib/contexts/ServerContext';
import HomeScreen from './src/screens/HomeScreen';
import IncomingCallScreen from './src/screens/IncomingCallScreen.tsx';
import InCallScreen from './src/screens/InCallScreen.tsx';
import SocketIOClient from 'socket.io-client';
import SocketContext from './src/lib/contexts/SocketContext.ts';
import RTCContext from './src/lib/contexts/RTCContext.ts';
import {
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  mediaDevices,
} from 'react-native-webrtc';

const Stack = createStackNavigator();

const App = () => {
  const navigation = useNavigation();
  //---------
  const [videoDisabled] = useState<boolean>(false);
  const [mediaConstraints] = useState<object>();
  //---------
  const {serverIP, serverCheckProgress} = useServerIP();
  const [socket, setSocket] = useState<any>(null);
  const {callerId} = useContext(RTCContext);
  const [localStream, setLocalStream] = useState<any>(null);
  const [remoteStream, setRemoteStream] = useState<any>(null);
  const otherUserId = useRef<string | null>(null);
  const remoteRTCMessage = useRef<any>(null);
  const peerConnection = useRef(
    new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
        {
          urls: 'stun:stun1.l.google.com:19302',
        },
        {
          urls: 'stun:stun2.l.google.com:19302',
        },
      ],
    }),
  );

  useEffect(() => {
    console.log(serverIP);
    if (serverIP) {
      setSocket(
        SocketIOClient(`http://${serverIP}:3500`, {
          transports: ['websocket'],
          query: {
            callerId: callerId,
          },
        }),
      );
    } else {
      setSocket(null);
    }
  }, [serverIP, callerId]);
  //  useEffect(() => {
  //    InCallManager.start();
  //    InCallManager.setKeepScreenOn(true);
  //    InCallManager.setForceSpeakerphoneOn(true);
  //
  //    return () => {
  //      InCallManager.stop();
  //    };
  //  }, []);

  useEffect(() => {
    console.log(peerConnection.current);
  }, [navigation]);

  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const mediaStream = await mediaDevices.getUserMedia({
          audio: true,
          video: {
            frameRate: 30,
            facingMode: 'user',
          },
        });

        if (videoDisabled) {
          let videoTrack = mediaStream.getVideoTracks()[0];
          videoTrack.enabled = false;
        }

        setLocalStream(mediaStream);
        mediaStream
          .getTracks()
          .forEach(track =>
            peerConnection.current.addTrack(track, mediaStream),
          );
      } catch (err) {}
    };
    getMediaStream();
    //https://github.com/react-native-webrtc/react-native-webrtc/issues/1488

    peerConnection.current.addEventListener('connectionstatechange', () => {
      switch (peerConnection.current.connectionState) {
        case 'closed':
          navigation.goBack();
          break;
      }
    });

    peerConnection.current.addEventListener('icecandidate', (event: any) => {
      if (event.candidate) {
        sendICEcandidate.current({
          calleeId: otherUserId.current,
          rtcMessage: {
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
          },
        });
      } else {
        console.log('End of candidates.');
      }
    });
    peerConnection.current.addEventListener('track', (event: any) => {
      setRemoteStream((prevRemoteStream: any) => {
        const newRemoteStream = prevRemoteStream || new MediaStream();
        newRemoteStream.addTrack(event.track, newRemoteStream);
      });
    });
  }, [navigation, videoDisabled]);

  useEffect(() => {
    socket?.on('newCall', (data: any) => {
      remoteRTCMessage.current = data.rtcMessage;
      otherUserId.current = data.callerId;
      navigation.navigate('IncomingCall' as never);
    });

    socket?.on('callAnswered', (data: any) => {
      remoteRTCMessage.current = data.rtcMessage;
      peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(remoteRTCMessage.current),
      );
      navigation.navigate('InCall' as never);
    });

    socket?.on('ICEcandidate', (data: any) => {
      let message = data.rtcMessage;

      if (peerConnection.current) {
        peerConnection.current
          .addIceCandidate(
            new RTCIceCandidate({
              candidate: message.candidate,
              sdpMid: message.id,
              sdpMLineIndex: message.label,
            }),
          )
          .then(data => {
            console.log('SUCCESS');
          })
          .catch(err => {
            console.log('Error', err);
          });
      }
    });

    return () => {
      socket?.off('newCall');
      socket?.off('callAnswered');
      socket?.off('ICEcandidate');
    };
  }, [socket, navigation, mediaConstraints]);

  const sendICEcandidate = useRef((data: any) => {
    socket?.emit('ICEcandidate', data);
  });

  return (
    <ServerContext.Provider value={{serverIP, serverCheckProgress}}>
      <SocketContext.Provider value={{socket, setSocket}}>
        <RTCContext.Provider
          value={{
            callerId,
            otherUserId,
            localStream,
            setLocalStream,
            remoteStream,
            setRemoteStream,
            peerConnection,
            remoteRTCMessage,
          }}>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="IncomingCall"
              component={IncomingCallScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="InCall"
              component={InCallScreen}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </RTCContext.Provider>
      </SocketContext.Provider>
    </ServerContext.Provider>
  );
};
export default App;
