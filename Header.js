import React, { Component } from "react";
import { View, Platform, Alert,Text } from "react-native";

import { Header } from "react-native-elements";
import reduxStore from "../redux/reduxStore";

export default class CustomHeader extends Component {
    constructor(props) {
        super(props);
        //super makes the props available 
        //prop can't be modified

    }

    render() {
        return <View>
            <Header
                leftComponent={{
                    icon: 'menu',
                    color: '#fff',
                    onPress: () => this.props.navigation.toggleDrawer(),
                }}
                centerComponent={{ text: this.props.title, style: { color: '#fff' } }}
                containerStyle={{ marginTop: Platform.OS === 'ios' ? 0 : - 30, backgroundColor: "#CD5C5C" }}
                rightComponent={{
                    //this shows we are taking data from the redux store and showing the items number
                    text: <Text style={{color:"white"}}>{reduxStore.getState()} Items</Text>,
                    style: { color: '#fff' },
                }}
            />

        </View>
    }
}