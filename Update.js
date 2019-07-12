import React, { Component } from "react";
import { View, ScrollView, FlatList, TouchableOpacity, Alert, Picker } from "react-native";

import { NavigationEvents } from "react-navigation";
import { Text, Button, Input } from "react-native-elements";
import appConfig from "../config/appConfig";
import axios from "axios";
import Spinner from 'react-native-loading-spinner-overlay';
import DateTimePicker from "react-native-modal-datetime-picker";
import Header from "./Header";
import moment from "moment";

export default class AddTodo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //initial state data
            title: "",
            description: "",
            priority: "General",
            created_at: "",
            scheduled_at: "",
            previous_selected_time:"",
            spinner: false,
            isDateTimePickerVisible: false
        };

        this.submit = this.submit.bind(this);
        this.assignValues = this.assignValues.bind(this);
    }
    //we don't want to show this view in the slider; that's why it's null
    static navigationOptions = {
        drawerLabel: () => null,
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
    //getting data from the previous view and updating this 
    assignValues() {
        const data = this.props.navigation.getParam("data");
        //get data from the server and set them to state
        this.setState({ title: data.title, description: data.description,previous_selected_time:data.scheduled_at, priority: data.priority, created_at: data.created_at, scheduled_at: data.scheduled_at });
    }
    //update function
    async submit() {
        let { todoURL } = appConfig;
       
        const data = this.props.navigation.getParam("data");
        todoURL = todoURL + "/" + data._id;

        const promise = await axios({
            method: "put",
            url: todoURL,
            data: this.state
        });

        //after update navigate to home page
        this.props.navigation.navigate("Todo");
    }

    render() {
        return (<ScrollView>
            <NavigationEvents onDidFocus={this.assignValues} />
            <Header title="Update Todo" navigation={this.props.navigation} />
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
                value={this.state.title}
                inputContainerStyle={{ marginTop: 25 }}
                placeholder='Enter Title'
                // this will gets called when we update text of input field
                onChangeText={(value) => this.setState({ title: value })}
            />
            {/* Description input field */}
            <Input
                value={this.state.description}
                inputContainerStyle={{ marginTop: 25 }}
                placeholder='Enter Description'
                // this will gets called when we update text of input field
                onChangeText={(value) => this.setState({ description: value })}
            />
           <View style={{ flexDirection: "row", flex: 1, margin: 10 }}>
                <View style={{ flex: 1, fontSize: 20, marginTop: 25 }}><Text>Select Priority : </Text></View>
                <View style={{ flex: 1 }}><Input
                inputContainerStyle={{ marginTop: 25 }}
                value={this.state.priority}
                placeholder='Enter Priority'
                // this will gets called when we update text of input field
                onChangeText={(value) => this.setState({ priority: value })}

            /></View>
            </View>
            
            <Text style={{ textAlign: "center" }}>Previous Selected Time : {new Date(this.state.previous_selected_time).toLocaleDateString()} ({
                        moment(new Date(this.state.previous_selected_time).toLocaleTimeString(), 'HH:mm').format('hh:mm a')})</Text>
            <Button style={{ flex: 1 }}
                buttonStyle={{ width: 200, marginTop: 10, alignSelf: "center", backgroundColor: "#808080" }}
                title="Input Scheduled Time"

                onPress={this.showDateTimePicker}
            />

            <Button style={{ flex: 1 }}
                buttonStyle={{ width: 150, marginTop: 25, alignSelf: "center" }}
                title="Update"

                onPress={this.submit}
            />

        </ScrollView>)
    }
}