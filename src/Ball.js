//import liraries
import React, { Component } from 'react';
import { View, Animated, StyleSheet, TouchableWithoutFeedback } from 'react-native';

// create a component
class Ball extends Component {
    constructor(props) {
        super(props);

        this.state = {
            move: false
        };
    }


    componentWillMount() {
        this.position = new Animated.ValueXY(0, 0);
        Animated.spring(this.position, {
            toValue: { x: 200, y: 500 },
        }).start();
    }


    render() {
        console.log('ball');
        return (
            <TouchableWithoutFeedback onPress={this.setState({ move: true })}>
                <Animated.View style={this.state.move ? this.position.getLayout() : null}>
                    <View style={styles.ball} />
                </Animated.View >
            </TouchableWithoutFeedback>
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
