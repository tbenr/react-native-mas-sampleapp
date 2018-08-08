/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import mas from 'react-native-mas';


const msso_config = Platform.select({
  ios: require('./mas_assets/ios_msso_config.json'),
  android: require('./mas_assets/android_msso_config.json')
});


//const msso_config = require('./mas_assets/android_msso_config.json');
const msso_config_str = JSON.stringify(msso_config);

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = { isMASinitialized: false, MASloggedin: null, apiresult: null };
    this._onMasInit = this._onMasInit.bind(this);
    this._onMasLogin = this._onMasLogin.bind(this);
    this._onMasCallApi = this._onMasCallApi.bind(this);
    this._onMasLogout = this._onMasLogout.bind(this);
  }

  _onMasInit() {
    mas.debug();
    mas.init(msso_config_str)
      .then(() => {
        this.setState({ isMASinitialized: true });
        console.log("MAS init ok");
      })
      .catch(() => {
        this.setState({ isMASinitialized: false });
        console.log("MAS init error");
      });
  }


  _onMasLogin() {
    mas.login()
      .then((id) => {
        this.setState({ MASloggedin: id });
        console.log("MAS loggedin!");
      })
      .catch(() => {
        this.setState({ MASloggedin: null });
        //Alert(error);
      });

  }

  _onMasCallApi() {
    mas.invoke("/testmas")
      .then((result) => {
        this.setState({ apiresult: result });
        console.log("MAS apicall success: " + result);
      })
      .catch((err) => {
        this.setState({ apiresult: err });
        //Alert(error);
      });

  }

  _onMasLogout() {
    mas.logout()
      .then(() => {
        this.setState({ MASloggedin: null, apiresult: null });
        console.log("MAS loggedout");
      })
      .catch(() => {
        console.log("MAS logout error");
        Alert('MAS logout error');
      });

  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native{'\n'}CA MAG enabled!</Text>
        <Text style={styles.instructions}></Text>

        <Button
          onPress={this._onMasInit}
          title="Init MAS!"
          color="green"
          disabled={this.state.isMASinitialized}
        />
        <Text style={styles.instructions}>{'MAS initialized: '}{this.state.isMASinitialized ? 'true' : 'false'}</Text>


        <Button
          onPress={this._onMasLogin}
          title="Login UI MAS!"
          color="green"
          disabled={this.state.MASloggedin != null}
        />


        <Text style={styles.instructions}>{'MAS loggedin: '}{this.state.MASloggedin}</Text>


        <Button
          onPress={this._onMasCallApi}
          title="call API!"
          color="orange"
        />

        <Text style={styles.instructions}>{'api result: '}{this.state.apiresult}</Text>
        <Text style={styles.instructions}></Text>
        <Button
          onPress={this._onMasLogout}
          title="Logout MAS!"
          color="green"
          disabled={this.state.MASloggedin == null}
        />

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