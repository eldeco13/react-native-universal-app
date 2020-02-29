import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  View,
  Dimensions,
  Text,
} from 'react-native';
import Constants from 'expo-constants';
import data from './data.json'

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

function Item({ id, name, image, selected, onSelect }) {
  return (
    <TouchableOpacity
      onPress={() => onSelect(id)}
      style={[
        styles.item,
        { backgroundColor: selected ? '#6e3b6e' : '#f9c2ff' },
      ]}
    >
    <Image 
      source={{uri: `${image}`}} 
      style={styles.img} /> 
      <View style={styles.info}> 
        <Text style={styles.name}>{name}</Text>
      </View>

    </TouchableOpacity>
  );
}

export default function App() {
  const [selected, setSelected] = React.useState(new Map());
  const [dimensions, setDimentions] = React.useState({window, screen})

  const onChange = ({window, screen}) => {
    setDimentions({window, screen})
  }

  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange)
    }
  })

  const onSelect = React.useCallback(
    id => {
      const newSelected = new Map(selected);
      newSelected.set(id, !selected.get(id));

      setSelected(newSelected);
    },
    [selected],
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text>{`Window Dimensions: height - ${dimensions.window.height}, width - ${dimensions.window.width}`}</Text>
      <Text>{`Screen Dimensions: height - ${dimensions.screen.height}, width - ${dimensions.screen.width}`}</Text>
      <Text 
        style={styles.toolbar}>
           List of people
      </Text>
      <FlatList
        data={data.results}
        renderItem={({ item }) => (
          <Item
            id={item.id.value}
            name={item.name.first}
            image={item.picture.large}
            selected={!!selected.get(item.id.value)}
            onSelect={onSelect}
          />
        )}
        keyExtractor={item => item.id.value}
        extraData={selected}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  dimensions: {
    justifyContent: "center",
    alignItems: "center"
  },
  toolbar: {
    backgroundColor: '#2989dd',
    color: '#fff',
    paddingTop: 50,
    padding: 20,
    textAlign: 'center',
    fontSize: 20,
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  info: {
    marginRight: 30,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    flexDirection: 'row-reverse',
  },
  name: {
    color: '#333',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});
