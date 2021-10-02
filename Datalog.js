
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
    Dimensions,
    Button
} from 'react-native';


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
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");
const h = window.height;
const w = window.width;
const height1 = window.height;
const width1 = window.width;
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';


const Setting = ({ route }) => {
    const navigation = useNavigation();
    const a = route.params;
    const idperipheral = a.idperipheral;
    // console.log("idperipheral = " + idperipheral);

    function exitFunc() {
        console.log("exitFunc");
        // bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);
        // bleManagerEmitter.removeAllListeners('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);
        
        navigation.navigate("Dashboard");
    }

    function frpFunc() {
        console.log("frpFunc");
    }

    function vfrpFunc() {
        console.log("vfrpFunc");
    }

    function speedFunc() {
        console.log("speedFunc");
    }

    function startFunc() {
        console.log("startFunc");
    }

    function stopFunc() {
        console.log("stopFunc");
    }

    const [batt, setBatt] = useState(0);
    const [frp, setFrp] = useState(0);
    const [vfrp, setVfrp] = useState(0);
    const handleUpdateValueForCharacteristic = (data) => {
        const buffer = Buffer.Buffer.from(data.value);
        // const sensorData = buffer.readUInt8(1, true);
        const datas = buffer.toString();
        const len = datas.indexOf("=");
        // console.log("datalog")
        if (datas.indexOf("IN1=") != -1) {
            setBatt(parseFloat(datas.substring(len + 1, datas.length - 1)));
        } else if (datas.indexOf("IN2=") != -1) {
            setVfrp(parseFloat(datas.substring(len + 1, datas.length - 1)));
        } else if (datas.indexOf("frp=") != -1) {
            setFrp(parseFloat(datas.substring(len + 1, datas.length - 1)));
        }
    }
    useEffect(() => {
        // BleManager.start({ showAlert: false });

        // bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);

        // if (Platform.OS === 'android' && Platform.Version >= 23) {
        //   PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
        //     if (result) {
        //       console.log("Permission is OK");
        //     } else {
        //       PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
        //         if (result) {
        //           console.log("User accept");
        //         } else {
        //           console.log("User refuse");
        //         }
        //       });
        //     }
        //   });
        // }

        bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);
        return (() => {
          console.log('unmount');
          bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);
        })
    }, []);

    return (
        <>
            <ImageBackground source={require('./assets/img/datalog-page/bg.jpg')} style={{ width: '100%', height: '100%' }}>
                {/* HEADER */}
                <Text style={{
                    fontSize: (h + w) / 32,
                    color: '#FFFFFF',
                    textShadowColor: '#0000FF',
                    textShadowOffset: { width: 2, height: 2 },
                    textShadowRadius: 1,
                    fontFamily: 'Facon',
                    position: 'absolute',
                    top: '3%',
                    left: '3%',
                    // backgroundColor: '#ffffff1f',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: 5
                }}>
                    FRP DATALOGGER
                </Text>
                <View style={{
                    position: 'absolute',
                    top: '3%',
                    right: '3%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    width: (h + w) / 6.5,
                    height: (h + w) / 20
                }}>
                    <Text style={{
                        fontSize: (h + w) / 32,
                        color: '#FFFFFF',
                        textShadowColor: '#FF0000',
                        textShadowOffset: { width: 2, height: 2 },
                        textShadowRadius: 1,
                        fontFamily: 'Facon',
                        position: 'absolute',
                        top: '6%',
                        left: '5%'
                    }}>
                        {batt.toFixed(2)}
                    </Text>
                    <Text style={{
                        fontSize: (h + w) / 32,
                        color: '#FFFFFF',
                        textShadowColor: '#FF0000',
                        textShadowOffset: { width: 2, height: 2 },
                        textShadowRadius: 1,
                        fontFamily: 'Facon',
                        position: 'absolute',
                        top: '6%',
                        right: '5%'
                    }}>
                        V
                    </Text>
                </View>
                {/* END HEADER */}


                {/* LEFT MENU */}
                <Text style={{
                    fontSize: (h + w) / 36,
                    color: '#ff0000',
                    textShadowColor: '#000000',
                    textShadowOffset: { width: 2, height: 2 },
                    textShadowRadius: 1,
                    fontFamily: 'Facon',
                    position: 'absolute',
                    top: '20%',
                    left: '5%'
                }}>
                    EN/DIS
                </Text>

                <TouchableOpacity onPress={frpFunc} style={{
                    position: 'absolute',
                    top: '35%',
                    left: '7%'
                }}>
                    <Text style={{
                        fontSize: (h + w) / 36,
                        color: '#FFFFFF',
                        textShadowColor: '#FF0000',
                        textShadowOffset: { width: 2, height: 2 },
                        textShadowRadius: 1,
                        fontFamily: 'Facon',
                        width:(h + w) / 14
                    }}>
                        FRP
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={vfrpFunc} style={{
                    position: 'absolute',
                    top: '50%',
                    left: '7%'
                }}>
                    <Text style={{
                        fontSize: (h + w) / 36,
                        color: '#FFFFFF',
                        textShadowColor: '#FF0000',
                        textShadowOffset: { width: 2, height: 2 },
                        textShadowRadius: 1,
                        fontFamily: 'Facon',
                        width:(h + w) / 10
                    }}>
                        VFRP
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={speedFunc} style={{
                    position: 'absolute',
                    top: '65%',
                    left: '7%'
                }}>
                    <Text style={{
                        fontSize: (h + w) / 36,
                        color: '#FFFFFF',
                        textShadowColor: '#FF0000',
                        textShadowOffset: { width: 2, height: 2 },
                        textShadowRadius: 1,
                        fontFamily: 'Facon',
                        width:(h + w) / 9
                    }}>
                        SPEED
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={startFunc} style={{
                    width: '8%',
                    height: '18%',
                    position: 'absolute',
                    top: '80%',
                    left: '5%'
                }}>
                    <Image source={require('./assets/img/datalog-page/bt-play.png')} style={{ width: '100%', height: '100%' }}></Image>
                </TouchableOpacity>

                <TouchableOpacity onPress={stopFunc} style={{
                    width: '8%',
                    height: '18%',
                    position: 'absolute',
                    top: '80%',
                    left: '15%'
                }}>
                    <Image source={require('./assets/img/datalog-page/bt-stop.png')} style={{ width: '100%', height: '100%' }}></Image>
                </TouchableOpacity>
                {/* EXIT LEFT MENU */}


                {/* EXIT BUTTON */}
                <TouchableOpacity onPress={exitFunc} style={{
                    position: 'absolute',
                    bottom: '3%',
                    right: '3%'
                }}>
                    <Text style={{
                        fontSize: (h + w) / 36,
                        color: '#FFFFFF',
                        textShadowColor: '#0000FF',
                        textShadowOffset: { width: 2, height: 2 },
                        textShadowRadius: 1,
                        fontFamily: 'Facon'
                    }}>
                        EXIT
                    </Text>
                </TouchableOpacity>
                {/* END EXIT BUTTON */}
            </ImageBackground>

        </>
    );
}

export default Setting;
