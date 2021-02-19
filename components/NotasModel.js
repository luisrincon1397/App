import React, { useEffect,useState } from 'react';
import { Text, View, Image, StyleSheet,TouchableOpacity,Modal,Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
export default function NotasModel({
	id,
	fecha,
    nota,
    nvlUser,
    filter
    }) {
        const [visible,setVisible] = useState(false);
        const [newNota,setNewNota] = useState();
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
            verifFilter(nota);
        })
        const trigger = (note) => {
            const data = new FormData();
            data.append('idnota', note);
            fetch('http://dtai.uteq.edu.mx/~alalui186/awi4/ws/integradora/borrar_nota', {
                method: 'POST',
                body: data
            }).catch(error => console.log(error));
        }
        const trigger2 = (newNote,idnote,datenote) => {
            if(newNote !== ''){
                const data = new FormData();
                data.append('idnota', idnote);
                data.append('nota', newNote);
                data.append('fecha', datenote);
                fetch('http://dtai.uteq.edu.mx/~alalui186/awi4/ws/integradora/modificar_nota', {
                    method: 'POST',
                    body: data
                }).catch(error => console.log(error));
                setVisible(false)
            }else{
                Alert.alert(
                    'Advertencia',
                    'Ingresa un valor adecuado\n\nLa nota esta vacia',
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
	return (
        <View>
        {mostrar ? (
		<View style={styles.row}>
        <Modal animationType={"slide"} transparent={true} visible={visible}>
              <View style={styles.modalStyle}>
                <Text style={styles.titulo}>Nuevo texto: </Text>
                <TextInput style={styles.texto} keyboardType={"default"} placeholder={nota} onChangeText={(text) => setNewNota(text)} value={newNota}/> 
                <View style={styles.viewHori}>
                  <TouchableOpacity style={styles.btnCancel} onPress={()=>{setVisible(false),setNewNota('')}}>
                      <Text style={{fontSize: 30,color: '#4D4D4D'}}>Cancelar </Text>
                      <Image source={require('../assets/images/cruzar.png')} style={styles.cancelImg}/>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnCancel} onPress={()=>{trigger2(newNota,id,fecha),setNewNota('')}}>
                      <Text style={{fontSize: 30,color: '#4D4D4D'}}>Guardar </Text>
                      <Image source={require('../assets/images/bien.png')} style={styles.cancelImg}/>
                  </TouchableOpacity>                
                </View>
              </View>
            </Modal>
            
                <View style={styles.col}>
				<Text style={styles.nota}>{nota}</Text>
                <View style={styles.row2}>
                    <Text style={styles.fecha}>Fecha: {fecha}</Text>
                    {nvlUser == 1 ? (
                        <View style={styles.iconos}>
                            <TouchableOpacity style={styles.to} onPress={()=>{trigger(id)}}>
                                <Image source={require('../assets/images/basura.png')} style={styles.imgicon}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.to} onPress={()=>{setVisible(true)}}>
                                <Image source={require('../assets/images/lapiz.png')} style={styles.imgicon}/>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.iconos}></View>
                    )}
                    
                </View>
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
        backgroundColor: '#FFE075',
        paddingHorizontal: 20,
        paddingTop: 20,
        marginBottom: 20,
        borderRadius: 5,
        borderColor: '#FFC375',
        borderWidth: 3
    },
    col:{
        flex: 1,
		flexDirection: 'column',
    },
    row2:{
        flex: 2,
        flexDirection: 'row',
        padding: 3,
    },
    nota: {
        fontSize: 20,
        marginBottom: 10,
        padding: 5,
        color: "#505050",
    },
    fecha: {
        fontSize: 12,
        flex: 5,
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
      texto:{
        flex: 10,
        borderColor:'#E4E4E4',
        borderWidth:1,
        padding: 5,
        backgroundColor: '#ffffff',
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
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