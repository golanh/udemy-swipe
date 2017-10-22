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

    componentWillReceiveProps(nextProps) {
        //reset deck index when new data arrived
        if (nextProps.data !== this.props.data) {
            this.setState({ index: 0 });
        }
    }

    componentWillUpdate() {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.spring();
    }

    forceSwipe(direction) { // direction: direction of swipe === 'right'/'left'
        const newX = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;

        //swipe out configuration
        Animated.timing(this.position, {
            toValue: { x: newX, y: 0 },
            duration: SWIPE_OUT_DURATION
        }).start(() => this.onSwipeComplete(direction));
    }

    onSwipeComplete(direction) { // direction: direction of swipe === 'right'/'left'
        const { onSwipeRight, onSwipeLeft, data } = this.props;
        const item = data[this.state.index];

        //execute corresponding prop function
        direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);

        //advance index to display next card
        this.setState({ index: this.state.index + 1 });

        //reset this.position for next card display
        this.position.setValue({ x: 0, y: 0 });
    }

    getCardStyle() {
        //rotation configuration
        const rotate = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
            outputRange: ['-120deg', '0deg', '120deg']
        });

        //style object returned
        return {
            ...this.position.getLayout(),
            transform: [{ rotate }]
        };
    }

    //reset this.position to starting coordinates
    resetPosition() {
        Animated.spring(this.position, {
            toValue: { x: 0, y: 0 }
        }).start();
    }

    renderCards() {
        if (this.state.index >= this.props.data.length) { // JSX to display when list is empty
            return this.props.renderNoMoreCards();
        }

        return this.props.data.map((item, index) => { //item === card, index === index of card in array
            
            //dont display swiped cards
            if (index < this.state.index) {
                return null;
            }
            
            if (index === this.state.index) {
            //assign swipe gestures to displayed card
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
            //stack unswiped cards
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
    },
});

//make this component available to the app
export default Deck;
