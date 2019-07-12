import React, { Component } from 'react';

import { createDrawerNavigator, createAppContainer } from "react-navigation";

import Todo from "./component/Todo";
import Create from "./component/Create";
import Details from "./component/Details";
import Update from "./component/Update";

//drawer navigator creation
const todoNavigator = createDrawerNavigator({
  Todo: {
    screen: Todo,
  },
  Create:{
    screen:Create
  },
  Details:{
    screen:Details
  },
  Update:{
    screen:Update,
  }

});
//export drawer navigation, it contains the whole navigation draw such as the screen designs, 
export default createAppContainer(todoNavigator);
