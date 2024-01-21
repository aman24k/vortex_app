import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Button, Text} from 'react-native-paper';

const IncomingCallScreen = ({navigation}: {navigation: any}) => {
  const [enableBack, setEnableBack] = useState<boolean>(false);

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

  const handleAnswerCall = () => {};
  const handleRejectCall = () => {
    setEnableBack(true);
  };

  useEffect(() => {
    if (enableBack) {
      navigation.navigate('Home');
    }
  }, [enableBack, navigation]);

  return (
    <View>
      <Text>Incoming call from...</Text>
      <Button
        onPress={() => {
          handleAnswerCall();
        }}>
        Answer Call
      </Button>
      <Button
        onPress={() => {
          handleRejectCall();
        }}>
        Reject Call
      </Button>
    </View>
  );
};

export default IncomingCallScreen;
