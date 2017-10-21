//import liraries
import React, { Component } from 'react';
import { View, Animated, StyleSheet, PanResponder } from 'react-native';

// create a component
class Deck extends Component {
    constructor(props) {
        super(props);

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                // console.log(gesture);
            },
            onPanResponderRelease: () => {},
        });

    }

    renderCards() {
        return this.props.data.map(item => {
            return this.props.renderCard(item);
        });
    }
    
    render() {
        return (
            <View {...this.panResponder.panHandlers}>
            {this.renderCards()}
            </View>
        );
    }
}

// // define your styles
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#2c3e50',
//     },
// });

//make this component available to the app
export default Deck;
