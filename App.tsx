import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import DialScreen from './src/screens/DialScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SettingsScreen from './src/screens/SettingsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ContactsScreen from './src/screens/ContactsScreen';
import {View} from 'react-native';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Dial" component={DialScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Contacts" component={ContactsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
export default App;
