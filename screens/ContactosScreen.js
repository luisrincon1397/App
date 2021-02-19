import React,{useState,useEffect} from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView,Image,FlatList,TouchableOpacity,Modal,Alert,AsyncStorage } from 'react-native';
import ContactosModel from '../components/ContactosModel';
import { TextInput } from 'react-native-gesture-handler';
export default function ContactosScreen({navigation}) {
    var timer;
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
    const [red,setRed] = useState(true);
    const [nvlUsuario,setNvlUsuario] = useState(2);
    const [filtro,setFiltro] = useState('');


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
        }, 2000);
        fetch('http://dtai.uteq.edu.mx/~alalui186/awi4/ws/integradora/contactos')
        .then(response => response.json())
        .then(respJson => {
          let var1 = respJson["contactos"];
          setContacts(var1);
          setRed(true);
        })
      .catch(error => {console.log(error); setRed(false)});
      _retrieveNvl();
    },[cont]);

    const borrarCampos = () => {
      setNewAp1('');
      setNewAp2('');
      setNewCP('');
      setNewCalle('');
      setNewColonia('');
      setNewEstado('');
      setNewNombre('');
      setNewNumCalle('');
      setNewTel('');
    }
    const guardarContacto = () => {
      let valido = verifDatos();
      if(valido){
        const data = new FormData();
        data.append('nombre', newNombre);
        data.append('appaterno', newAp1);
        data.append('apmaterno', newAp2);
        data.append('calle', newCalle);
        data.append('numcalle', newNumCalle);
        data.append('colonia', newColonia);
        data.append('cp', newCP);
        data.append('estado', newEstado);
        data.append('telefono', newTel);
        fetch('http://dtai.uteq.edu.mx/~alalui186/awi4/ws/integradora/agregar_contacto', {
          method: 'POST',
          body: data
        }).catch(error => console.log(error));
        borrarCampos();
        setVisible(false);
      }else{
        Alert.alert(
          'Advertencia',
          'Ingresa todos los datos',
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
    return(
        <View style={[styles.container]}>
        {red ? (
        <View>
            
            {nvlUsuario == 1 ? (
              <View style={styles.newImgDiv}>
                <TouchableOpacity style={styles.tO} onPress={()=>{setVisible(true)}}>
                    <Text style={{fontSize: 30,color: '#4D4D4D'}}>Agregar contacto </Text>
                    <Image source={require('../assets/images/contacto.png')} style={styles.newImg}/>
                </TouchableOpacity>
                <View style={styles.viewHori2}>
                    <TextInput style={styles.search} keyboardType={"default"} placeholder='Buscar...' onChangeText={(text) => setFiltro(text)} value={filtro}/>
                    <TouchableOpacity style={styles.btnS} onPress={()=>{setFiltro('')}}>
                      <Text style={{fontSize: 10,color: '#ffffff',flex:1,textAlignVertical:'center'}}>Borrar </Text>
                  </TouchableOpacity>
                </View>
            </View>
          ) : (
            <Text></Text>
          )}
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
                  <TouchableOpacity style={styles.btnCancel} onPress={()=>{setVisible(false),borrarCampos()}}>
                      <Text style={{fontSize: 30,color: '#4D4D4D'}}>Cancelar </Text>
                      <Image source={require('../assets/images/cruzar.png')} style={styles.cancelImg}/>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnCancel} onPress={()=>{guardarContacto()}}>
                      <Text style={{fontSize: 30,color: '#4D4D4D'}}>Guardar </Text>
                      <Image source={require('../assets/images/bien.png')} style={styles.cancelImg}/>
                  </TouchableOpacity>                
                </View>
              </View>
            </Modal>
            <View style={styles.codeHighlightContainer}>
                <FlatList
                style={styles.lista}
                data={contacts}
                renderItem={obj => (
                    <ContactosModel
                        id={obj.item.idcontacto}
                        nom={obj.item.nombre}
                        ap={obj.item.appaterno}
                        am={obj.item.apmaterno}
                        calle={obj.item.calle}
                        numcallle={obj.item.numcalle}
                        colonia={obj.item.colonia}
                        cp={obj.item.cp}
                        estado={obj.item.estado}
                        tel={obj.item.telefono}
                        nvlUser={nvlUsuario}
                        filter={filtro}

                    />
                )}
                keyExtractor={datos => datos.idcontacto}
            />
            </View>
          </View>
          ) : (
          <View style={styles.errRedView}>
            <Image
                  source={require('../assets/images/servidor.png')}
                  style={styles.errImg}
                    />
            <Text style={styles.errTxt}>No se pudo conectar al servidor.</Text>
          </View>
          )}
        </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    marginTop: 20,
  },
  tO:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newImg:{
    width: 50,
    height: 40,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newImgDiv: {
    padding: 10,
    backgroundColor: '#D9D9D9',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  lista:{
      marginTop: 10,
      paddingHorizontal: 1,
      marginHorizontal: 10,
  },
  codeHighlightContainer: {
    marginTop: 20,
    marginBottom: 60,
    backgroundColor: '#D9D9D9',
    paddingHorizontal: 4,
    paddingVertical: 4,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    borderBottomColor: '#898989',
    borderTopColor: '#DDDDDD',
    borderRightColor: '#D9D9D9',
    borderLeftColor: '#D9D9D9',
    borderWidth: 1.5,
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
  errRedView:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 50,
    alignContent: 'center',
    alignItems: 'center'
  },
  errImg:{
    width: 80,
    height: 60,
    resizeMode: 'contain',
    justifyContent: 'center',
    marginBottom: 30
  },
  errTxt:{
    textAlign: "center",
    fontSize: 25,
    color: '#606060',
  },
  btnS:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#3D78FF',
  },
  viewHori2:{
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  search:{
    flex: 2,
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
});
