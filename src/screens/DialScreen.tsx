import * as React from 'react';
import {View} from 'react-native';
import {Button, Text} from 'react-native-paper';
const DialScreen = ({navigation}: {navigation: any}) => {
  return (
    <View>
      <Text>Dial Screen</Text>
      <Button
        onPress={() => {
          navigation.navigate('IncomingCall');
        }}>
        Opne Call
      </Button>
    </View>
  );
};
export default DialScreen;
