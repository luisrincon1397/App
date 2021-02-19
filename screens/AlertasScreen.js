import React,{useState,useEffect} from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView,Image,FlatList,TouchableOpacity, Modal, Alert,AsyncStorage } from 'react-native';
import AlertasModel from '../components/AlertasModel';
import { TextInput } from 'react-native-gesture-handler';
export default function AlertasScreen({navigation}) {
  var timer;
  const [cont, setCont] = useState(0);
  const [alertas,setAlertas] = useState();
  const [visible,setVisible] = useState(false);
  const [red,setRed] = useState(true);
  var pulsoBajo = 'El pulso es demasiado bajo';
  var pulsoAlto = 'El pulso es demasiado alto';
  var tempBaja = 'La temperatura es demasiado baja';
  var tempAlta = 'La temperatura es demasiado alta';
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
    }, 1000);
    fetch('http://dtai.uteq.edu.mx/~alalui186/awi4/ws/integradora/alertas')
      .then(response => response.json())
      .then(respJson => {
        let var1 = respJson["alertas"];
        setAlertas(var1);
        setRed(true);
      })
      .catch(error => {console.log(error); setRed(false);});
    _retrieveNvl();
  },[cont]);
  const guardarAlerta = (alerta) => {
    if(alerta !== ''){
      const data = new FormData();
            data.append('descripcion', alerta);
                fetch('http://dtai.uteq.edu.mx/~alalui186/awi4/ws/integradora/agregar_alerta', {
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
    return(
        <View style={[styles.container]}>
        {red ? (
          <View>
          
            {nvlUsuario == 1 ? (
              <View style={styles.newImgDiv}>
                <TouchableOpacity style={styles.tO} onPress={()=>{setVisible(true)}}>
                    <Text style={{fontSize: 30,color: '#4D4D4D'}}>Agregar alerta </Text>
                    <Image source={require('../assets/images/anadir.png')} style={styles.newImg}/>
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
                <Text style={styles.titulo}>Ingresa la alerta</Text>
                <View style={styles.inputs}>
                    <TouchableOpacity style={styles.tO} onPress={()=>{guardarAlerta(pulsoBajo)}}>
                        <Text style={{fontSize: 25,color: '#4D4D4D'}}>El pulso es demasiado bajo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tO} onPress={()=>{guardarAlerta(pulsoAlto)}}>
                        <Text style={{fontSize: 25,color: '#4D4D4D'}}>El pulso es demasiado alto</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tO} onPress={()=>{guardarAlerta(tempBaja)}}>
                        <Text style={{fontSize: 25,color: '#4D4D4D'}}>La temperatura es demasiado baja</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tO} onPress={()=>{guardarAlerta(tempAlta)}}>
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
            <View style={styles.codeHighlightContainer}>
                <FlatList
                style={styles.lista}
                data={alertas}
                renderItem={obj => (
                    <AlertasModel
                    id={obj.item.idalerta}
                    fecha={obj.item.fecha}
                    alerta={obj.item.descripcion}
                    nvlUser={nvlUsuario}
                    filter={filtro}
                    />
                )}
                keyExtractor={datos => datos.idalerta}
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
  cancelImg:{
    width: 25,
    height: 25,
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
      marginBottom: 10,
      paddingHorizontal: 1,
      marginHorizontal: 10,
  },
  codeHighlightContainer: {
    marginTop: 20,
    marginBottom: 140,
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
  inputs:{
        flex: 10,
        padding: 5,
        backgroundColor: '#ffffff',
        borderWidth: 1.5,
        borderRadius: 5,
        borderColor: '#898989',
        justifyContent: 'space-evenly',
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
