import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {WebView} from 'react-native-webview';

export default class Repo extends Component{

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repository').html_url,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  render(){
    return <WebView source={{uri: repository.html_url}} style={{flex: 1}}/>;
  }

};
