import React, {useState} from 'react';
import {View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import useDB from '../../../lib/hooks/useDB';

const AddContactScreen = ({navigation}: {navigation: any}) => {
  const [name, setName] = useState('');
  const [landline, setLandline] = useState('');
  const {runQuery} = useDB();
  const handleSubmit = async () => {
    const query = `INSERT INTO contacts (name, landline) VALUES ('${name}', '${landline}')`;
    try {
      await runQuery(query);
      setName('');
      setLandline('');
      navigation.navigate('ContactHomeScreen');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View tw="p-4">
      <View tw="flex flex-col gap-4">
        <Text tw="mt">Add Contact</Text>
        <TextInput label="Name" onChangeText={setName} />
        <TextInput
          label="Landline"
          keyboardType="numeric"
          onChangeText={setLandline}
        />
        <Text>Name: {name}</Text>
        <Text>Landline: {landline}</Text>
        <Button mode="contained" onPress={handleSubmit}>
          Add Contact
        </Button>
      </View>
    </View>
  );
};

export default AddContactScreen;
