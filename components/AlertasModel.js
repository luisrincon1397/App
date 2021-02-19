import React, { useEffect,useState } from 'react';
import { Text, View, Image, StyleSheet,TouchableOpacity,Modal,Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
export default function AlertasModel({
	id,
	fecha,
    alerta,
    nvlUser,
    filter
    }) {
        const [visible,setVisible] = useState(false);
        const [newAlerta,setNewAlerta] = useState();
        var pulsoBajo = 'El pulso es demasiado bajo';
        var pulsoAlto = 'El pulso es demasiado alto';
        var tempBaja = 'La temperatura es demasiado baja';
        var tempAlta = 'La temperatura es demasiado alta';
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
            verifFilter(alerta);
        })
        const trigger = (alerta) => {
            const data = new FormData();
            data.append('idalerta', alerta);
            fetch('http://dtai.uteq.edu.mx/~alalui186/awi4/ws/integradora/borrar_alerta', {
                method: 'POST',
                body: data
            }).catch(error => console.log(error));
        }
        const trigger2 = (newAlert,idAlert,dateAlert) => {
            if(newAlert !== ''){
                const data = new FormData();
                data.append('idalerta', idAlert);
                data.append('descripcion', newAlert);
                data.append('fecha', dateAlert);
                fetch('http://dtai.uteq.edu.mx/~alalui186/awi4/ws/integradora/modificar_alerta', {
                    method: 'POST',
                    body: data
                }).catch(error => console.log(error));
                setVisible(false)
            }else{
                Alert.alert(
                    'Advertencia',
                    'Ingresa un valor adecuado\n\nLa alerta esta vacia',
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
                    <Text style={styles.titulo}>Ingresa la alerta</Text>
                    <Text style={styles.subtitulo}>Actual: {alerta}</Text>
                    <View style={styles.inputs}>
                        <TouchableOpacity style={styles.tO} onPress={()=>{trigger2(pulsoBajo,id,fecha)}}>
                            <Text style={{fontSize: 25,color: '#4D4D4D'}}>El pulso es demasiado bajo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tO} onPress={()=>{trigger2(pulsoAlto,id,fecha)}}>
                            <Text style={{fontSize: 25,color: '#4D4D4D'}}>El pulso es demasiado alto</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tO} onPress={()=>{trigger2(tempBaja,id,fecha)}}>
                            <Text style={{fontSize: 25,color: '#4D4D4D'}}>La temperatura es demasiado baja</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tO} onPress={()=>{trigger2(tempAlta,id,fecha)}}>
                            <Text style={{fontSize: 25,color: '#4D4D4D'}}>La temperatura es demasiado alta</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.viewHori}>
                    <TouchableOpacity style={styles.btnCancel} onPress={()=>{setVisible(false)}}>
                        <Text style={{fontSize: 30,color: '#4D4D4D'}}>Cancelar </Text>
                        <Image source={require('../assets/images/cruzar.png')} style={styles.cancelImg}/>
                    </TouchableOpacity>              
                </View>
              </View>
            </Modal>
			<View style={styles.col}>
				<Text style={styles.nota}>{alerta}</Text>
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
        backgroundColor: '#EDBB99',
        paddingHorizontal: 20,
        paddingTop: 20,
        marginBottom: 20,
        borderRadius: 5,
        borderColor: '#C0392B',
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
        textAlign: 'center'
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
      inputs:{
        flex: 10,
        padding: 5,
        backgroundColor: '#ffffff',
        borderWidth: 1.5,
        borderRadius: 5,
        borderColor: '#898989',
        justifyContent: 'space-evenly',
      },
      subtitulo: {
        flex: 1,
        textAlign: "center",
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
        fontSize: 23,
        color: '#606060',
        marginBottom: 10,
      },
});