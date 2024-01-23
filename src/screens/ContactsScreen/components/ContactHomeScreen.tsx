import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {Contact} from '../types';
import useDB from '../../../lib/hooks/useDB';

export default function ContactHomeScreen({navigation}: {navigation: any}) {
  const [contacts, setContacts] = useState([] as Contact[]);
  const {runQuery} = useDB();
  useEffect(() => {
    const fetchContacts = async () => {
      const query = 'SELECT * FROM contacts';
      try {
        const results: any = await runQuery(query, 'select');
        setContacts(results);
      } catch (error) {
        console.log(error);
      }
    };
    fetchContacts();
  }, [runQuery]);

  return (
    <View>
      <Button
        onPress={() => {
          navigation.navigate('AddContactScreen');
        }}>
        Add Contact
      </Button>
      {contacts.map(contact => (
        <View key={contact.id}>
          <Text>{contact.name}</Text>
          <Text>{contact.landline}</Text>
        </View>
      ))}
    </View>
  );
}
