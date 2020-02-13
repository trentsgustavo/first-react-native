import React, { Component } from "react";
import { StatusBar } from "react-native";

import './config/Reactotron';

import Routes from './routes';

console.tron.log('Hello World');

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1"></StatusBar>
      <Routes />
    </>
  );
}
