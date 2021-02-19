import React,{useState, useEffect} from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View,AsyncStorage,Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function HomeScreen({navigation}) {
  const [nombre, setNombre] = useState('');
  const [temp, setTemp] = useState();
  const [heartbeat,setHeartbeat] = useState();
  const [alert,setAlert] = useState('');
  const [alert2,setAlert2] = useState('');
  const [warning,setWarning] = useState(false);
  const [temper,setTemper] = useState(false);
  const [heartb,setHeartb] = useState(false);
  const [hora,setHora] = useState(0);
  const [pulsoNormal,setPulsoNormal] = useState(0);
  const [tempNormal,setTempNormal] = useState(0);
  const [cont,setCont] = useState(0);
  const [cont2,setCont2] = useState(0);
  const [red,setRed] = useState(true);
  const [load,setLoad] = useState(true);
  var timer, timer2;

  const _retrieveUser = async () => {
    try {
        const value = await AsyncStorage.getItem('user');
        if (value !== null) {
            setNombre(value);
        }else if(value == ''){
            navigation.navigate('Login');
        }else{
            navigation.navigate('Login');
        }
    } catch (error) {
        console.log(error);
        navigation.navigate('Login');
    }
  }
  useEffect(() => {
    _retrieveUser();
  });

  useEffect(() => {
    getHora();
  },[]);

  useEffect(() => {
    timer = setTimeout(() => {
      setCont(cont + 1);
    }, 2000);
    fetch('http://dtai.uteq.edu.mx/~alalui186/awi4/wsMongo/integradora/get_pulso')
      .then(response => response.json())
      .then(respJson => {
        setHeartbeat(respJson[0]["pulso"]);
        setRed(true);
      })
    .catch(error => {console.log(error); setRed(false);});
      fetch('http://dtai.uteq.edu.mx/~alalui186/awi4/wsMongo/integradora/get_temp')
      .then(response => response.json())
      .then(respJson => {
        setTemp(respJson[0]["temperatura"]);
        setRed(true);
      })
    .catch(error => {console.log(error); setRed(false);});
    _retrieveDataPulsoNew();
    _retrieveDataTempNew();
  },[cont]);

  const getHora = () => {
    const date = new Date();
    const hour = date.getHours()
    setHora(hour);
  }
  const _retrieveDataPulsoNew = async () => {
    try {
        const value = await AsyncStorage.getItem('pulso');
        if (value !== null) {
            setPulsoNormal(parseFloat(value));
        }else{
          setPulsoNormal(81.6);
        }
    } catch (error) {
        console.log(error);
        setPulsoNormal(81.6);
    }
  }
  const _retrieveDataTempNew = async () => {
    try {
        const value = await AsyncStorage.getItem('temp');
        if (value !== null) {
            setTempNormal(parseFloat(value));
        }else{
          setTempNormal(36.5);
        }
    } catch (error) {
        console.log(error);
        setTempNormal(36.5);
    }
  }
  const horadeldia = () => {
    if(hora <= 12 && hora > 4){
      return <Text>buenos dias!</Text>;
    }else if(hora <= 19 && hora > 12){
      return <Text>buenas tardes!</Text>;
    }else{
      return <Text>buenas noches!</Text>;
    }
  }
  const imgdeldia = () => {
    if(hora <= 12 && hora > 4){
      return <Image source={require('../assets/images/dia.png')} style={styles.diaimage}/>;
    }else if(hora <= 19 && hora > 12){
      return <Image source={require('../assets/images/tarde.png')} style={styles.diaimage}/>;
    }else{
      return <Image source={require('../assets/images/luna.png')} style={styles.diaimage}/>;
    }
  }
  const verifTemp = () => {
    let stat1 = false;
    if(temp < (tempNormal - 2)){
        setWarning(true);
        setAlert('La temperatura es demasiado baja');
        stat1 = true;
        newAlerta(alert);
    }else if(temp > (tempNormal + 2)){
        setWarning(true);
        setAlert('La temperatura es demasiado alta');
        stat1 = true;
        newAlerta(alert);
    }else{
      setAlert('');
      stat1 = false;
    }
    return stat1;
  }
  const verifPulse = () => {
    let stat2 = false;
    if(heartbeat < (pulsoNormal - 50)){
      if(!stat2){
        setWarning(true);
        setAlert2('El ritmo cardiaco es demasiado bajo');
        stat2 = true;
        newAlerta(alert2);
      }
    }else if(heartbeat > (pulsoNormal + 50)){
      if(!stat2){
        setWarning(true);
        setAlert2('El ritmo cardaico es demasiado alto');
        stat2 = true;
        newAlerta(alert2);
      }
    }else{
      setAlert2('');
      stat2 = false;
    }
    return stat2;
  }
  const newAlerta = (alerta) => {
    if(alerta !== ''){
      const data = new FormData();
      data.append('descripcion', alerta);
      fetch('http://dtai.uteq.edu.mx/~alalui186/awi4/ws/integradora/agregar_alerta', {
        method: 'POST',
        body: data
      }).catch(error => console.log(error));
    }
  }
  
  useEffect(() => {
    setTemper(verifTemp());
    setHeartb(verifPulse());
    if(temper == false && heartb == false){
      setWarning(false);
    }
  });

  return (
    <View style={styles.container}>
    {red ? (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.pdvContainer}>
          <Image
            source={require('../assets/images/pdv.png')}
            style={styles.welcomeImage}
          />
        </View>
        <View style={styles.welcomeContainer}>
          <View style={{flex: 1,flexDirection: 'row',justifyContent: 'center',alignItems: 'center',marginBottom: 10}}>
            <Text style={styles.welcome}>¡Hola, {horadeldia()} </Text>
            {imgdeldia()}
          </View>
          <Text style={styles.titulo}>Se muestra la cuenta de <Text style={styles.nombre}>{nombre}</Text></Text>
        </View>
        <View style={styles.codeHighlightContainer}>
            <View style={styles.itemsVertical}>
              <Text style={{fontSize: 20, color: '#969696'}}>Ritmo cardiaco</Text>
              <Image
            source={require('../assets/images/cardiograma.png')}
            style={styles.welcomeImage}
              />
              {heartb ? (
                <Text style={styles.signosmal}>{heartbeat}</Text>
              ) : (
                <Text style={styles.signosbien}>{heartbeat}</Text>
              )}
            </View>
            <View style={styles.itemsVertical}>
              <Text style={{fontSize: 20, color: '#969696'}}>Temperatura</Text>
              <Image
            source={require('../assets/images/temperatura-alta.png')}
            style={styles.welcomeImage}
              />
              {temper ? (
                <Text style={styles.signosmal}>{temp}</Text>
              ) : (
                <Text style={styles.signosbien}>{temp}</Text>
              )}
            </View>
        </View>
        {warning ? (
        <View style={styles.modalAlerta}>
          <View style={{flex: 1,flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>
            <Image source={require('../assets/images/alerta.png')} style={styles.alertimage}/>
            <Text style={{fontSize: 30,color: '#4D4D4D'}}> ALERTA</Text>
          </View>
            <Text style={{fontSize: 20,color: '#6A6A6A'}}>{alert}</Text>
            <Text style={{fontSize: 20,color: '#6A6A6A'}}>{alert2}</Text>
        </View>
        ) : (
          <View style={styles.codeHighlightContainer}>
            <View style={styles.itemsVertical}>
              <Text style={{fontSize: 20, color: '#969696'}}>¡Todo bien!</Text>
              <Image
              source={require('../assets/images/ok.png')}
              style={styles.okimage}
                />
            </View>
          </View>
        )}
      </ScrollView>
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

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
  },
  contentContainer: {
    paddingTop: 5,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#D9D9D9',
    paddingHorizontal: 4,
    paddingVertical: 4,
    flex: 1,
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
  welcomeImage: {
    width: 150,
    height: 120,
    resizeMode: 'contain',
    flex: 1,
    justifyContent: 'center'
  },
  pdvContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  okimage:{
    width: 80,
    height: 60,
    resizeMode: 'contain',
    flex: 1,
    justifyContent: 'center'
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    marginTop: 20,
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
  navigationFilename: {
    marginTop: 5,
  },
  titulo: {
    flex: 1,
    textAlign: "center",
    fontSize: 25,
    color: '#606060',
  },
  welcome: {
    textAlign: "center",
    fontSize: 23,
    color: '#606060',
  },
  nombre:{
    color: '#2e78b7',
  },
  itemsVertical:{
    paddingVertical: 4,
    textAlign: 'center',
    alignItems: 'center'
  },
  signosbien:{
    color: '#40AC18',
    fontSize: 50
  },
  signosmal:{
    color: '#D23300',
    fontSize: 50
  },
  modalAlerta:{
    marginTop: 50,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: '#FFF723',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 10,
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    borderColor: '#C1C1C1',
    borderWidth: 1,
    textAlign: 'center'
  },
  alertimage:{
    width: 25,
    height: 20,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diaimage:{
    width: 25,
    height: 20,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBody:{
    fontSize: 30,
    color: '#969696'
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
  }
});
