//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// create a component
class Ball extends Component {
    //  constructor(props) {
    //     super(props);
    //     }

    render() {
        return (
            <View style={styles.ball} />
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    ball: {
        height: 60,
        width: 60,
        borderRadius: 30,
        borderWidth: 30,
        borderColor: 'green'
    },
});

//make this component available to the app
export default Ball;
