import {useState, useEffect} from 'react';
import {StyleSheet, Text, View, FlatList, Image, TextInput} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useRoute} from '@react-navigation/native';

function ReportPageContent() {
  const [allReportsData, setAllReportsData] = useState([]);
  const route = useRoute();

  async function getAllData() {
    const report = route.params.report;
    if(report != null && report != undefined){
      setAllReportsData(report);
    }
  }

  useEffect(() => {
    getAllData();
  }, []);

  function generateTitle(data){
    return data.student;
  }

  function generateContent(content){
    //String(parseFloat(data.mes) + 1).padStart(2, '0') + "/" + String(data.ano).padStart(2, '0')
    var textContent = "";
    if(content != null && content != undefined){
      if(content.length > 0){
        var currentMonth = new Date(content[0].date).getMonth() + 1;
        for(var i = 0; i < content.length; i++){
          var dateDate = new Date(content[i].date);

          const days = dateDate.getDate();
          const months = dateDate.getMonth()+1;

          if(currentMonth != months){
            currentMonth = months;
            textContent += " ----------------------------------------------------- \n";
          }

          var dateString = "\t" + String(days).padStart(2, '0') + "/" + String(months).padStart(2, '0') + "/" + dateDate.getFullYear().toString();

          textContent += dateString + " - " + content[i].content + " \n";
        }
      }
    }else{
        textContent = "Não foi possível calcular";
    }
    return textContent;
  }

  const UserCard = ({data}) => (
    <View style={styles.card}>
      <View style={styles.cardDetails}>
        <Text style={styles.name}>{generateTitle(data)}</Text>
        <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Conteúdo Programático:</Text>
        </View>
        <View>
          <Text style={styles.infoEditFirst_text}>{generateContent(data.classes)}</Text>
        </View>
      </View>
      <View></View>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={[styles.header,{marginBottom: 10}]}>
        <View style={{flex: 1}}>
        </View>
        <View style={{flex: 3}}>
          <Text style={styles.nameText}>Relatório</Text>
        </View>
        <View style={{flex: 1}}></View>
      </View>

      {
      (
        allReportsData != null && allReportsData != undefined ? 
        (
          allReportsData.length == 0 ?
          <Text style={styles.nameText1}>Não há dados</Text>
          :
          <FlatList
          data={allReportsData}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({item}) => <UserCard data={item} />}
          />
        )
        :
        <Text style={styles.nameText1}>Não há dados</Text>
      )
      }
    </View>
  );
}
const styles = StyleSheet.create({
  searchInput: {
    paddingLeft: 10,
    color: '#707070',
    fontSize: 15,
  },
  searchIcon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
    alignContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    borderRadius: 10,
    color: 'black',
  },
  viewStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  textStyle: {
    fontSize: 28,
    color: 'black',
  },
  headingStyle: {
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  userInfo: {
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  userType: {
    fontSize: 18,
    color: '#777777',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  cardDetails: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#777777',
  },
  infoEditView: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 5,
  },
  infoEditFirst_text: {
    color: '#7d7c7c',
    fontSize: 16,
    fontWeight: '400',
  },
  infoEditSecond_text: {
    color: 'black',
    fontStyle: 'normal',
    fontFamily: 'Open Sans',
    fontSize: 15,
    textAlignVertical: 'center',
    textAlign: 'right',
  },
  header: {
    backgroundColor: 'orange',
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  nameText: {
    color: 'white',
    fontSize: 24,

    fontStyle: 'normal',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nameText1: {
    color: 'black',
    fontSize: 24,

    fontStyle: 'normal',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default ReportPageContent;