// 3 Ways to Hide Navigation Bar in React Native Application
// https://aboutreact.com/react-native-hide-navigation-bar-and-make-screen-full-screen/

import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

const HomeActivity = ({navigation, route}) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({headerShown: false});
  }, [navigation]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.container}>
        <Text style={styles.header}>
          3 Ways to Hide Navigation Bar
          {'\n'}
          in React Native Application
        </Text>
      </View>
      <Text style={{textAlign: 'center', color: 'grey'}}>
        www.aboutreact.com
      </Text>
    </SafeAreaView>
  );
};

export default HomeActivity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 25,
    textAlign: 'center',
    marginVertical: 16,
  }
});