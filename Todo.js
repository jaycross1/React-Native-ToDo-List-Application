import React, { Component } from "react";
import { View, ScrollView, FlatList, TouchableOpacity, Alert } from "react-native";

import { NavigationEvents } from "react-navigation";
import { Text, Input } from "react-native-elements";
import appConfig from "../config/appConfig";
//axios is used for http request for the app
import axios from "axios";
//every network request shows a loading spinner
import Spinner from 'react-native-loading-spinner-overlay';
import Header from "./Header";
//created in redux folder
import reduxStore from "../redux/reduxStore";
//there are two types of components, stateless and with state, component that has a state starts with a class
//initial states of the app, blank space
//state can be changed using this.setstate
//prop cant be modified
export default class Todo extends Component {
    constructor(props) {
        //initiates when the component loads for first time, fetches all data on the screen so it can be displayed.
        super(props);
        this.state = {
            todos: [],
            filtered: [],
            keyword: "",
            spinner: false,
        };

        this.load = this.load.bind(this);
        this.search = this.search.bind(this);
        //bind function happens so that when the to do component runs it will fetch the data accordingly
    }

    //search function
    search() {
        let result = [];
        for (let i = 0; i < this.state.todos.length; i++) {
            if (this.state.todos[i].title.toLowerCase().indexOf(this.state.keyword.toLowerCase()) !== -1) {
                //checks all todos and makes title in-senstive, pushes in array which is displayed in search results 
                result.push(this.state.todos[i]);
            }
        }
        this.setState({ filtered: result });
        //what you searched is being set in state filter.
    }

    //label of navigation drawer redirected to this page, (define the name to show the users)
    static navigationOptions = {
        drawerLabel: "All Todos",
    };

    async load() {
        //child component
        //aysynchronous and synchronous (thing before function starts)
        //import url from appConfig file, do not have to write url again and again
        let { todoURL } = appConfig;

        this.setState({ spinner: true });
        //shows loading spinner before the network request,
        console.log('called1.....')
        const promise = await axios({
            //basically you have to wait until you fetch all the ToDos from database, it will fail or it will run
            method: "GET",
            url: todoURL,
        });
        console.log('called2.....')


        this.setState({ spinner: false });
        // get server data and asign to state variable   
        console.log('called' ,promise.data)
        const data = promise.data;

        //store on the redux store (SET),
        reduxStore.dispatch({type:"SET",value:data.length});
        // setting data in redux


        // assigning data in two variables, todos and filtered
        // you have 10 items in the todos and you show 5 of those items using filter
        this.setState({ todos: data, filtered: data });
    }

    render() {
        return (<ScrollView> 
            {/* the header is all todos  */}
        <Header title="All Todos" navigation={this.props.navigation}/>
        <Spinner visible={this.state.spinner} textContent={""} textStyle={{ color: '#FFF' }} cancelable={true} />
            {/* gets called when this view gets focused, it shows the spinner */}
            <NavigationEvents onDidFocus={this.load} />
            {/* when we are on this page, it means load the data that is already there */}
            <Input
                inputContainerStyle={{ marginTop: 25, marginBottom: 25 }}
                placeholder='Title'
                // this will gets called when we update text of input field
                onChangeText={(value) => this.setState({ keyword: value }, this.search)}
            />
            {/* Flatlist accepts array and shows as a list view */}
            <FlatList
                data={this.state.filtered}
                renderItem={({ item }) => <TouchableOpacity style={{
                    flex: 0.3,
                    justifyContent: 'center',
                    alignItems: 'stretch',
                    borderWidth: 1,
                    borderColor: "black",
                    margin: 7,
                    padding: 7
                }}
                    key={item._id}
                    // when we click on list item we need to show the details of the item
                    onPress={() => this.props.navigation.navigate("Details", { id: item._id })}>
 
                    <View key={item}>
                        <Text style={{ fontSize: 17, textAlign: "center" }}>Title : {item.title}</Text>
                        <Text style={{ fontSize: 17, textAlign: "center" }}>Priority : {item.priority}</Text>
                    </View>

                </TouchableOpacity>}
                //Unique ID
                keyExtractor={(item, index) => index.toString()} />
                
        </ScrollView>)
    }
}