import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, WebView} from 'react-native';

type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props);
    this.state= {
      bool: false
    };
  }

  handleResponse(data) {
    // alert(JSON.stringify(data.title));
    if(data.title === 'TXN_SUCCESS') {
      this.setState({ bool : true });
      alert('done')
    }
    
    else if (data.title === 'TXN_FAILURE') {
      alert('FAILURE')
    }

    else if (data.title === 'PENDING') {
      alert('PENDING')
    }
  }

  render() {
    const {bool} = this.state;
    return (
      <View style= {{flex: 1}}>
        {
          bool ? (
            <View style= {{flex: 1}}>
              <Text>Donee</Text>
            </View>

          ) : (
            <WebView 
              source= {{ uri: 'http://13.127.217.102:8000/payment/initiatePaymentWeb?source=android&pgName=paytm&amount=100.00&authToken=8fb7ef13-74cd-426f-8356-d32e2d701b17' }}
              onNavigationStateChange = {(data) => this.handleResponse(data)}
            />
          )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
