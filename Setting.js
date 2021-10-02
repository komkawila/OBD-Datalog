
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
// import { Overlay } from 'react-native-elements';
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
    const a = route.params;
    // console.log("SETTING SCREEN = ");
    // console.log(a);
    const [modetype, setModetype] = useState(a.modetype);
    const [alertBatt, setAlertBatt] = useState(a.alertBatt);
    const [alertFrp, setAlertFrp] = useState(a.alertFrp);
    const [alertVFrp, setAlertVfrp] = useState(a.alertVFrp);
    const idperipheral = a.idperipheral;
    console.log("idperipheral = " + idperipheral);
    const navigation = useNavigation();

    const [slideBatt, setSlideBatt] = useState(parseFloat(a.alertBatt));
    const [slideFrp, setSlideFrp] = useState(parseFloat(a.alertFrp));
    const [slideVFrp, setSlideVFrp] = useState(parseFloat(a.alertVFrp));
    function exitFunc() {
        console.log("exitFunc");
        navigation.navigate("Dashboard");
        // navigation.navigate("Dashboard", {
        //     modetype: modetype,
        //     alertBatt: alertBatt,
        //     alertFrp: alertFrp,
        //     alertVFrp: alertVFrp
        // });
    }
    
    const SENDCOMMAND = (e) => {
        var service = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
        var bakeCharacteristic = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
        var crustCharacteristic = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
        const str = stringToBytes(e);
        console.log("SENDCOMMAND");
        console.log(idperipheral);
        BleManager.write(idperipheral, service, crustCharacteristic, str)
            .then(() => {
                console.log("Write: ");
            })
            .catch((error) => {
                console.log("error");
                console.log(error);
            });
    }

    const battFunc = (e) => {
        setSlideBatt(e);
        SENDCOMMAND("AT+BAT=" + e.toFixed(2));
    }

    const frpFunc = (e) => {
        setSlideFrp(e);
        SENDCOMMAND("AT+FRP=" + e);
    }

    const vfrpFunc = (e) => {
        setSlideVFrp(e);
        SENDCOMMAND("AT+VFRP=" + e.toFixed(2));
    }

    const modetype1Func = () => {
        SENDCOMMAND("AT+MTYPE=0");
        setModetype(0);
    }
    const modetype2Func = () => {
        SENDCOMMAND("AT+MTYPE=1");
        setModetype(1);
    }


    return (
        <>
            <ImageBackground source={require('./assets/img/setting-page/bg.jpg')} style={{ width: '100%', height: '100%' }}>
                {/* <Text>fdfdfdf</Text>
                <Button onPress={() => navigation.navigate("Dashboard")} title="1234"></Button> */}
                <View style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <View style={{ position: 'absolute', width: '40%', height: '100%', left: 0 }}>
                        <Text style={{
                            fontSize: (h + w) / 32,
                            color: '#FFFFFF',
                            textShadowColor: '#FF0000',
                            textShadowOffset: { width: 2, height: 2 },
                            textShadowRadius: 1,
                            fontFamily: 'Facon',
                            position: 'absolute',
                            top: '5%',
                            left: '10%'
                        }}>
                            SETTING
                        </Text>
                        <Text style={{
                            fontSize: (h + w) / 36,
                            color: '#FFFFFF',
                            textShadowColor: '#FF0000',
                            textShadowOffset: { width: 2, height: 2 },
                            textShadowRadius: 1,
                            fontFamily: 'Facon',
                            position: 'absolute',
                            top: '25%',
                            left: '5%'
                        }}>
                            VOLT ALARM
                        </Text>
                        <Text style={{
                            fontSize: (h + w) / 36,
                            color: '#FFFFFF',
                            textShadowColor: '#FF0000',
                            textShadowOffset: { width: 2, height: 2 },
                            textShadowRadius: 1,
                            fontFamily: 'Facon',
                            position: 'absolute',
                            top: '40%',
                            left: '5%'
                        }}>
                            FRP ALARM
                        </Text>
                        <Text style={{
                            fontSize: (h + w) / 36,
                            color: '#FFFFFF',
                            textShadowColor: '#FF0000',
                            textShadowOffset: { width: 2, height: 2 },
                            textShadowRadius: 1,
                            fontFamily: 'Facon',
                            position: 'absolute',
                            top: '55%',
                            left: '5%'
                        }}>
                            VFRP ALARM
                        </Text>
                        <Text style={{
                            fontSize: (h + w) / 36,
                            color: '#FFFFFF',
                            textShadowColor: '#FF0000',
                            textShadowOffset: { width: 2, height: 2 },
                            textShadowRadius: 1,
                            fontFamily: 'Facon',
                            position: 'absolute',
                            top: '70%',
                            left: '5%'
                        }}>
                            MODE TYPE
                        </Text>
                    </View>
                    <View style={{ position: 'absolute', width: '60%', height: '100%', right: 0 }}>

                        <TouchableOpacity onPress={exitFunc} style={{
                            position: 'absolute',
                            bottom: '5%',
                            right: '5%'
                        }}>
                            <Text style={{
                                fontSize: (h + w) / 36,
                                color: '#FFFFFF',
                                fontFamily: 'Times New Roman',
                                textShadowColor: '#0000FF',
                                textShadowOffset: { width: 2, height: 2 },
                                textShadowRadius: 1,
                                fontFamily: 'Facon'
                            }}>
                                EXIT
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={modetype1Func} style={{
                            position: 'absolute',
                            top: '70%',
                            left: '10%'
                        }}>
                            <Text style={{
                                fontSize: (h + w) / 36,
                                color: '#FFFFFF',
                                fontFamily: 'Times New Roman',
                                textShadowColor: '#0000FF',
                                textShadowOffset: { width: 2, height: 2 },
                                textShadowRadius: 1,
                                fontFamily: 'Facon'
                            }}>
                                1
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={modetype2Func} style={{
                            position: 'absolute',
                            top: '70%',
                            left: '30%'
                        }}>
                            <Text style={{
                                fontSize: (h + w) / 36,
                                color: '#FFFFFF',
                                fontFamily: 'Times New Roman',
                                textShadowColor: '#0000FF',
                                textShadowOffset: { width: 2, height: 2 },
                                textShadowRadius: 1,
                                fontFamily: 'Facon'
                            }}>
                                2
                            </Text>
                        </TouchableOpacity>

                        {/* SLIDER 1 */}
                        <View style={{
                            position: 'absolute',
                            top: '30%',
                            left: '0%',
                            width: '50%'
                        }}>
                            <Slider
                                minimumValue={0}
                                maximumValue={12}
                                value={slideBatt}
                                step={1}
                                minimumTrackTintColor="#FFFFFF"
                                maximumTrackTintColor="#000000"
                                onValueChange={battFunc}
                            />
                        </View>
                        <Text style={{
                            fontSize: (h + w) / 36,
                            color: '#FFFFFF',
                            fontFamily: 'Times New Roman',
                            textShadowColor: '#0000FF',
                            textShadowOffset: { width: 2, height: 2 },
                            textShadowRadius: 1,
                            fontFamily: 'Facon',
                            position: 'absolute',
                            top: '25%',
                            right: '40%'
                        }}>
                            {slideBatt}
                        </Text>

                        <Text style={{
                            fontSize: (h + w) / 36,
                            color: '#FFFFFF',
                            fontFamily: 'Times New Roman',
                            textShadowColor: '#FF0000',
                            textShadowOffset: { width: 2, height: 2 },
                            textShadowRadius: 1,
                            position: 'absolute',
                            top: '25%',
                            right: '10%'

                        }}>
                            V
                        </Text>

                        {/* SLIDER 2 */}
                        <View style={{
                            position: 'absolute',
                            top: '45%',
                            left: '0%',
                            width: '50%'
                        }}>
                            <Slider
                                minimumValue={160}
                                maximumValue={240}
                                value={slideFrp}
                                step={10}
                                minimumTrackTintColor="#FFFFFF"
                                maximumTrackTintColor="#000000"
                                onValueChange={frpFunc}
                            />
                        </View>
                        <Text style={{
                            fontSize: (h + w) / 36,
                            color: '#FFFFFF',
                            fontFamily: 'Times New Roman',
                            textShadowColor: '#0000FF',
                            textShadowOffset: { width: 2, height: 2 },
                            textShadowRadius: 1,
                            fontFamily: 'Facon',
                            position: 'absolute',
                            top: '40%',
                            right: '35%'
                        }}>
                            {slideFrp}
                        </Text>
                        <Text style={{
                            fontSize: (h + w) / 36,
                            color: '#FFFFFF',
                            fontFamily: 'Times New Roman',
                            textShadowColor: '#FF0000',
                            textShadowOffset: { width: 2, height: 2 },
                            textShadowRadius: 1,
                            position: 'absolute',
                            top: '40%',
                            right: '10%'

                        }}>
                            MPa
                        </Text>
                        {/* SLIDER 3 */}
                        <View style={{
                            position: 'absolute',
                            top: '60%',
                            left: '0%',
                            width: '50%'
                        }}>
                            <Slider
                                minimumValue={3.2}
                                maximumValue={5}
                                step={0.1}
                                value={slideVFrp}
                                minimumTrackTintColor="#FFFFFF"
                                maximumTrackTintColor="#000000"
                                onValueChange={vfrpFunc}
                            />
                        </View>

                        <Text style={{
                            fontSize: (h + w) / 36,
                            color: '#FFFFFF',
                            fontFamily: 'Times New Roman',
                            textShadowColor: '#0000FF',
                            textShadowOffset: { width: 2, height: 2 },
                            textShadowRadius: 1,
                            fontFamily: 'Facon',
                            position: 'absolute',
                            top: '55%',
                            right: '34%'
                        }}>
                            {slideVFrp.toFixed(2)}
                        </Text>
                        <Text style={{
                            fontSize: (h + w) / 36,
                            color: '#FFFFFF',
                            fontFamily: 'Times New Roman',
                            textShadowColor: '#FF0000',
                            textShadowOffset: { width: 2, height: 2 },
                            textShadowRadius: 1,
                            position: 'absolute',
                            top: '55%',
                            right: '10%'

                        }}>
                            V
                        </Text>

                        {/* MODE TYPE */}
                        <Text style={{
                            fontSize: (h + w) / 36,
                            color: '#FFFFFF',
                            fontFamily: 'Times New Roman',
                            textShadowColor: '#0000FF',
                            textShadowOffset: { width: 2, height: 2 },
                            textShadowRadius: 1,
                            fontFamily: 'Facon',
                            position: 'absolute',
                            top: '70%',
                            right: '34%'
                        }}>
                            {parseInt(modetype) + 1}
                        </Text>
                    </View>


                </View>
            </ImageBackground>

        </>
    );
}

export default Setting;
