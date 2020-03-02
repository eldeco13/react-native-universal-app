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

const ORIENTATION_PORTRAIT = 'PORTRAIT';
const ORIENTATION_LANDSCAPE = 'LANDSCAPE';
const INITIAL_ORIENTATION = window.width > window.height;
// Tablet portrait dimensions
const tablet = {
  width: 552,
  height: 960,
};

// Tablet landscape dimensions
const tablet_landscape = {
  width: 1194,
  height: 834,
};

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

function UserDetails({ id, gender }) {
  return (
    <View style={styles.main_userdetail}>
      <Text style={styles.toolbar_userdetail}>Details of the person!</Text>
      <Text>
        This is the detail view:{gender}
      </Text>
    </View>
  );
}

export default function App() {
  const [selected, setSelected] = React.useState(new Map());
  const [dimensions, setDimentions] = React.useState({window, screen})
  const [orientationStatus, setOrientationStatus] = React.useState(INITIAL_ORIENTATION ? ORIENTATION_LANDSCAPE : ORIENTATION_PORTRAIT)
  
  const onChange = ({window, screen}) => {
    setDimentions({window, screen})
    calcOrientation({window})
  };

  const calcOrientation = ({window}) => {
    let orientationStatus = ''
    if(window.width > window.height) {
      orientationStatus = ORIENTATION_LANDSCAPE;
    } else {
      orientationStatus = ORIENTATION_PORTRAIT;
    }
    return setOrientationStatus(orientationStatus)
  }
  const isLandscape = () => {
    return orientationStatus===ORIENTATION_LANDSCAPE
  }

  const isPortrait = () => {
    return orientationStatus===ORIENTATION_PORTRAIT
  }

  const isPhone = () => {
    if(isPortrait()) {
        return dimensions.window.height < tablet.height;
    } else if (isLandscape())
        return dimensions.window.width < tablet_landscape.width;
  }

  const isTablet = () => {
    if(isPortrait()) {
      return dimensions.window.height >= tablet.height;
    } else if (isLandscape())
      return dimensions.window.width >= tablet_landscape.width;
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
      <Text>{`Window Orientation - ${orientationStatus}`}</Text>
      <Text>{`isPortrait - ${isPortrait()}`}</Text>
      <Text>{`isLandscape- ${isLandscape()}`}</Text>
      <Text>{`isPhone() - ${isPhone()}`}</Text>
      <Text>{`isTablet() - ${isTablet()}`}</Text>
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
       {() => isTablet() &&  
            <UserDetails gender={data.results[0].gender}/>
          }
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
  main_userdetail: {
    flex: 3,
    backgroundColor: '#f0f3f4',
  },
  toolbar_userdetail: {
    backgroundColor: '#2989dd',
    color: '#fff',
    paddingTop: 50,
    padding: 20,
    textAlign: 'center',
    fontSize: 20,
  },
});
