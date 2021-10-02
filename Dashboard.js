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
  StyleSheet,
  View,
  Text,
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { stringToBytes } from "convert-string";

import BleManager from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
import Buffer from 'buffer';
import { hideNavigationBar } from 'react-native-navigation-bar-color';
import AwesomeAlert from 'react-native-awesome-alerts';
import Speedometer from 'react-native-cool-speedometer';
import Spinner from 'react-native-loading-spinner-overlay';
import { showMessage, hideMessage } from "react-native-flash-message";
// import { Overlay } from 'react-native-elements';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");
const h = window.height;
const w = window.width;
const height1 = window.height;
const width1 = window.width;
import { useNavigation } from '@react-navigation/native';
const Dashboard = () => {
  // const a = route.params;
  // console.log("Dashboard SCREEN = ");
  // console.log(a);
  // if (a != undefined)
  //   console.log(a)
  const navigation = useNavigation();

  // console.log("height1 = ");
  // console.log(height1);
  // console.log("width1 = ");
  // console.log(width1);

  const [showAlert1, setshowAlert] = useState(false);
  const [visible, setVisible] = useState(false);


  const [isScanning, setIsScanning] = useState(false);
  const peripherals = new Map();
  const [list, setList] = useState([]);


  const [batt, setBatt] = useState(12.35);
  const [frp, setFrp] = useState(170);
  const [vfrp, setVfrp] = useState(4.00);

  const [peakfrp, setPeakFrp] = useState(0);
  const [peakvfrp, setPeakVfrp] = useState(0);

  const [speed, setSpeed] = useState(147);
  const [topspeed, setTopspeed] = useState(198);
  const [modeBatt, setModeBatt] = useState(true);
  const [modeFrp, setModeFrp] = useState(false);
  const [modeVfrp, setModeVfrp] = useState(false);
  const [alertBatt, setAlertBatt] = useState(0);
  const [alertFrp, setAlertFrp] = useState(0);
  const [alertVFrp, setAlertVfrp] = useState(0);
  const [modetype, setModetype] = useState(0);
  /*
    {
      modetype:modetype,
      alertBatt:alertBatt,
      alertFrp:alertFrp,
      alertVFrp:alertVFrp
    }

  */
  // useEffect(() => {
  //   if (showAlert1) {
  //     setTimeout(() => {
  //       setshowAlert(false);
  //       Alert.alert(
  //         "สถานะ",
  //         "การเชื่อมต่อสำเร็จ",
  //         [
  //           {
  //             text: "ตกลง",
  //             onPress: () => console.log("Ask me later pressed")
  //           }
  //         ]
  //       );
  //     }, 500);
  //   }
  // }, [showAlert1]);
  const handleStopScan = () => {
    console.log('Scan is stopped');
    setIsScanning(false);
    setshowAlert(false);
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
    const buffer = Buffer.Buffer.from(data.value);
    // const sensorData = buffer.readUInt8(1, true);
    const datas = buffer.toString();
    const len = datas.indexOf("=");
    if (datas.indexOf("IN1=") != -1) {
      setBatt(parseFloat(datas.substring(len + 1, datas.length - 1)));
    } else if (datas.indexOf("IN2=") != -1) {
      setVfrp(parseFloat(datas.substring(len + 1, datas.length - 1)));
    } else if (datas.indexOf("frp=") != -1) {
      setFrp(parseFloat(datas.substring(len + 1, datas.length - 1)));
    } else if (datas.indexOf("pmpa=") != -1) {
      setPeakFrp(parseFloat(datas.substring(len + 1, datas.length - 1)));
    } else if (datas.indexOf("p_v=") != -1) {
      setPeakVfrp(parseFloat(datas.substring(len + 1, datas.length - 1)));
    } else if (datas.indexOf("a_b=") != -1) {
      setAlertBatt(datas.substring(len + 1, datas.length - 1));
    } else if (datas.indexOf("a_f=") != -1) {
      setAlertFrp(datas.substring(len + 1, datas.length - 1));
    } else if (datas.indexOf("a_vf=") != -1) {
      setAlertVfrp(datas.substring(len + 1, datas.length - 1));
    }  else if (datas.indexOf("m_ty=") != -1) {
      setModetype(datas.substring(len + 1, datas.length - 1));
    } 
    
    else if (datas.indexOf("MODE=") != -1) {
      if (datas.substring(len + 1, datas.length - 1) == '0') {
        console.log("BATTERRY");
        setModeBatt(true);
        setModeFrp(false);
        setModeVfrp(false);
      } else if (datas.substring(len + 1, datas.length - 1) == '1') {
        console.log("FRP");
        setModeBatt(false);
        setModeFrp(true);
        setModeVfrp(false);
      } else if (datas.substring(len + 1, datas.length - 1) == '2') {
        console.log("VFRP");
        setModeBatt(false);
        setModeFrp(false);
        setModeVfrp(true);
      }
    }
  }
  const [idperipheral, setPeripheral] = useState("");

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
    if (peripheral.name == "ESP DEVICE") {
      console.log('Got ble peripheral', peripheral.name);
      setPeripheral(peripheral.id);
      testPeripheral(peripheral);
      if (!peripheral.name) {
        peripheral.name = 'NO NAME';
      }
      peripherals.set(peripheral.id, peripheral);
      setList(Array.from(peripherals.values()));
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
  }, [modeBatt]);

  const SENDCOMMAND = (e) => {
    var service = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
    var bakeCharacteristic = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
    var crustCharacteristic = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
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
            // setPeripheral(peripheral.id);

            BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
              console.log(peripheralInfo);
              var service = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
              var bakeCharacteristic = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
              var crustCharacteristic = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
              setTimeout(() => {
                BleManager.startNotification(peripheral.id, service, bakeCharacteristic, 500).then(() => {
                  console.log('Started notification on ' + peripheral.id);
                  setTimeout(() => {
                    const str = stringToBytes("CONNECT STARTED");

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
                  }, 1);
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
  // ################################################
  const hideAlert = () => {
    setshowAlert(false);
  }
  useEffect(() => {
    hideNavigationBar();
  }, [])
  const bluetoothFunc = () => {
    console.log("bluetoothFunc");
    // setshowAlert(true);
    if (!isScanning) {
      BleManager.scan([], 3, true).then((results) => {
        console.log('Scanning...');
        setList([]);
        setshowAlert(true);
        setIsScanning(true);
      }).catch(err => {
        console.error(err);
      });
    }

  }
  const settingFunc = () => {
    console.log("settingFunc");
    navigation.navigate("Setting", {
      modetype: modetype,
      alertBatt: alertBatt,
      alertFrp: alertFrp,
      alertVFrp: alertVFrp,
      idperipheral : idperipheral
    });


  }
  const datalogFunc = () => {
    console.log("Datalog");
    navigation.navigate("Datalog",{
      idperipheral : idperipheral
    });
  }
  const batteryFunc = () => {
    console.log("BATTERY");
    setModeBatt(true);
    setModeFrp(false);
    setModeVfrp(false);
    SENDCOMMAND("AT+MODE=0");
  }
  const frpFunc = () => {
    console.log("FRP");
    SENDCOMMAND("AT+MODE=1");
    setModeBatt(false);
    setModeFrp(true);
    setModeVfrp(false);
  }
  const vfrpFunc = () => {
    console.log("VFRP");
    setModeBatt(false);
    setModeFrp(false);
    setModeVfrp(true);
    SENDCOMMAND("AT+MODE=2");
  }
  const clearFunc = () => {
    console.log("clearFunc");
    SENDCOMMAND("AT+CLEAR");
  }

  return (
    <>
      <ImageBackground source={require('./assets/img/bg.jpg')} style={{ width: '100%', height: '100%' }}>
        <View style={{ position: "relative", width: '100%', height: '100%' }}>
          <View style={{ width: '50%', position: "absolute", height: '100%' }}>
            <Image source={require('./assets/img/logopng.png')} style={{ width: '20%', height: '20%', top: 10, left: 15 }}></Image>
            <View style={{ position: "absolute", width: '80%', height: '85%', top: 40, left: 40 }}>
              {modeBatt ? <Speedometer
                value={batt}
                fontFamily='squada-one'
                size={(h + w) / 3.6}
                max={15}
                step={0.5}
                noIndicator
                fontFamily='squada-one'
                primaryArcWidth={80}
                accentColor='#991717'
                secondaryArcColor='#ffffff'
                secondaryArcOpacity={0.1}
                rotation={-180}
                noNeedle
              /> : null}
              {modeFrp ? <Speedometer
                value={frp}
                fontFamily='squada-one'
                size={(h + w) / 3.5}
                max={250}
                step={20}
                noIndicator
                fontFamily='squada-one'
                primaryArcWidth={80}
                accentColor='#991717'
                secondaryArcColor='#ffffff'
                secondaryArcOpacity={0.1}
                rotation={-180}
                noNeedle
              /> : null}
              {modeVfrp ? <Speedometer
                value={vfrp}
                fontFamily='squada-one'
                size={(h + w) / 3.5}
                max={5}
                step={0.5}
                noIndicator
                fontFamily='squada-one'
                primaryArcWidth={80}
                accentColor='#991717'
                secondaryArcColor='#ffffff'
                secondaryArcOpacity={0.1}
                rotation={-180}
                noNeedle
              /> : null}
            </View>

            {modeBatt ? <Text
              style={{
                color: "white",
                fontFamily: 'Facon',
                fontSize: (h + w) / 24,
                position: "absolute",
                left: '36%',
                top: '45%'
              }}
            >
              {batt.toFixed(2)}
            </Text> : null}
            {modeFrp ? <Text
              style={{
                color: "white",
                fontFamily: 'Facon',
                fontSize: (h + w) / 24,
                position: "absolute",
                left: '38%',
                top: '45%'
              }}
            >
              {frp.toFixed(0)}
            </Text> : null}
            {modeVfrp ? <Text
              style={{
                color: "white",
                fontFamily: 'Facon',
                fontSize: (h + w) / 24,
                position: "absolute",
                left: '38%',
                top: '45%'
              }}
            >
              {vfrp.toFixed(2)}
            </Text> : null}


            <View style={{
              backgroundColor: '#0E0E12',
              borderColor: '#1B1B1D',
              width: '35%',
              height: '20%',
              borderWidth: 3,
              borderRadius: 7,
              position: "absolute",
              left: '56%',
              top: '75%'
            }}>
              <Text style={{ color: '#ffffff', fontSize: (h + w) / 22, fontFamily: 'Facon', marginTop: 'auto', marginBottom: 'auto' }}>{speed}</Text>
              <Text style={{ color: '#C07B02', fontSize: (h + w) / 66, fontFamily: 'Facon', marginLeft: 'auto', marginTop: 'auto' }}>Speed </Text>
            </View>
            <TouchableOpacity onPress={clearFunc} style={{ width: '15%', height: '18%', position: "absolute", left: 5, bottom: 5 }}>
              <Image source={require('./assets/img/clear.png')} style={{ width: '100%', height: '100%', position: "absolute", bottom: 5, left: 5 }}></Image>
            </TouchableOpacity>
          </View>
          <View style={{ width: '50%', position: "absolute", height: '100%', right: 0 }}>
            <TouchableOpacity onPress={bluetoothFunc} style={{ width: '10%', height: '10%', position: "absolute", right: 10, top: 10 }}>
              <Image source={require('./assets/img/ble-logo.png')} style={{ width: '100%', height: '100%' }}></Image>
            </TouchableOpacity>
            <View style={{ marginTop: 30, width: '89%' }}>
              <View style={{ position: "relative", width: '100%', height: '13%', marginBottom: 10 }}>
                <Text style={{
                  fontSize: (h + w) / 48,
                  color: '#FFFFFF',
                  fontFamily: 'Times New Roman',
                  textShadowColor: '#ff0000',
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 1,
                  fontFamily: 'Facon',
                  position: "absolute",
                  left: '0%',
                  top: '10%',
                  width:(h + w) / 8
                }}>
                  Battery
                </Text>
                <Text style={{
                  backgroundColor: '#0E0E12',
                  borderColor: '#1B1B1D',
                  width: '35%',
                  height: '100%',
                  borderWidth: 3,
                  borderRadius: 7,
                  fontFamily: 'Facon',
                  color: '#0055FF',
                  position: "absolute",
                  left: '47%',
                  top: '0%',
                  textAlign: 'center',
                  justifyContent: 'center',
                  fontSize: (h + w) / 36,
                  paddingTop: '1%'
                }}>
                  {batt.toFixed(2)}
                </Text>
                <Text style={{
                  width: '15%',
                  height: '100%',
                  fontSize: (h + w) / 38,
                  color: 'white',
                  position: "absolute",
                  right: '0%',
                  textAlign: 'left',
                  fontFamily: 'Times New Roman',
                  textShadowColor: '#ff0000',
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 1,
                }}>v</Text>
              </View>
              <View style={{ position: "relative", width: '100%', height: '13%', marginBottom: 10 }}>
                <Text style={{
                  fontSize: (h + w) / 48,
                  color: '#FFFFFF',
                  fontFamily: 'Times New Roman',
                  textShadowColor: '#ff0000',
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 1,
                  fontFamily: 'Facon',
                  position: "absolute",
                  left: '0%',
                  top: '10%',
                  width:(h + w) / 8
                }}>
                  PEAK FRP
                </Text >
                <Text style={{
                  backgroundColor: '#0E0E12',
                  borderColor: '#1B1B1D',
                  width: '35%',
                  height: '100%',
                  borderWidth: 3,
                  borderRadius: 7,
                  fontFamily: 'Facon',
                  color: '#0055FF',
                  position: "absolute",
                  left: '47%',
                  top: '0%',
                  textAlign: 'center',
                  justifyContent: 'center',
                  fontSize: (h + w) / 36,
                  paddingTop: '1%'
                }}>
                  {parseFloat(peakfrp).toFixed(0)}
                </Text>
                <Text style={{
                  width: '15%',
                  height: '100%',
                  fontFamily: 'Facon',
                  fontSize: (h + w) / 60,
                  color: 'white',
                  position: "absolute",
                  right: '0%',
                  bottom: '0%',
                  textAlign: 'left',
                  textAlignVertical: 'bottom',
                  fontFamily: 'Times New Roman',
                  textShadowColor: '#ff0000',
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 1,
                }}>Mpa</Text>
              </View>
              <View style={{ position: "relative", width: '100%', height: '13%', marginBottom: 10 }}>
                <Text style={{
                  fontSize: (h + w) / 48,
                  color: '#FFFFFF',
                  fontFamily: 'Times New Roman',
                  textShadowColor: '#ff0000',
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 1,
                  fontFamily: 'Facon',
                  position: "absolute",
                  left: '0%',
                  top: '10%',
                  width:(h + w) / 7
                }}>
                  PEAK VFRP
                </Text>
                <Text style={{
                  backgroundColor: '#0E0E12',
                  borderColor: '#1B1B1D',
                  width: '35%',
                  height: '100%',
                  borderWidth: 3,
                  borderRadius: 7,
                  fontFamily: 'Facon',
                  color: '#0055FF',
                  position: "absolute",
                  left: '47%',
                  top: '0%',
                  textAlign: 'center',
                  justifyContent: 'center',
                  fontSize: (h + w) / 36,
                  paddingTop: '1%'
                }}>
                  {peakvfrp.toFixed(2)}
                </Text>
                <Text style={{
                  width: '15%',
                  height: '100%',
                  fontFamily: 'Facon',
                  fontSize: (h + w) / 38,
                  color: 'white',
                  position: "absolute",
                  right: '0%',
                  bottom: '0%',
                  textAlign: 'left',
                  textAlignVertical: 'bottom',
                  fontFamily: 'Times New Roman',
                  textShadowColor: '#ff0000',
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 1,
                }}>v</Text>
              </View>
              <View style={{ position: "relative", width: '100%', height: '13%', marginBottom: 10 }}>
                <Text style={{
                  fontSize: (h + w) / 48,
                  color: '#FFFFFF',
                  fontFamily: 'Times New Roman',
                  textShadowColor: '#ff0000',
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 1,
                  fontFamily: 'Facon',
                  position: "absolute",
                  left: '0%',
                  top: '10%',
                  width:(h + w) / 7
                }}>
                  TOP SPEED
                </Text>
                <Text style={{
                  backgroundColor: '#0E0E12',
                  borderColor: '#1B1B1D',
                  width: '35%',
                  height: '100%',
                  borderWidth: 3,
                  borderRadius: 7,
                  fontFamily: 'Facon',
                  color: '#0055FF',
                  position: "absolute",
                  left: '47%',
                  top: '0%',
                  textAlign: 'center',
                  justifyContent: 'center',
                  fontSize: (h + w) / 36,
                  paddingTop: '1%'
                }}>
                  {topspeed}
                </Text>
                <Text style={{
                  width: '15%',
                  height: '100%',
                  fontFamily: 'Facon',
                  fontSize: (h + w) / 70,
                  color: 'white',
                  position: "absolute",
                  right: '0%',
                  bottom: '0%',
                  textAlign: 'left',
                  textAlignVertical: 'bottom',
                  fontFamily: 'Times New Roman',
                  textShadowColor: '#ff0000',
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 1,
                }}>Km/h</Text>
              </View>
              <View style={{ position: "relative", width: '90%', height: '10%', marginBottom: 10 }}>
                <TouchableOpacity onPress={datalogFunc} style={{
                  marginRight: 'auto',
                  marginLeft: 'auto',
                }}>
                  <Text style={{
                    fontSize: (h + w) / 48,
                    color: '#FFFFFF',
                    fontFamily: 'Times New Roman',
                    textShadowColor: '#0000FF',
                    textShadowOffset: { width: 2, height: 2 },
                    textShadowRadius: 1,
                    fontFamily: 'Facon'
                  }}>
                    DATALOG
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ position: "relative", width: '97%', height: '20%', marginBottom: 10, flexDirection: 'row' }}>
                <Text style={{
                  fontSize: (h + w) / 40,
                  color: '#FFFFFF',
                  fontFamily: 'Times New Roman',
                  textShadowColor: '#0000FF',
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 1,
                  position: "absolute",
                  left: '0%',
                  top: '20%',
                  fontFamily: 'Facon'
                }}>
                  Mode
                </Text>

                <TouchableOpacity onPress={batteryFunc} style={{ width: '20%', height: '80%', position: "absolute", right: '47%', top: '10%' }}>
                  <Image source={require('./assets/img/batt.png')} style={{
                    width: '100%',
                    height: '100%'
                  }} />
                </TouchableOpacity>

                <TouchableOpacity onPress={frpFunc} style={{ width: '20%', height: '100%', position: "absolute", right: '27%', top: '0%' }}>
                  <Image source={require('./assets/img/frp.png')} style={{
                    width: '100%',
                    height: '100%',
                  }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={vfrpFunc} style={{ width: '20%', height: '100%', position: "absolute", right: '5%', top: '0%' }}>
                  <Image
                    source={require('./assets/img/vfrp.png')}
                    style={{
                      width: '100%',
                      height: '100%'
                    }} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={settingFunc} style={{ width: '15%', height: '18%', position: "absolute", right: 5, bottom: 5 }}>
              <Image source={require('./assets/img/setting-logo3.png')} style={{ width: '100%', height: '100%', position: "absolute", bottom: 5, right: 5 }}></Image>
            </TouchableOpacity>
          </View>
        </View>
        <Spinner
          visible={showAlert1}
          textContent={'กำลังค้นหาอุปกรณ์'}
          textStyle={styles.spinnerTextStyle}
        />
      </ImageBackground>

    </>
  );
};

var styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  }
});

export default Dashboard;