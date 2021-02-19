import React,{useState,useEffect} from 'react';
import { Text, View, Image, StyleSheet,TouchableOpacity,Modal,Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

export default function UsuariosModel({
	id,
    usuario,
    email,
    pass,
    nivel,
    filter
    }) {
        const [visible,setVisible] = useState(false);
        const [newUser,setNewUser] = useState();
        const [newPass,setNewPass] = useState();
        const [newLevel,setNewLevel] = useState();
        const [mostrar, setMostrar] = useState(false); 
        
        const verifFilter = (x) => {
            if(filter === ''){
                setMostrar(true);
            }else{
                var y = x.toUpperCase();
                var exists = y.includes(filter.toUpperCase());
                setMostrar(exists);
            }
            
        }
        useEffect(()=> {
            verifFilter(usuario);
        })
        const trigger = (mail) => {
            const data = new FormData();
            data.append('email', mail);
            fetch('http://dtai.uteq.edu.mx/~alalui186/awi4/ws/integradora/delete_user', {
                method: 'POST',
                body: data
            }).catch(error => console.log(error));
        }
        const guardarContacto = (mail) => {
            let valido = verifDatos();
            if(valido){
                if(newLevel == 1 || newLevel == 2){
                    const data = new FormData();
                    data.append('user', newUser);
                    data.append('email', mail);
                    data.append('pass', newPass);
                    data.append('level', newLevel);
                    fetch('http://dtai.uteq.edu.mx/~alalui186/awi4/ws/integradora/update_user', {
                        method: 'POST',
                        body: data
                    })
                    .then(response => response.json())
                    .then(respJson => {
                            console.log(respJson);
                        })
                    .catch(error => console.log(error));
                    setVisible(false);
                }else{
                    setNewLevel('');
                    Alert.alert(
                        'Advertencia',
                        'El nivel de usuario tiene que ser 1 o 2\n*El 1 tiene mas derechos que el 2',
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
              
            }else{
              Alert.alert(
                'Advertencia',
                'Los campos no pueden estar vacios',
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
        const verifDatos = () => {
            let valido = true;
            if(newLevel == ''){
              valido = false;
            }
            if(newPass == ''){
              valido = false;
            }
            if(newUser == ''){
              valido = false;
            }
            return valido;
          }
        const datosIni = () => {
            setNewLevel(nivel);
            setNewPass(pass);
            setNewUser(usuario);
          }
	return (
    <View>
        {mostrar ? (
		<View style={styles.row}>
			<View style={styles.col}>
				<Text style={styles.nota}>{usuario}</Text>
                <Text style={styles.subtitulo}>{pass}</Text>
                <View style={styles.col}>
                    <Text style={styles.dir}>{email}</Text>
                    <Text style={styles.tel}>Nivel: {nivel}</Text>
                </View>
			</View>
            <Modal animationType={"slide"} transparent={true} visible={visible}>
              <View style={styles.modalStyle}>
                <Text style={styles.titulo}>Ingresa los nuevos datos</Text>
                <View style={styles.inputs}>
                    <TextInput style={styles.inputTXT} keyboardType={"default"} placeholder='Usuario' onChangeText={(text) => setNewUser(text)} value={newUser}/>
                    <TextInput style={styles.inputTXT} keyboardType={"default"} placeholder='Contraseña' onChangeText={(text) => setNewPass(text)} value={newPass}/> 
                    <TextInput style={styles.inputTXT} keyboardType={"numeric"} placeholder='Nivel de usuario' onChangeText={(text) => setNewLevel(text)} value={newLevel}/>
                </View>
                <View style={styles.viewHori}>
                  <TouchableOpacity style={styles.btnCancel} onPress={()=>{setVisible(false)}}>
                      <Text style={{fontSize: 30,color: '#4D4D4D'}}>Cancelar </Text>
                      <Image source={require('../assets/images/cruzar.png')} style={styles.cancelImg}/>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnCancel} onPress={()=>{guardarContacto(email)}}>
                      <Text style={{fontSize: 30,color: '#4D4D4D'}}>Guardar </Text>
                      <Image source={require('../assets/images/bien.png')} style={styles.cancelImg}/>
                  </TouchableOpacity>                
                </View>
              </View>
            </Modal>
              <View style={styles.iconos}>
                <TouchableOpacity style={styles.to} onPress={()=>{trigger(email)}}>
                    <Image source={require('../assets/images/basura.png')} style={styles.imgicon}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.to} onPress={()=>{setVisible(true),datosIni()}}>
                    <Image source={require('../assets/images/lapiz.png')} style={styles.imgicon}/>
                </TouchableOpacity>
              </View>    
		</View>
    ) : (
      <Text></Text>
  )}
</View>
    );
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
		flexDirection: 'row',
        backgroundColor: '#AED6F1',
        paddingHorizontal: 20,
        paddingTop: 20,
        marginBottom: 20,
        borderRadius: 5,
        borderColor: '#2E86C1',
        borderWidth: 3
    },
    col:{
        flex: 7,
        flexDirection: 'column',
        marginBottom: 5,
        paddingHorizontal: 5
    },
    row2:{
        flex: 2,
        flexDirection: 'row',
        padding: 3,
    },
    nota: {
        fontSize: 20,
        padding: 5,
        color: "#505050",
    },
    
    subtitulo:{
        fontSize: 16,
        padding: 5,
        color: "#505050",
        fontStyle: 'italic',
    },
    dir:{
        fontSize: 14,
        flex: 5,
        justifyContent: 'flex-start',
        alignContent: 'center',
        color: '#606060',
        borderBottomColor: '#2E86C1',
        borderBottomWidth: 1
    },
    tel: {
        fontSize: 12,
        justifyContent: 'flex-start',
        alignContent: 'center',
        fontStyle: 'italic',
        color: '#606060'
    },
    iconos: {
        flex: 1,
        justifyContent: 'flex-end',
        alignContent: 'flex-end',
        alignItems: 'flex-end',
        flexDirection: 'row',
        marginBottom: 10
    },
    to:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgicon:{
        width: 40,
        height: 20,
        resizeMode: 'contain',
    },
    modalStyle:{
        flex : 1,
        paddingHorizontal: 30,
        paddingVertical: 30,
        backgroundColor: '#D9D9D9',
      },
      inputs:{
        flex: 10,
        padding: 5,
        backgroundColor: '#ffffff',
        borderWidth: 1.5,
        borderRadius: 5,
        borderColor: '#898989',
        justifyContent: 'space-evenly',
      },
      inputTXT:{
        padding: 5,
        backgroundColor: '#F6F6F6',
      },
      btnCancel:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
      },
      titulo: {
        flex: 1,
        textAlign: "center",
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
        fontSize: 27,
        color: '#606060',
        marginBottom: 10,
      },
      viewHori:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
      },
      cancelImg:{
        width: 25,
        height: 25,
        resizeMode: 'contain',
        justifyContent: 'center',
        alignItems: 'center',
      },
});