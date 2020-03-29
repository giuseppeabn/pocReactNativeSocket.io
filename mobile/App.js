import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import io from 'socket.io-client';

const Messages = props => {
  const {allMessages} = props;
  return allMessages.map(message => (
    <View
      style={{
        backgroundColor: 'rgba(49, 32, 221, 0.3)',
        borderRadius: 4,
        minHeight: 40,
        width: '60%',
        marginLeft: 5,
        paddingLeft: 5,
        paddingTop: 5,
        marginTop: 10,
      }}>
      <Text>{message}</Text>
    </View>
  ));
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      chatMessages: [],
    };
  }
  componentDidMount() {
    this.socket = io('http://localhost:3000');
    this.socket.on('chat message', msg => {
      console.log(msg);
      this.setState({
        chatMessages: [...this.state.chatMessages, msg],
      });
    });
  }

  submitMessage() {
    const {message} = this.state;
    this.socket.emit('chat message', message);
  }

  clearMessage() {
    this.setState({
      message: '',
    });
  }

  render() {
    const {message, chatMessages} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.body}>
          <ScrollView>
          <Messages allMessages={chatMessages} />

          </ScrollView>
          <View style={styles.textInputContainer}>
            <TextInput
              placeholder={'Escribir...'}
              style={styles.textInput}
              autoCorrect={false}
              value={message}
              onChangeText={message => {
                this.setState({message});
              }}
              onSubmitEditing={() => {
                this.submitMessage();
                this.clearMessage();
              }}
            />
            <View
              style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
              <TouchableOpacity style={styles.touchable} onPress={() => {
                this.submitMessage();
                this.clearMessage();
              }}>
                <Text style={{color: Colors.white, fontWeight: 'bold'}}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: 'rgb(255, 255, 255)',
    flex: 1,
  },
  textInputContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: 'rgb(49, 32, 221)',
  },
  textInput: {
    width: '80%',
    height: 50,
    borderWidth: 2,
    borderColor: 'rgba(49, 32, 221, 0.3)',
    borderRadius: 8,
    backgroundColor: 'rgb(242, 243, 247)',
    marginVertical: 10,
    marginLeft: 5, 
    paddingLeft: 10
  },
  touchable: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgb(126,154, 210)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
