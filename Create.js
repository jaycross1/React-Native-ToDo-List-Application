import React, { Component } from "react";
import { View, ScrollView, Picker } from "react-native";

import { NavigationEvents } from "react-navigation";
import { Text, Button, Input } from "react-native-elements";
import appConfig from "../config/appConfig";
import axios from "axios";
//http requests
import Spinner from 'react-native-loading-spinner-overlay';
//gets input datetimepicker libary shows calendar
import DateTimePicker from "react-native-modal-datetime-picker";

import Header from "./Header";

export default class Create extends Component {
    constructor(props) {
        super(props);
        //state variables
        this.state = {
            title: "",
            description: "",
            priority: "General",
            created_at: "",
            scheduled_at: "",
            spinner: false,
            isDateTimePickerVisible: false
        };
        //bind createTodo function
        this.createTodo = this.createTodo.bind(this);
    }

    //drawer navigation title, it will not be changed
    static navigationOptions = {
        drawerLabel: "Add Todo",
    };

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
        this.setState({ scheduled_at: date, created_at: new Date().toLocaleString() });
        this.hideDateTimePicker();
    };



    //createTodo function
    async createTodo() {
// this means if title is blank it shows an error so user cannot progress
        if (!this.state.title) {
            alert("Title cannot be blank");
            return;
        }
        if (!this.state.scheduled_at) {
            alert("Schedule time cannot be blank");
            return;
        }
        //import URL from appConfig file
        let { todoURL } = appConfig;


        this.setState({ spinner: true });
        //axios for http request
        const promise = await axios({
            //set request method,url and data for POST request
            method: "POST",
            //posting information to the database
            url: todoURL,
            data: this.state
        });
        this.setState({ spinner: false });
        //After successful http request navigate to home page 
        this.props.navigation.navigate("Todo");
    }

    render() {
        return (<ScrollView>
            <Header title="Create Todo" navigation={this.props.navigation}/>
            <Spinner visible={this.state.spinner} textContent={""} textStyle={{ color: '#FFF' }} cancelable={true} />
            <DateTimePicker
                mode='datetime'
                is24Hour={false}
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this.handleDatePicked}
                onCancel={this.hideDateTimePicker}
            />

            {/* Todo name input field */}
            <Input
                inputContainerStyle={{ marginTop: 25 }}
                placeholder='Enter Title'
                // this will gets called when we update text of input field
                onChangeText={(value) => this.setState({ title: value })}
            />
            {/* Description input field */}
            <Input
                inputContainerStyle={{ marginTop: 25 }}
                placeholder='Enter Description'
                // this will gets called when we update text of input field
                onChangeText={(value) => this.setState({ description: value })}
            />
            <View style={{ flexDirection: "row", flex: 1, margin: 10 }}>
                <View style={{ flex: 1, fontSize: 20, marginTop: 25 }}><Text>Select Priority : </Text></View>
                <View style={{ flex: 1 }}><Input
                inputContainerStyle={{ marginTop: 25 }}
                placeholder='Enter Priority'
                // this will gets called when we update text of input field
                onChangeText={(value) => this.setState({ priority: value })}

            /></View>
            </View>
            <Button style={{ flex: 1 }}
                buttonStyle={{ width: 200, marginTop: 10, alignSelf: "center", backgroundColor: "#F4A460" }}
                title="Input Scheduled Time"

                onPress={this.showDateTimePicker}
            />

            {/* Submit button */}

            <Button style={{ flex: 1 }}
                buttonStyle={{ width: 250, marginTop: 35, alignSelf: "center", backgroundColor: "#CD5C5C" }}
                title="Create Todo"

                onPress={this.createTodo}
            />

        </ScrollView>)
    }
}