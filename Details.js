import React, { Component } from "react";
import { View, ScrollView, FlatList, TouchableOpacity, Alert } from "react-native";

import { NavigationEvents } from "react-navigation";
import { Text, Button } from "react-native-elements";
import appConfig from "../config/appConfig";
import axios from "axios";
import Spinner from 'react-native-loading-spinner-overlay';
import Header from "./Header";
import moment from "moment";
export default class Details extends Component {
    constructor(props) {
        super(props);
        //initial state declaration
        this.state = {
            details: {},
            spinner: false,
        };

        this.loadDetails = this.loadDetails.bind(this);
        this.deleteTodo = this.deleteTodo.bind(this);
    }
    //we don't want to show the details in the slider; that's why it's null
    static navigationOptions = {
        drawerLabel: () => null,
    };

    async loadDetails() {
        let { todoURL } = appConfig;
        //get todo id from the previoud view and configure the url
        todoURL = todoURL + "/" + this.props.navigation.getParam("id");
        
        this.setState({ spinner: true });
        
        const promise = await axios({
            method: "GET",
            url: todoURL,
        });
        
        this.setState({ spinner: false });
        
        const data = promise.data;
        //set server data to state variables
        this.setState({ details: data });
    }
    //handle delete function
    async deleteTodo() {
        let { todoURL } = appConfig;
        todoURL = todoURL + "/" + this.props.navigation.getParam("id");
        
        this.setState({ spinner: true });
        
        const promise = await axios({
            method: "delete",
            url: todoURL,
        });
        
        this.setState({ spinner: false });
        //after successfully deletion we'll navigate to todo list view
        this.props.navigation.navigate("Todo");
    }

    render() {
        return (<ScrollView>
            <Header title="Details" navigation={this.props.navigation}/>
            <Spinner visible={this.state.spinner} textContent={""} textStyle={{ color: '#FFF' }} cancelable={true} />
            <NavigationEvents onDidFocus={this.loadDetails} />

            {/* Todo details showing */}
            <View style={{ padding: 10, margin: 10 }}>
                <Text>Title : {this.state.details.title}</Text>
                <Text>Description : {this.state.details.description}</Text>
                <Text>Priority : {this.state.details.priority}</Text>
                {/* getting date time and converting to local time zone. */}
                <Text>Scheduled At : {new Date(this.state.details.scheduled_at).toLocaleDateString()} ({
                        moment(new Date(this.state.details.scheduled_at).toLocaleTimeString(), 'HH:mm').format('hh:mm a')})
                      </Text>
                <Text>Created At : {new Date(this.state.details.created_at).toLocaleDateString()} ({
                        moment(new Date(this.state.details.created_at).toLocaleTimeString(), 'HH:mm').format('hh:mm a')})</Text>

            </View>

            <View style={{ flexDirection: "row", flex: 1, margin: 10 }}>

                {/* update button */}
                <Button style={{ flex: 1 }}
                    buttonStyle={{ width: 150, marginTop: 25, backgroundColor: "green", marginLeft: 10, marginRight: 10 }}
                    title="Update"
                    // Clicking this user it will bring us to the update view
                    onPress={() => this.props.navigation.navigate("Update", { data: this.state.details })}
                />

                {/* delete button */}
                <Button style={{ flex: 1 }}
                    buttonStyle={{ width: 150, marginTop: 25, backgroundColor: "red", marginLeft: 10 }}
                    title="Delete"

                    onPress={this.deleteTodo}
                />

            </View>


        </ScrollView>)
    }
}