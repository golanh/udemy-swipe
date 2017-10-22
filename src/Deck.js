//import liraries
import React, { Component } from 'react';
import {
    View,
    Animated,
    StyleSheet,
    PanResponder,
    Dimensions,
    LayoutAnimation,
    UIManager
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

// create a component
class Deck extends Component {
    static defaultProps = {
        onSwipeRight: () => { },
        onSwipeLeft: () => { },
        renderNoMoreCards: () => { },
    }

    constructor(props) {
        super(props);

        this.position = new Animated.ValueXY();
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                this.position.setValue({ x: gesture.dx });
            },
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                    this.forceSwipe('right');
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    this.forceSwipe('left');
                } else {
                    this.resetPosition();
                }
            },
        });

        this.state = {
            index: 0,
        };
    }

    componentWillUpdate(nextProps, nextState) {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.spring();
    }
    

    forceSwipe(direction) {
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;

        Animated.timing(this.position, {
            toValue: { x, y: 0 },
            duration: SWIPE_OUT_DURATION
        }).start(() => this.onSwipeComplete(direction));
    }

    onSwipeComplete(direction) {
        const { onSwipeRight, onSwipeLeft, data } = this.props;
        const item = data[this.state.index];

        direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
        this.position.setValue({ x: 0, y: 0 });
        this.setState({ index: this.state.index + 1 });
    }

    getCardStyle() {
        const rotate = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
            outputRange: ['-120deg', '0deg', '120deg']
        });

        return {
            ...this.position.getLayout(),
            transform: [{ rotate }]
        };
    }

    resetPosition() {
        Animated.spring(this.position, {
            toValue: { x: 0, y: 0 }
        }).start();
    }

    renderCards() {
        if (this.state.index >= this.props.data.length) {
            return this.props.renderNoMoreCards();
        }

        return this.props.data.map((item, index) => { //item === card, index === index of card in array
            if (index < this.state.index) {
                return null;
            }
            if (index === this.state.index) {
                return (
                    <Animated.View
                        key={item.id}
                        style={[this.getCardStyle(), styles.cardStyle]}
                        {...this.panResponder.panHandlers}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                );
            }
            return (
                <Animated.View key={item.id} style={[styles.cardStyle, { zIndex: index * -1, top: 10 * (index - this.state.index) }]}>
                    {this.props.renderCard(item)}
                </Animated.View>
            );
        });
    }

    render() {
        return (
            <View>
                {this.renderCards()}
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    cardStyle: {
        position: 'absolute',
        width: SCREEN_WIDTH,
        // height: Dimensions.get('window').height
    },
});

//make this component available to the app
export default Deck;
