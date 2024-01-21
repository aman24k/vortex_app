import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import useServerIP from './src/lib/hooks/useServerIP.ts';
import ServerContext from './src/lib/contexts/ServerContext';
import HomeScreen from './src/screens/HomeScreen';
import IncomingCallScreen from './src/screens/IncomingCallScreen.tsx';

const Stack = createStackNavigator();

const App = () => {
  const {serverIP, serverCheckProgress} = useServerIP();
  return (
    <ServerContext.Provider value={{serverIP, serverCheckProgress}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="IncomingCall"
            component={IncomingCallScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ServerContext.Provider>
  );
};
export default App;
