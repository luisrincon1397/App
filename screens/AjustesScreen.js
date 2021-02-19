import React,  { useState, useEffect } from 'react';
import {Text,View,StyleSheet,Dimensions,Image,TouchableOpacity,ScrollView,Alert,AsyncStorage, PermissionsAndroid,Modal} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import MapView,{ PROVIDER_GOOGLE } from 'react-native-maps';
export default function AjustesScreen({navigation}) {
    const [newPulse,setNewPulse] = useState('');
    const [newTemp,setNewTemp] = useState('');
    const [pulse,setPulse] = useState(81.6);
    const [temp,setTemp] = useState(36.5);
    const [lat,setLat] = useState();
    const [long,setLong] = useState();
    const [nvlUsuario,setNvlUsuario] = useState(2);
    const [cont,setCont] =useState(0);
    var timer;
    const _retrieveNvl = async () => {
        try {
            const value = await AsyncStorage.getItem('nvl');
            if (value !== null) {
                setNvlUsuario(parseInt(value));
            }else{
              navigation.navigate('Login');
            }
        } catch (error) {
            console.log(error);
            navigation.navigate('Login');
        }
      }

    useEffect(() => {
        timer = setTimeout(() => {
          setCont(cont + 1);
        }, 1000);
          _retrieveNvl();
    },[cont]);

    const getGeo = async () => {
        let status = await Permissions.askAsync(Permissions.LOCATION);
        if(status["status"] == 'granted'){
            let location = await Location.getCurrentPositionAsync({});
            setLat(location["coords"]["latitude"]);
            setLong(location["coords"]["longitude"]);
            guardarPos(location["coords"]["latitude"],location["coords"]["longitude"]);
            Alert.alert(
                'Advertencia',
                'La ubicación se guardó exitosamente.',
                [
                    {
                        text: 'Ok',
                        onPress: null,
                        style: 'cancel'
                    }
                ],
                {cancelable: false}
            );
        }else{
            console.log(status["status"]);
            Alert.alert(
                'Advertencia',
                'No se concedieron los permisos',
                [
                    {
                        text: 'Ok',
                        onPress: null,
                        style: 'cancel'
                    }
                ],
                {cancelable: false}
            );
        }
    }

    const guardarPos = (lt, ln) => {
        if(lat !== '' && long !== ''){
            const data = new FormData();
            data.append('lng', ln);
            data.append('lat', lt);
            fetch('http://dtai.uteq.edu.mx/~alalui186/awi4/ws/integradora/insert_gps', {
                method: 'POST',
                body: data
            }).catch(error => console.log(error),
            Alert.alert(
                'Advertencia',
                'Hubo un error, intenta de nuevo',
                [
                    {
                        text: 'Ok',
                        onPress: null,
                        style: 'cancel'
                    }
                ],
                {cancelable: false}
            )
            );
            fetch('http://dtai.uteq.edu.mx/~saldon186/awi/pulsos_de_vida/pulsos/pulsosd/insert_gps', {
                method: 'POST',
                body: data
            }).catch(error => console.log(error),
            );
        }else{
            Alert.alert(
                'Advertencia',
                'Hubo un error, intenta de nuevo',
                [
                    {
                        text: 'Ok',
                        onPress: null,
                        style: 'cancel'
                    }
                ],
                {cancelable: false}
            );
        }
    }

    useEffect(() => {
        _retrieveDataPulsoNew();
        _retrieveDataTempNew();
    },[])
    const guardarPulse = () =>{
        if(newPulse <= 50 || newPulse >= 100 || newPulse === ''){
            Alert.alert(
                'Advertencia',
                'Ingresa un valor adecuado\n\nDebe ser mayor a 50 y menor a 100',
                [
                    {
                        text: 'Ok',
                        onPress: null,
                        style: 'cancel'
                    }
                ],
                {cancelable: false}
            );
        }else{
            setPulse(newPulse);
            _storeDataPulso(newPulse);
            setNewPulse('');   
        }
    }
    const guardarTemp = () =>{
        if(newTemp <= 32 || newTemp >= 38 || newTemp === ''){
            Alert.alert(
                'Advertencia',
                'Ingresa un valor adecuado\n\nDebe ser mayor a 32 y menor a 38',
                [
                    {
                        text: 'Ok',
                        onPress: null,
                        style: 'cancel'
                    }
                ],
                {cancelable: false}
            );
        }else{
            setTemp(newTemp);
            _storeDataTemp(newTemp);
            setNewTemp('');
        }
    }
    const _storeDataPulso = async (dato) => {
        try {
            await AsyncStorage.setItem('pulso', dato);
        } catch (error) {
            console.log(error);
        }
    }
    const _storeDataTemp = async (dato) => {
        try {
            await AsyncStorage.setItem('temp', dato);
        } catch (error) {
            console.log(error);
        }
    }
    const _retrieveDataPulsoNew = async () => {
        try {
            const value = await AsyncStorage.getItem('pulso');
            if (value !== null) {
                setPulse(value);
            }
        } catch (error) {
            console.log(error);
            setPulse(80);
        }
    }
    const _retrieveDataTempNew = async () => {
        try {
            const value = await AsyncStorage.getItem('temp');
            if (value !== null) {
                setTemp(value);
            }
        } catch (error) {
            console.log(error);
            setTemp(36);
        }
    }
    const logoff = () => {
        _deleteUser();
        navigation.navigate('Login');
    }
    const users = () => {
        navigation.navigate('Usuarios');
    }
    const _deleteUser = async () =>{
        try {
            await AsyncStorage.setItem('user', '');
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <ScrollView style={styles.container}>
            <View style={styles.pdvContainer}>
                <Text style={styles.titulo}>Aqui puedes configurar la temperatura normal y el ritmo cardiaco normal del usuario.</Text>
            </View>
            <View style={styles.codeHighlightContainer}>
                <View style={styles.itemsVertical}>
                    <View style={styles.rowDiv}>
                        <Text style={styles.subtitulo}>Ritmo cardiaco normal</Text>
                        <Image source={require('../assets/images/ajustespulso.png')} style={styles.okimage}/>
                    </View>
                    <Text style={styles.hint}>Actual: <Text  style={styles.hintvalor}>{pulse}</Text></Text>
                    <View style={styles.viewHori}>
                        <TextInput style={styles.texto} keyboardType={"numeric"} placeholder='Cambiar' onChangeText={(text) => setNewPulse(text)} value={newPulse}/> 
                        <TouchableOpacity style={styles.btn} onPress={()=>guardarPulse()}><Text style={styles.btntexto}> Guardar</Text></TouchableOpacity>
                    </View>
                    
                </View>
            </View>
            <View style={styles.codeHighlightContainer}>
                <View style={styles.itemsVertical}>
                    <View style={styles.rowDiv}>
                        <Text style={styles.subtitulo}>Temperatura normal</Text>
                        <Image source={require('../assets/images/ajustestemp.png')} style={styles.okimage}/>
                    </View>
                    <Text style={styles.hint}>Actual: <Text  style={styles.hintvalor}>{temp}</Text></Text>
                    <View style={styles.viewHori}>
                        <TextInput style={styles.texto} keyboardType={"numeric"} placeholder='Cambiar' onChangeText={(text) => setNewTemp(text)} value={newTemp}/> 
                        <TouchableOpacity style={styles.btn} onPress={()=>guardarTemp()}><Text style={styles.btntexto}> Guardar</Text></TouchableOpacity>
                    </View>
                </View>
            </View>
            {nvlUsuario == 1 ? (
                <View style={styles.codeHighlightContainer2}>
                <TouchableOpacity style={{flex: 1,flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}} onPress={()=>{getGeo()}}>
                    <Image source={require('../assets/images/mapa.png')} style={styles.alertimage}/>
                    <Text style={{fontSize: 30,color: '#4D4D4D'}}> Guardar ubicacion</Text>
                </TouchableOpacity>
            </View>
            ) : (
                <View></View>
            )}
            {nvlUsuario == 1 ? (
            <View style={styles.codeHighlightContainer2}>
                <TouchableOpacity style={{flex: 1,flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}} onPress={()=>{users()}}>
                    <Image source={require('../assets/images/usuario.png')} style={styles.alertimage}/>
                    <Text style={{fontSize: 30,color: '#4D4D4D'}}> Administrar usuarios</Text>
                </TouchableOpacity>
            </View>
            ) : (
                <View></View>
            )}
            
            <View style={styles.codeHighlightContainer2}>
                <TouchableOpacity style={{flex: 1,flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}} onPress={()=>{logoff()}}>
                    <Image source={require('../assets/images/cerrar-sesion.png')} style={styles.alertimage}/>
                    <Text style={{fontSize: 30,color: '#4D4D4D'}}> Cerrar Sesion</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E5E5',
    },
    codeHighlightContainer2: {
      marginTop: 50,
      padding: 10,
      backgroundColor: '#D9D9D9',
      borderRadius: 3,
      paddingHorizontal: 4,
      flexDirection: 'column',  
    },
    codeHighlightContainer: {
        marginTop: 20,
        backgroundColor: '#D9D9D9',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        alignContent: 'center',
        flexDirection: 'column',
        borderBottomColor: '#898989',
        borderTopColor: '#DDDDDD',
        borderRightColor: '#D9D9D9',
        borderLeftColor: '#D9D9D9',
        borderWidth: 1.5,
      },
    titulo: {
        flex: 2,
        textAlign: "center",
        fontSize: 21,
        color: '#606060',
        marginBottom: 5
      },
    subtitulo:{
        textAlign: "center",
        fontSize: 20,
        marginBottom: 10,
        color: '#4D4D4D',
    },
    nombre:{
      color: '#2e78b7',
    },
    itemsVertical:{
        marginLeft: 30,
        marginRight: 30,
        textAlign: 'left',
        flex: 2,
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        alignItems: 'flex-start',
    },
    hint:{
        textAlign: "center",
        fontSize: 15,
        marginTop: 10,
        color: '#606060'
    },
    hintvalor:{
        textAlign: "center",
        fontSize: 15,
        marginTop: 10,
        color: '#015FAC',
        fontWeight: 'bold'
    },
    alertimage:{
        width: 50,
        height: 40,
        resizeMode: 'contain',
        justifyContent: 'center',
        alignItems: 'center',
      },
      texto:{
        borderColor:'#E4E4E4',
        borderWidth:1,
        padding: 5, 
        width: 250,
        backgroundColor: '#ffffff',
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5
      },
      viewHori:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 20,
        marginBottom: 20,
      },
      pdvContainer: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20,
        paddingHorizontal: 50
        },
        rowDiv:{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
            marginTop: 10
          },
          okimage:{
            flex: 1,
            width: 80,
            height: 60,
            resizeMode: 'contain',
            flex: 1,
            justifyContent: 'center'
          },
          btn: {
              paddingHorizontal: 5,
              backgroundColor:'#3D78FF',
              flex: 1,
              borderBottomRightRadius: 5,
              borderTopRightRadius: 5
          },
          btn2:{
            paddingHorizontal: 5,
            marginHorizontal: 2,
            backgroundColor:'#3D78FF',
            flex: 3,
          },
          btntexto:{
            fontSize: 15,
            color: '#EDEDED', 
            flex:1,
            justifyContent: 'center',
            textAlignVertical: 'center',
            marginVertical: 10
          },
          viewHori2:{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 20,
            paddingHorizontal: 20,
            textAlign: 'center'
          }
  });