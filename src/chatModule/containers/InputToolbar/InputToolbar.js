/**
 * InputToolbar
 * the Component which show InputToolbar
 *
 * @zack
 */
 import React, { Component } from 'react';
 import {
   StyleSheet,
   View,
   ViewPropTypes,
 } from 'react-native';
 import PropTypes from 'prop-types';

 import Composer from './Composer';
 import Send from './Send';
 import Actions from './Actions';

 class InputToolbar extends Component {

   renderActions() {
     if (this.props.renderActions) {
       return this.props.renderActions(this.props);
     } else if (this.props.onPressActionButton) {
       return <Actions {...this.props} />;
     }
     return null;
   }

   renderSend() {
     if (this.props.renderSend) {
       return this.props.renderSend(this.props);
     }
     return (
       <Send
         {...this.props}
       />
     );
   }

   renderComposer() {
     if (this.props.renderComposer) {
       return this.props.renderComposer(this.props);
     }
     return (
       <Composer
          ref = 'composerRef'
          {...this.props}
       />);
   }

   renderAccessory() {
     if (this.props.renderAccessory) {
       return (
         <View style={[styles.accessory, this.props.accessoryStyle]}>
           {this.props.renderAccessory(this.props)}
         </View>
       );
     }
     return null;
   }

   render() {
     return (
       <View style={[styles.container, this.props.containerStyle]}>
         <View style={[styles.primary, this.props.primaryStyle]}>
           {this.renderActions()}
           {this.renderComposer()}
           {this.renderSend()}
         </View>
         {this.renderAccessory()}
       </View>
     );
   }
 }

 const styles = StyleSheet.create({
   container: {
     borderTopWidth: StyleSheet.hairlineWidth,
     borderTopColor: '#b2b2b2',
     backgroundColor: '#FFFFFF',
   },
   primary: {
     flexDirection: 'row',
     justifyContent: 'flex-end',
     alignItems: 'flex-end',
   },
   accessory: {
     height: 31,
   },
 });

 InputToolbar.defaultProps = {
   renderAccessory: null,
   renderActions: null,
   renderSend: null,
   renderComposer: null,
   onPressActionButton: null,
   containerStyle: {},
   primaryStyle: {},
   accessoryStyle: {},
 };

 InputToolbar.propTypes = {
   renderAccessory: PropTypes.func,
   renderActions: PropTypes.func,
   renderSend: PropTypes.func,
   renderComposer: PropTypes.func,
   onPressActionButton: PropTypes.func,
   containerStyle: ViewPropTypes.style,
   primaryStyle: ViewPropTypes.style,
   accessoryStyle: ViewPropTypes.style,
 };

module.exports = InputToolbar;
