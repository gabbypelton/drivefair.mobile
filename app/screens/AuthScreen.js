import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Button,
  ButtonGroup,
  Layout,
  Spinner,
  Text,
} from '@ui-kitten/components';

import {login, loginWithToken} from '../actions/session';
import Login from '../components/organisms/Login';
import Registration from '../components/organisms/Registration';
import {mainRoot} from '../navigation';
import {screenStyles} from '../theme/styles';

export class AuthScreen extends Component {
  state = {
    screen: 'login',
  };

  componentDidMount = async () => {
    const authToken = await AsyncStorage.getItem('authToken');
    if (authToken) {
      this.props.loginWithToken(authToken);
    }
  };

  componentDidUpdate() {
    if (this.props.isLoggedIn) {
      Navigation.setRoot(mainRoot);
    }
  }

  handleChange({name, value}) {
    this.setState({[name]: value});
  }

  handleSubmit() {
    this.props.login({...this.state});
  }

  render() {
    if (this.props.isLoading) {
      return (
        <Layout style={screenStyles.container}>
          <Layout style={screenStyles.container}>
            <Text style={styles.text}>Logging in...</Text>
            <Spinner size="giant" />
          </Layout>
        </Layout>
      );
    }
    return (
      <Layout style={screenStyles.container}>
        <Layout style={styles.form}>
          {this.state.screen === 'login' ? <Login /> : <Registration />}
        </Layout>
        <Layout style={styles.selection}>
          <ButtonGroup>
            <Button
              selected={this.state.screen === 'login'}
              onPress={() => this.setState({screen: 'login'})}>
              Login
            </Button>
            <Button onPress={() => this.setState({screen: 'register'})}>
              Register
            </Button>
          </ButtonGroup>
        </Layout>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  form: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    margin: 30,
  },
});

const mapStateToProps = (state) => ({
  isLoggedIn: state.session.isLoggedIn,
  isLoading: state.session.isLoading,
});

const mapDispatchToProps = {
  login,
  loginWithToken,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
