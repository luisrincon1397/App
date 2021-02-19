import React, {useState, useEffect} from 'react';
import {ActivityIndicator, StyleSheet, View, Text, Image, Button, TextInput, Alert, ScrollView, TouchableOpacity,Dimensions,AsyncStorage} from 'react-native';

export default function LoginScreen({route,navigation}){
    const [usuario,setUsuario] =useState('');
    const [contra,setContra] =useState('');
    const [nvlUser,setNvlUser] = useState(2);
    const [nom,setNom] = useState('');
    var timer;
    const [tr,setTr] = useState(0);

    useEffect(()=>{
        if(tr > 0){
            const data = new FormData();
            data.append('email', usuario);
            data.append('pass', contra);
            fetch('http://dtai.uteq.edu.mx/~alalui186/awi4/ws/integradora/user_login', {
            method: 'POST',
                body: data
            })
            .then(response => response.json())
            .then(respJson => {
                if(respJson["result"] == true){
                    let var1 = respJson["user"][0]["user"];
                    let var2 = respJson["user"][0]["level"]
                    _storeUsuario(var1);
                    _storeNvlUsuario(var2);
                    timer = setTimeout(() => {
                        navigation.navigate('Root')
                    }, 100); 
                }else{
                    Alert.alert(
                        'Advertencia',
                        'El usuario no existe',
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
                
            })
            .catch(error => console.log(error));
        }
    },[tr]);

    const login = () => {
        if(usuario !== '' && contra !== ''){
            setTr(tr + 1);
            /*
            
            */
        }else{
            Alert.alert(
                'Advertencia',
                'Ingrese los datos',
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
    const _storeUsuario = async (user) => {
        try {
            await AsyncStorage.setItem('user', user);
        } catch (error) {
            console.log(error);
        }
    }
    const _storeNvlUsuario = async (nvl) => {
        try {
            await AsyncStorage.setItem('nvl', nvl.toString());
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <ScrollView style={styles.container}>
            <View style={styles.pdvContainer}>
            <Image source={require('../assets/images/pdv.png')} style={styles.welcomeImage}/>
                <Text style={styles.titulo}>Inicia sesion para continuar {nom}</Text>
            </View>
            <View style={styles.codeHighlightContainer}>
                    <Text style={styles.subtitulo}>Usuario</Text>
                    <TextInput style={styles.texto} keyboardType={"email-address"} onChangeText={(text) => setUsuario(text)} value={usuario}/>
                    <Text style={styles.subtitulo}>Contraseña</Text>
                    <TextInput secureTextEntry={true} style={styles.texto} keyboardType={"default"} onChangeText={(text) => setContra(text)} value={contra}/>  
            </View>
            <View style={styles.codeHighlightContainer2}>
                <TouchableOpacity style={{flex: 1,flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}} onPress={()=>{login()}}>
                    <Text style={{fontSize: 30,color: '#4D4D4D'}}>Iniciar Sesion </Text>
                    <Image source={require('../assets/images/iniciar-sesion.png')} style={styles.alertimage}/>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E5E5',
    },
    codeHighlightContainer2: {
      marginTop: 50,
      marginBottom: 20,
      padding: 10,
      backgroundColor: '#D9D9D9',
      borderRadius: 3,
      paddingHorizontal: 4,
      flexDirection: 'column',  
    },
    codeHighlightContainer: {
        marginTop: 20,
        backgroundColor: '#D9D9D9',
        flexDirection: 'column',
        borderBottomColor: '#898989',
        borderTopColor: '#DDDDDD',
        borderRightColor: '#D9D9D9',
        borderLeftColor: '#D9D9D9',
        borderWidth: 1.5,
        padding: 10
      },
    titulo: {
        flex: 2,
        textAlign: "center",
        fontSize: 21,
        color: '#606060',
        marginBottom: 5
      },
    subtitulo:{
        textAlign: "left",
        fontSize: 22,
        color: '#4D4D4D',
        padding: 5,
    },
    alertimage:{
        width: 50,
        height: 40,
        resizeMode: 'contain',
        justifyContent: 'center',
        alignItems: 'center',
      },
      texto:{
        padding: 5,
        backgroundColor: '#F6F6F6',
        fontSize: 20,
      },
      pdvContainer: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20,
        paddingHorizontal: 50
    },
    welcomeImage: {
        width: 150,
        height: 120,
        resizeMode: 'contain',
        flex: 1,
        justifyContent: 'center'
      },
  });