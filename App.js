import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

type Props = {};

const Users= [
  { id: "1", uri: require('./Images/rn.png')},
  { id: "2", uri: require('./Images/rn1.png')},
  { id: "3", uri: require('./Images/rn2.png')},
  { id: "4", uri: require('./Images/rn3.png')},
];

export default class App extends Component<Props> {

  constructor(props) {
    super(props);

    this.position = new Animated.ValueXY(0)

    this.rotate = this.position.x.interpolate({
      inputRange: [ -SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2 ],
      outputRange: [ '-10deg', '0deg', '10deg' ],
      extrapolate: 'clamp'
    });

    this.rotateAndTranslate= {
      transform: [
      {
        rotate: this.rotate,
      },
      ...this.position.getTranslateTransform()
      ]
    }

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [ -SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2 ],
      outputRange: [ 0, 0, 1 ],
      extrapolate: 'clamp'
    })

    this.dislike = this.position.x.interpolate({
      inputRange: [ -SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2 ],
      outputRange: [ 1, 0, 0 ],
      extrapolate: 'clamp'
    })

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [ -SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2 ],
      outputRange: [ 1, 0, 1 ],
      extrapolate: 'clamp'
    })

    this.nextCardScale = this.position.x.interpolate({
      inputRange: [ -SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2 ],
      outputRange: [ 1, 0.9, 1 ],
      extrapolate: 'clamp'
    })

    this.state= {
      currentIndex: 0
    };
  }

  componentWillMount() {
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,

      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      
      onPanResponderRelease: (evt, gestureState) => {
        if( gestureState.dx > 120 ) {
          Animated.spring( this.position, {
            toValue: { x: SCREEN_WIDTH +100, y: gestureState.dy }
          }).start(()=> {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, ()=> {
              alert('Yes')
              this.position.setValue({ x: 0, y: 0 })
            })
          });
        }

        if( gestureState.dx < -120 ) {
          Animated.spring( this.position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
          }).start(()=> {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, ()=> {
              alert('No')
              this.position.setValue({ x: 0, y: 0 })
            })
          });
        }

        else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            tension: 70
          }).start();
        }

      }
    })
  }

  renderUsers(){
    return Users.map((item, i)=> {

      if( i < this.state.currentIndex ) {
        return null
      }

      else if( i === this.state.currentIndex ) {
        return (
          <Animated.View 
            {...this.PanResponder.panHandlers}
            key= {item.id} style= {[ this.rotateAndTranslate, { height: SCREEN_HEIGHT - 200, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}>

            <Animated.View 
              style= {[ { opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }]}, { position: 'absolute', top: 50, left: 40, zIndex: 1000 }]}>
              <Text style= {{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>
                LIKE
              </Text>
            </Animated.View>

            <Animated.View 
              style= {[ { opacity: this.dislike, transform: [{ rotate: '30deg' }]}, { position: 'absolute', top: 50, right: 40, zIndex: 1000 }]}>
              <Text style= {{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>
                NOPE
              </Text>
            </Animated.View>

            <Image
              key= {item.id}
              resizeMode= 'cover'
              style= {{ flex: 1, height: null, width: null, borderRadius: 20 }}
              source= {item.uri} />
            <Text key= {item.id} style= {{ position: 'absolute', bottom: 20, left: 20, fontSize: 20, color: 'white' }}>
              Hello
            </Text>
          </Animated.View>)  
      }

      else {
        return (
          <Animated.View 
            key= {item.id} style= {[ { opacity: this.nextCardOpacity, transform: [{ scale: this.nextCardScale }] }, 
              { height: SCREEN_HEIGHT - 200, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}>
            <Image
              key= {item.id}
              resizeMode= 'cover'
              style= {{ flex: 1, height: null, width: null, borderRadius: 20 }}
              source= {item.uri} />
          </Animated.View>)
      }

    }).reverse();
  }

  render() {
    return (
      <View style= {{ flex: 1 }}>
        <View style= {{ height: 60 }}>
        </View>

        <View style= {{ flex: 1 }}>
          {
            this.state.currentIndex -1 === Users.length ? 
            (<Text>Done</Text>) :
            this.renderUsers()
          }
        </View>

        <View style= {{ height: 60 }}>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
