import React,{useState,useEffect} from 'react';
import { Text, View, Image, StyleSheet,TouchableOpacity,Modal,Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

export default function ContactosModel({
	id,
    nom,
    ap,
    am,
    calle,
    numcallle,
    colonia,
    cp,
    estado,
    tel,
    nvlUser,
    filter
    }) {
        const [cont, setCont] = useState(0);
        const [contacts,setContacts] = useState();
        const [visible,setVisible] = useState(false);
        const [newNombre,setNewNombre] = useState();
        const [newAp1,setNewAp1] = useState();
        const [newAp2,setNewAp2] = useState();
        const [newCalle,setNewCalle] = useState();
        const [newNumCalle,setNewNumCalle] = useState();
        const [newColonia,setNewColonia] = useState();
        const [newEstado,setNewEstado] = useState();
        const [newCP,setNewCP] = useState();
        const [newTel,setNewTel,] = useState();
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
          let nomb = nom+" "+ap+" "+am;
          verifFilter(nomb);
        })
        const trigger = (contact) => {
            const data = new FormData();
            data.append('idcontacto', contact);
            fetch('http://dtai.uteq.edu.mx/~alalui186/awi4/ws/integradora/borrar_contacto', {
                method: 'POST',
                body: data
            }).catch(error => console.log(error));
        }
        const guardarContacto = (id) => {
            let valido = verifDatos();
            if(valido){
              const data = new FormData();
              data.append('idcontacto',id);
              data.append('nombre', newNombre);
              data.append('appaterno', newAp1);
              data.append('apmaterno', newAp2);
              data.append('calle', newCalle);
              data.append('numcalle', newNumCalle);
              data.append('colonia', newColonia);
              data.append('cp', newCP);
              data.append('estado', newEstado);
              data.append('telefono', newTel);
              fetch('http://dtai.uteq.edu.mx/~alalui186/awi4/ws/integradora/modificar_contacto', {
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
            if(newAp1 == ''){
              valido = false;
            }
            if(newAp2 == ''){
              valido = false;
            }
            if(newCP == ''){
              valido = false;
            }
            if(newCalle == ''){
              valido = false;
            }
            if(newColonia == ''){
              valido = false;
            }
            if(newEstado == ''){
              valido = false;
            }
            if(newNombre == ''){
              valido = false;
            }
            if(newNumCalle == ''){
              valido = false;
            }
            if(newTel == ''){
              valido = false;
            }
            return valido;
          }
        const datosIni = () => {
            setNewAp1(ap);
            setNewAp2(am);
            setNewCP(cp);
            setNewCalle(calle);
            setNewColonia(colonia);
            setNewEstado(estado);
            setNewNombre(nom);
            setNewNumCalle(numcallle);
            setNewTel(tel);
          }
	return (
    <View>
    {mostrar ? (
      <View style={styles.row}>
			<View style={styles.col}>
				<Text style={styles.nota}>{nom} {ap} {am}</Text>
                <View style={styles.col}>
                    <Text style={styles.dir}>{calle} #{numcallle}, {colonia}, {cp}, {estado}</Text>
                    <Text style={styles.tel}>{tel}</Text>
                </View>
			</View>
            <Modal animationType={"slide"} transparent={true} visible={visible}>
              <View style={styles.modalStyle}>
                <Text style={styles.titulo}>Ingresa el nuevo contacto</Text>
                <View style={styles.inputs}>
                    <TextInput style={styles.inputTXT} keyboardType={"default"} placeholder='Nombre' onChangeText={(text) => setNewNombre(text)} value={newNombre}/>
                    <TextInput style={styles.inputTXT} keyboardType={"default"} placeholder='Apellido 1' onChangeText={(text) => setNewAp1(text)} value={newAp1}/> 
                    <TextInput style={styles.inputTXT} keyboardType={"default"} placeholder='Apellido 2' onChangeText={(text) => setNewAp2(text)} value={newAp2}/> 
                    <TextInput style={styles.inputTXT} keyboardType={"default"} placeholder='Calle' onChangeText={(text) => setNewCalle(text)} value={newCalle}/> 
                    <TextInput style={styles.inputTXT} keyboardType={"numeric"} placeholder='numcalle' onChangeText={(text) => setNewNumCalle(text)} value={newNumCalle}/> 
                    <TextInput style={styles.inputTXT} keyboardType={"default"} placeholder='Colonia' onChangeText={(text) => setNewColonia(text)} value={newColonia}/> 
                    <TextInput style={styles.inputTXT} keyboardType={"numeric"} placeholder='CP' onChangeText={(text) => setNewCP(text)} value={newCP}/> 
                    <TextInput style={styles.inputTXT} keyboardType={"default"} placeholder='Estado' onChangeText={(text) => setNewEstado(text)} value={newEstado}/> 
                    <TextInput style={styles.inputTXT} keyboardType={"phone-pad"} placeholder='Telefono' onChangeText={(text) => setNewTel(text)} value={newTel}/> 
                </View>
                <View style={styles.viewHori}>
                  <TouchableOpacity style={styles.btnCancel} onPress={()=>{setVisible(false)}}>
                      <Text style={{fontSize: 30,color: '#4D4D4D'}}>Cancelar </Text>
                      <Image source={require('../assets/images/cruzar.png')} style={styles.cancelImg}/>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnCancel} onPress={()=>{guardarContacto(id)}}>
                      <Text style={{fontSize: 30,color: '#4D4D4D'}}>Guardar </Text>
                      <Image source={require('../assets/images/bien.png')} style={styles.cancelImg}/>
                  </TouchableOpacity>                
                </View>
              </View>
            </Modal>
            {nvlUser == 1 ? (
              <View style={styles.iconos}>
                <TouchableOpacity style={styles.to} onPress={()=>{trigger(id)}}>
                    <Image source={require('../assets/images/basura.png')} style={styles.imgicon}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.to} onPress={()=>{setVisible(true),datosIni()}}>
                    <Image source={require('../assets/images/lapiz.png')} style={styles.imgicon}/>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.iconos}></View>
            )}
            
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
        backgroundColor: '#D9FED8',
        paddingHorizontal: 20,
        paddingTop: 20,
        marginBottom: 20,
        borderRadius: 5,
        borderColor: '#8CD37C',
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
        marginBottom: 10,
        padding: 5,
        color: "#505050",
    },
    dir:{
        fontSize: 14,
        flex: 5,
        justifyContent: 'flex-start',
        alignContent: 'center',
        color: '#606060',
        borderBottomColor: '#8CD37C',
        borderBottomWidth: 1
    },
    tel: {
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