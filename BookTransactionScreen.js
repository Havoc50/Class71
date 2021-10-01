import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as firebase from 'firebase';
import db from '../config.js';

export default class TransactionScreen extends React.Component {
    constructor(){
      super();
      this.state = {
        hasCameraPermissions: null,
        scanned: false,
        scannedBookId: '',
        scannedStudentId:'',
        buttonState: 'normal'
      }
    }

    getCameraPermissions = async () =>{
      const {status} = await Permissions.askAsync(Permissions.CAMERA);
      
      this.setState({
        /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
        hasCameraPermissions: status === "granted",
        buttonState: 'clicked',
        scanned: false
      });
    }

    handleBarCodeScanned = async({type, data})=>{
      const {buttonState} = this.state

      if(buttonState==="BookId"){
        this.setState({
          scanned: true,
          scannedBookId: data,
          buttonState: 'normal'
        });
      }
      else if(buttonState==="StudentId"){
        this.setState({
          scanned: true,
          scannedStudentId: data,
          buttonState: 'normal'
        });
      }
      
    }

    handleTransaction = () => {
      var transactionMessage
      db.collection("Books").doc(this.state.scannedbookID).get().then((doc)=>{
        // console.log(doc.data())
        if(book.bookAvailability){
          this.initiateBookIssue();
          transactionMessage = "Book Issued"
        }
        else{
          this.initiateBookReturn();
          transactionMessage = "Book Returned"
        }
      })
      this.setState({
        transactionMessage: transactionMessage
      })
    }

    initiateBookIssue = async() => {
      db.collection("transaction").add({
        'studentID': this.state.scannedstudentID,
        'bookID': this.state.scannedbookID,
        'date': firebase.firestore.Timestamp.now().toDate(),
        'transactionType': "issue"
      })
      db.collection("books").doc(this.state.scannedbookID).update({
        'bookAvailability': false
      })
      db.collection("student").doc(this.state.scannedstudentID).update({
        'numberOfBooksIssued': firebase.firestore.FieldValue.increment(1)
      })
      alert("Book Issued");
      this.setState({
        scannedbookID: '',
        scannedstudentID: ''
      })
    }

    initiateBookReturn = async() => {
      db.collection("transaction").add({
        'studentID': this.state.scannedstudentID,
        'bookID': this.state.scannedbookID,
        'date': firebase.firestore.Timestamp.now().toDate(),
        'transactionType': "return"
      })
      db.collection("books").doc(this.state.scannedbookID).update({
        'bookAvailability': true
      })
      db.collection("student").doc(this.state.scannedstudentID).update({
        'numberOfBooksIssued': firebase.firestore.FieldValue.increment(-1)
      })
      alert("Book Returned");
      this.setState({
        scannedbookID: '',
        scannedstudentID: ''
      })
    }



    render() {
      const hasCameraPermissions = this.state.hasCameraPermissions;
      const scanned = this.state.scanned;
      const buttonState = this.state.buttonState;

      if (buttonState === "clicked" && hasCameraPermissions){
        return(
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        );
      }

      else if (buttonState === "normal"){
        return(
          <View style={styles.container}>
            <View style={styles.inputView}>
              <TextInput style = {styles.inputBox}
              placeholder = " Book ID"
              />

              <TouchableOpacity style ={styles.scanButton}>
                <Text style = {styles.buttonText}>
                  Scan the Book's ID!
                </Text>
              </TouchableOpacity>

            </View>

            <View style={styles.inputView}>
              <TextInput style = {styles.inputBox}
              placeholder = " Student ID"
              />

              <TouchableOpacity style ={styles.scanButton}>
                <Text style = {styles.buttonText}>
                  Scan the Student's ID!
                </Text>
              </TouchableOpacity>

            </View>

            <TouchableOpacity
              style ={styles.submitButton}
              onPress = {async() => {this.handleTransaction()}}
            >
              <Text style = {styles.submitButtonText}>
                Submit
              </Text>
            </TouchableOpacity>

            {/* <Text style={styles.displayText}>{
              hasCameraPermissions===true ? this.state.scannedData: "Request Camera Permission"
            }</Text>     

            <TouchableOpacity
              onPress={this.getCameraPermissions}
              style={styles.scanButton}>
              <Text style={styles.buttonText}>Scan QR Code</Text>
            </TouchableOpacity> */}

          </View>
        );
      }
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      padding: 10,
      margin: 10
    },
    scanButton:{
      backgroundColor: '#66BB68',
      width: 160,
      borderWidth: 1.5,
      borderLeftWidth: 0
    },
    inputView:{
      flexDirection: 'row',
      margin: 20
    },
    inputBox:{
      width: 200,
      height: 40,
      borderWidth: 1.5,
      borderRightWidth: 0,
      fontSize: 20
    },
    buttonText:{
      fontSize: 15,
      textAlign: 'center',
      marginTop: 10
    },
    submitButton:{
      backgroundColor: '#66BB68',
      width: 100,
      height: 50,
      borderWidth: 1.5,
      margin: 25
    },
    submitButtonText:{
      fontSize: 20,
      padding: 10,
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'black'
    },
  });