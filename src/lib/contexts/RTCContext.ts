import {createContext} from 'react';

interface RTC {
  callerId: string;
  otherUserId: any;
  localStream: any;
  setLocalStream: any;
  remoteStream: any;
  setRemoteStream: any;
  peerConnection: any;
  remoteRTCMessage: any;
}
const generateCallerId = Math.floor(100000 + Math.random() * 900000).toString();
const RTCContext = createContext<RTC>({
  callerId: generateCallerId,
  otherUserId: null,
  localStream: null,
  setLocalStream: () => {},
  remoteStream: null,
  setRemoteStream: () => {},
  peerConnection: null,
  remoteRTCMessage: null,
});
export default RTCContext;
