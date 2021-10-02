/**
 * Sample BLE React Native App
 *
 * @format
 * @flow strict-local
 */

 import React, {
    useState,
    useEffect,
  } from 'react';
  import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    NativeModules,
    NativeEventEmitter,
    Button,
    Platform,
    PermissionsAndroid,
    FlatList,
    TouchableHighlight,
  } from 'react-native';
  
  import {
    Colors,
  } from 'react-native/Libraries/NewAppScreen';
  import { stringToBytes } from "convert-string";
  
  import BleManager from 'react-native-ble-manager';
  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
  import Buffer from 'buffer';
  const App = () => {
    const [isScanning, setIsScanning] = useState(false);
    const peripherals = new Map();
    const [list, setList] = useState([]);
  
  
    const [input1, setINPUT1] = useState("");
    const [input2, setINPUT2] = useState("");
    const [frp, setFrp] = useState("");
    const [peakMPA, setPeakMpa] = useState("");
    const [peakVolt, setPeakVolt] = useState("");
    const [alertBatt, setAlertBatt] = useState("");
    const [alertfrp, setAlertFrp] = useState("");
    const [alertVfrp, setAlertVfrp] = useState("");
    const [mode, setMode] = useState("");
    const startScan = () => {
      if (!isScanning) {
        BleManager.scan([], 3, true).then((results) => {
          console.log('Scanning...');
          setList([]);
          setIsScanning(true);
        }).catch(err => {
          console.error(err);
        });
      }
    }
  
    const handleStopScan = () => {
      console.log('Scan is stopped');
      
      setIsScanning(false);
    }
  
    const handleDisconnectedPeripheral = (data) => {
      let peripheral = peripherals.get(data.peripheral);
      if (peripheral) {
        peripheral.connected = false;
        peripherals.set(peripheral.id, peripheral);
        setList(Array.from(peripherals.values()));
      }
      console.log('Disconnected from ' + data.peripheral);
    }
  
    const handleUpdateValueForCharacteristic = (data) => {
      // console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
      const buffer = Buffer.Buffer.from(data.value); //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
      const sensorData = buffer.readUInt8(1, true);
      // console.log("buffer.toString() = ")
      // console.log(buffer.toString());
      const datas = buffer.toString();
      const len = datas.indexOf("=");
      if (datas.indexOf("IN1=") != -1) {
        setINPUT1(datas.substring(len + 1, datas.indexOf(",")));
        setMode(datas.substring(datas.indexOf(",") + 1, datas.length - 1));
        console.log(datas.substring(len + 1, datas.indexOf(",")));
      } else if (datas.indexOf("IN2=") != -1) {
        setINPUT2(datas.substring(len + 1, datas.length - 1));
      } else if (datas.indexOf("frp=") != -1) {
        setFrp(datas.substring(len + 1, datas.length - 1));
      } else if (datas.indexOf("pmpa=") != -1) {
        setPeakMpa(datas.substring(len + 1, datas.length - 1));
      } else if (datas.indexOf("p_v=") != -1) {
        setPeakVolt(datas.substring(len + 1, datas.length - 1));
      } else if (datas.indexOf("a_b=") != -1) {
        setAlertBatt(datas.substring(len + 1, datas.length - 1));
      } else if (datas.indexOf("a_f=") != -1) {
        setAlertFrp(datas.substring(len + 1, datas.length - 1));
      } else if (datas.indexOf("a_vf=") != -1) {
        setAlertVfrp(datas.substring(len + 1, datas.length - 1));
      }
    }
  
    const retrieveConnected = () => {
      BleManager.getConnectedPeripherals([]).then((results) => {
        if (results.length == 0) {
          console.log('No connected peripherals')
        }
        console.log(results);
        for (var i = 0; i < results.length; i++) {
          var peripheral = results[i];
          peripheral.connected = true;
          peripherals.set(peripheral.id, peripheral);
          setList(Array.from(peripherals.values()));
        }
      });
    }
  
    const handleDiscoverPeripheral = (peripheral) => {
      console.log('[1]Got ble peripheral', peripheral);
      if (!peripheral.name) {
        peripheral.name = 'NO NAME';
      }
      peripherals.set(peripheral.id, peripheral);
      setList(Array.from(peripherals.values()));
    }
  
    // const [idperipheral, setIDperipheral] = useState("");
    const [idperipheral, setPeripheral] = useState("");
  
    // useEffect(() => {
    //   const interval = setInterval(() => {
    //     try {
    //       BleManager.read(
    //         "6e400001-b5a3-f393-e0a9-e50e24dcca9e", 
    //         "6e400003-b5a3-f393-e0a9-e50e24dcca9e", 
    //         "6e400002-b5a3-f393-e0a9-e50e24dcca9e"
    //       )
    //         .then((readData) => {
    //           // Success code
    //           console.log("Read: " + readData);
  
    //           const buffer = Buffer.Buffer.from(readData); //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
    //           const sensorData = buffer.readUInt8(1, true);
    //         })
    //         .catch((error) => {
    //           // Failure code
    //           console.log("error : " + error);
    //         });
    //     } catch {
  
    //     }
    //   }, 1000);
    //   return () => clearInterval(interval);
    // }, [])
    var service = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
    var bakeCharacteristic = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
    var crustCharacteristic = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
    var id1;
    const testPeripheral = (peripheral) => {
      if (peripheral) {
        if (peripheral.connected) {
          BleManager.disconnect(peripheral.id);
        } else {
          BleManager.connect(peripheral.id).then(() => {
            let p = peripherals.get(peripheral.id);
            if (p) {
              p.connected = true;
              peripherals.set(peripheral.id, p);
              setList(Array.from(peripherals.values()));
            }
            console.log('Connected to ' + peripheral.id);
            setTimeout(() => {
              BleManager.retrieveServices(peripheral.id).then((peripheralData) => {
                console.log('Retrieved peripheral services', peripheralData);
  
                BleManager.readRSSI(peripheral.id).then((rssi) => {
                  console.log('Retrieved actual RSSI value', rssi);
                  let p = peripherals.get(peripheral.id);
                  if (p) {
                    p.rssi = rssi;
                    peripherals.set(peripheral.id, p);
                    setList(Array.from(peripherals.values()));
                  }
                });
              });
              setPeripheral(peripheral.id);
  
              BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
                console.log(peripheralInfo);
                // var service = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
                // var bakeCharacteristic = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
                // var crustCharacteristic = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
                setTimeout(() => {
                  BleManager.startNotification(peripheral.id, service, bakeCharacteristic, 500).then(() => {
                    console.log('Started notification on ' + peripheral.id);
                    setTimeout(() => {
                      const str = stringToBytes("CONNECT KOMKAWILA");
  
                      BleManager.write(peripheral.id, service, crustCharacteristic, str).then(() => {
                        console.log('Writed NORMAL crust');
                        // BleManager.write(peripheral.id, service, bakeCharacteristic, [1, 95]).then(() => {
                        //   console.log('Writed 351 temperature, the pizza should be BAKED');
  
                        //   //var PizzaBakeResult = {
                        //   //  HALF_BAKED: 0,
                        //   //  BAKED:      1,
                        //   //  CRISPY:     2,
                        //   //  BURNT:      3,
                        //   //  ON_FIRE:    4
                        //   //};
                        // });
                      });
                    }, 500);
                  }).catch((error) => {
                    console.log('Notification error', error);
                  });
                }, 200);
              });
  
  
  
            }, 900);
          }).catch((error) => {
            console.log('Connection error', error);
          });
        }
      }
  
    }
  
    useEffect(() => {
      BleManager.start({ showAlert: false });
  
      bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
      bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
      bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
      bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);
  
      if (Platform.OS === 'android' && Platform.Version >= 23) {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
          if (result) {
            console.log("Permission is OK");
          } else {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
              if (result) {
                console.log("User accept");
              } else {
                console.log("User refuse");
              }
            });
          }
        });
      }
  
      return (() => {
        console.log('unmount');
        bleManagerEmitter.removeListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
        bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
        bleManagerEmitter.removeListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
        bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);
      })
    }, []);
  
    const renderItem = (item) => {
      const color = item.connected ? 'green' : '#fff';
      return (
        <TouchableHighlight onPress={() => testPeripheral(item)}>
          <View style={[styles.row, { backgroundColor: color }]}>
            <Text style={{ fontSize: 12, textAlign: 'center', color: '#333333', padding: 10 }}>{item.name}</Text>
            <Text style={{ fontSize: 10, textAlign: 'center', color: '#333333', padding: 2 }}>RSSI: {item.rssi}</Text>
            <Text style={{ fontSize: 8, textAlign: 'center', color: '#333333', padding: 2, paddingBottom: 20 }}>{item.id}</Text>
          </View>
        </TouchableHighlight>
      );
    }
  
    const SENDCOMMAND = (e) => {
      const str = stringToBytes(e);
      BleManager.write(idperipheral, service, crustCharacteristic, str)
        .then(() => {
          // Success code
          console.log("Write: ");
        })
        .catch((error) => {
          // Failure code
          console.log(error);
        });
    }
  
    return (
      <>
        {/* <StatusBar barStyle="dark-content" /> */}
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            <View style={styles.body}>
  
              <View style={{ flexDirection: "row" }}>
                <View style={{ margin: 10 }}>
                  <Button
                    title={'Scan Bluetooth (' + (isScanning ? 'on' : 'off') + ')'}
                    onPress={() => startScan()}
                  />
                  <Button title="Retrieve connected peripherals" onPress={() => retrieveConnected()} />
                </View>
  
                <View style={{ flexDirection: "row" }}>
                  <Button title="MODE 0" style={{ fontSize: 10 }} onPress={() => SENDCOMMAND("AT+MODE=0")} ></Button>
                  <Button title="MODE 1" style={{ fontSize: 10 }} onPress={() => SENDCOMMAND("AT+MODE=1")} ></Button>
                  <Button title="MODE 2" style={{ fontSize: 10 }} onPress={() => SENDCOMMAND("AT+MODE=2")} ></Button>
                  <Button title="CLEAR PEAK" style={{ fontSize: 10 }} onPress={() => SENDCOMMAND("AT+CLEAR")} ></Button>
                </View>
  
              </View>
  
              {/* <View style={{ margin: 10 }}>
                <Button
                  title={'Scan Bluetooth (' + (isScanning ? 'on' : 'off') + ')'}
                  onPress={() => startScan()}
                />
                <Button title="Retrieve connected peripherals" onPress={() => retrieveConnected()} />
                
              </View> */}
              {/* <View style={{ margin: 10 }}>
                <Button title="Retrieve connected peripherals" onPress={() => retrieveConnected()} />
              </View> */}
  
              {(list.length == 0) &&
                <View style={{ flex: 1, margin: 20 }}>
                  <Text style={{ textAlign: 'center' }}>No peripherals</Text>
                </View>
              }
  
            </View>
          </ScrollView>
          <FlatList
            data={list}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={item => item.id}
          />
          <Text style={{ textAlign: 'center', fontSize: 12 }}>INPUT1 : {input1}</Text>
          <Text style={{ textAlign: 'center', fontSize: 12 }}>INPUT2 : {input2}</Text>
          <Text style={{ textAlign: 'center', fontSize: 12 }}>FRP : {frp}</Text>
          <Text style={{ textAlign: 'center', fontSize: 12 }}>PEAK MPA : {peakMPA}</Text>
          <Text style={{ textAlign: 'center', fontSize: 12 }}>ALERT BATERRY : {alertBatt}</Text>
          <Text style={{ textAlign: 'center', fontSize: 12 }}>ALERT FRP : {alertfrp}</Text>
          <Text style={{ textAlign: 'center', fontSize: 12 }}>ALERT MPA : {alertVfrp}</Text>
          <Text style={{ textAlign: 'center', fontSize: 12 }}>MODE : {mode}</Text>
        </SafeAreaView>
      </>
    );
  };
  // const [input1, setINPUT1] = useState(0);
  // const [input2, setINPUT1] = useState(0);
  // const [frp, setFrp] = useState(0);
  // const [peakMPA, setPeakMpa] = useState(0);
  // const [peakVolt, setPeakVolt] = useState(0);
  // const [alertBatt, setAlertBatt] = useState(0);
  // const [alertfrp, setAlertFrp] = useState(0);
  // const [alertVfrp, setAlertVfrp] = useState(0);
  // const [mode, setMode] = useState(0);
  const styles = StyleSheet.create({
    scrollView: {
      backgroundColor: Colors.lighter,
    },
    engine: {
      position: 'absolute',
      right: 0,
    },
    body: {
      backgroundColor: Colors.white,
    },
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: Colors.black,
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
      color: Colors.dark,
    },
    highlight: {
      fontWeight: '700',
    },
    footer: {
      color: Colors.dark,
      fontSize: 12,
      fontWeight: '600',
      padding: 4,
      paddingRight: 12,
      textAlign: 'right',
    },
  });
  
  export default App;