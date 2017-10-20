//import liraries
import React, { Component } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

// create a component
class Ball extends Component {
    //  constructor(props) {
    //     super(props);
    //     }


    componentWillMount() {
        this.position = new Animated.ValueXY(0, 0);
        Animated.spring(this.position, {
            toValue: { x: 200, y: 500 },
        }).start();
    }


    render() {
        return (
            <Animated.View style={this.position.getLayout()}>
                <View style={styles.ball} />
            </Animated.View >
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
