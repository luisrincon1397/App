import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView, Image, FlatList, TouchableOpacity, Modal, Alert, AsyncStorage } from 'react-native';
import UsuariosModel from '../components/UsuariosModel';
import { TextInput } from 'react-native-gesture-handler';
export default function UsuariosScreen({ navigation }) {
  var timer;
  const [cont, setCont] = useState(0);
  const [contacts, setContacts] = useState();
  const [visible, setVisible] = useState(false);
  const [newMail, setNewMail] = useState();
  const [newUser, setNewUser] = useState();
  const [newPass, setNewPass] = useState();
  const [newLevel, setNewLevel] = useState();
  const [red, setRed] = useState(true);
  const [filtro, setFiltro] = useState('');


  useEffect(() => {
    timer = setTimeout(() => {
      setCont(cont + 1);
    }, 2000);
    fetch('http://dtai.uteq.edu.mx/~alalui186/awi4/ws/integradora/users')
      .then(response => response.json())
      .then(respJson => {
        let var1 = respJson["users"];
        setContacts(var1);
        setRed(true);
      })
      .catch(error => { console.log(error); setRed(false) });
  }, [cont]);

  const borrarCampos = () => {
    setNewLevel('');
    setNewMail('');
    setNewPass('');
    setNewUser('');
  }
  const guardarContacto = () => {
    let valido = verifDatos();
    if (valido) {
      if (newLevel == 1 || newLevel == 2) {
        const data = new FormData();
        data.append('user', newUser);
        data.append('email', newMail);
        data.append('pass', newPass);
        data.append('level', newLevel);
        fetch('http://dtai.uteq.edu.mx/~alalui186/awi4/ws/integradora/insert_user', {
          method: 'POST',
          body: data
        })
          .then(response => response.json())
          .then(respJson => {
            console.log(respJson)
          })
          .catch(error => console.log(error));
        borrarCampos();
        setVisible(false);
      } else {
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
          { cancelable: false }
        );
      }
    } else {
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
        { cancelable: false }
      );
    }
  }
  const verifDatos = () => {
    let valido = true;
    if (newLevel == '') {
      valido = false;
    }
    if (newPass == '') {
      valido = false;
    }
    if (newUser == '') {
      valido = false;
    }
    if (newMail == '') {
      valido = false;
    }
    return valido;
  }
  return (
    <View style={[styles.container]}>
      {red ? (
        <View>

          <View style={styles.newImgDiv}>
            <TouchableOpacity style={styles.tO} onPress={() => { setVisible(true) }}>
              <Text style={{ fontSize: 30, color: '#4D4D4D' }}>Agregar usuario </Text>
              <Image source={require('../assets/images/contacto.png')} style={styles.newImg} />
            </TouchableOpacity>
            <View style={styles.viewHori2}>
              <TextInput style={styles.search} keyboardType={"default"} placeholder='Buscar...' onChangeText={(text) => setFiltro(text)} value={filtro} />
              <TouchableOpacity style={styles.btnS} onPress={() => { setFiltro('') }}>
                <Text style={{ fontSize: 10, color: '#ffffff', flex: 1, textAlignVertical: 'center' }}>Borrar </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Modal animationType={"slide"} transparent={true} visible={visible}>
            <View style={styles.modalStyle}>
              <Text style={styles.titulo}>Ingresa el nuevo usuario</Text>
              <View style={styles.inputs}>
                <TextInput style={styles.inputTXT} keyboardType={"default"} placeholder='Usuario' onChangeText={(text) => setNewUser(text)} value={newUser} />
                <TextInput style={styles.inputTXT} keyboardType={"email-address"} placeholder='Correo' onChangeText={(text) => setNewMail(text)} value={newMail} />
                <TextInput style={styles.inputTXT} keyboardType={"default"} placeholder='Contraseña' onChangeText={(text) => setNewPass(text)} value={newPass} />
                <TextInput style={styles.inputTXT} keyboardType={"numeric"} placeholder='Nivel de usuario' onChangeText={(text) => setNewLevel(text)} value={newLevel} />
              </View>
              <View style={styles.viewHori}>
                <TouchableOpacity style={styles.btnCancel} onPress={() => { setVisible(false), borrarCampos() }}>
                  <Text style={{ fontSize: 30, color: '#4D4D4D' }}>Cancelar </Text>
                  <Image source={require('../assets/images/cruzar.png')} style={styles.cancelImg} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnCancel} onPress={() => { guardarContacto() }}>
                  <Text style={{ fontSize: 30, color: '#4D4D4D' }}>Guardar </Text>
                  <Image source={require('../assets/images/bien.png')} style={styles.cancelImg} />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <View style={styles.codeHighlightContainer}>
            <FlatList
              style={styles.lista}
              data={contacts}
              renderItem={obj => (
                <UsuariosModel
                  id={obj.item.id}
                  usuario={obj.item.user}
                  email={obj.item.email}
                  pass={obj.item.pass}
                  nivel={obj.item.level}
                  filter={filtro}

                />
              )}
              keyExtractor={datos => datos.id}
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
  tO: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newImg: {
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
  lista: {
    marginTop: 10,
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
  modalStyle: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 30,
    backgroundColor: '#D9D9D9',
  },
  inputs: {
    flex: 10,
    padding: 5,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderRadius: 5,
    borderColor: '#898989',
    justifyContent: 'space-evenly',

  },
  inputTXT: {
    padding: 5,
    backgroundColor: '#F6F6F6',
  },
  btnCancel: {
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
  viewHori: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  cancelImg: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errRedView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 50,
    alignContent: 'center',
    alignItems: 'center'
  },
  errImg: {
    width: 80,
    height: 60,
    resizeMode: 'contain',
    justifyContent: 'center',
    marginBottom: 30
  },
  errTxt: {
    textAlign: "center",
    fontSize: 25,
    color: '#606060',
  },
  btnS: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3D78FF',
  },
  viewHori2: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  search: {
    flex: 2,
    borderColor: '#E4E4E4',
    borderWidth: 1,
    padding: 5,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
});
