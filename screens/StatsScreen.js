import React,{useState,useEffect} from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView,Image } from 'react-native';
import {LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart} from 'react-native-chart-kit';
export default function StatScreen() {
  const [datosTemp,setDatosTemp] = useState([0]);
  const [datosPulso, setDatosPulso] = useState([0]);
  const [fechasTemp,setFechasTemp] = useState([0]);
  const [fechasPulso,setFechasPulso] = useState([0]);
  const [cont,setCont] = useState(0);
  const [red,setRed] = useState(true);
  var asd = [1]
  var timer;
  useEffect(() => {
    timer = setTimeout(() => {
      setCont(cont + 1);
    }, 2000);
    fetch('http://dtai.uteq.edu.mx/~alalui186/awi4/wsMongo/integradora/get_temps')
      .then(response => response.json())
      .then(respJson => {
        let var1 = respJson[0]["temperatura"];
        let var2 = respJson[1]["temperatura"];
        let var3 = respJson[2]["temperatura"];
        let var4 = respJson[3]["temperatura"];
        let var5 = respJson[4]["temperatura"];
        let var6 = respJson[5]["temperatura"];
        let var7 = respJson[6]["temperatura"];
        setDatosTemp([var1,var2,var3,var4,var5,var6,var7]);
      })
    .catch(error => {console.log(error); setRed(false);});
    fetch('http://dtai.uteq.edu.mx/~alalui186/awi4/wsMongo/integradora/get_pulsos')
      .then(response => response.json())
      .then(respJson => {
        let var1 = respJson[0]["pulso"];
        let var2 = respJson[1]["pulso"];
        let var3 = respJson[2]["pulso"];
        let var4 = respJson[3]["pulso"];
        let var5 = respJson[4]["pulso"];
        let var6 = respJson[5]["pulso"];
        let var7 = respJson[6]["pulso"];
        setDatosPulso([var1,var2,var3,var4,var5,var6,var7]);
      })
    .catch(error => {console.log(error); setRed(false);});
  },[cont]);
    const data = {
        datasets: [
          {
            data: datosTemp,
            strokeWidth: 2,
            strokeColor: '#668FFF'
          },
        ],
      }
    const data2 = {
        datasets: [
          {
            data: datosPulso,
            strokeWidth: 2,
            strokeColor: '#668FFF'
          },
        ],
      }
      const config = {
        backgroundColor: '#E6E6E6',
        backgroundGradientFrom: '#66C9FF',
        backgroundGradientTo: '#FFFC66',
        decimalPlaces: 2,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
          borderRadius: 16,
        },
      }
      const config2 = {
        backgroundColor: '#E6E6E6',
        backgroundGradientFrom: '#7BFF66',
        backgroundGradientTo: '#FFFC66',
        decimalPlaces: 2,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
          borderRadius: 16,
        },
      }
    return (
        <ScrollView style={styles.container}>
        <View style={styles.codeHighlightContainer}>
          <View style={styles.rowDiv}>
            <Text style={styles.titulo}>Ritmo cardiaco</Text>  
            <Image source={require('../assets/images/prompulso.png')} style={styles.okimage}/>
          </View>
          <LineChart data={data2} width={Dimensions.get('window').width} height={250} chartConfig={config}/>
        </View>
        <View style={styles.codeHighlightContainer}>
          <View style={styles.rowDiv}>
            <Text style={styles.titulo}>Temperatura</Text>  
            <Image source={require('../assets/images/promtemp.png')} style={styles.okimage}/>
          </View>
          <LineChart data={data} width={Dimensions.get('window').width} height={250} chartConfig={config2}/>
        </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E5E5',
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
      okimage:{
        flex: 1,
        width: 80,
        height: 60,
        resizeMode: 'contain',
        flex: 1,
        justifyContent: 'center'
      },
      rowDiv:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10
      }
});