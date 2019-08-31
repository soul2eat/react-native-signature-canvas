import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import htmlContent from './h5/html';
import injectedSignaturePad from './h5/js/signature_pad';
import injectedApplication from './h5/js/app';

import { WebView } from 'react-native-webview';

const styles = StyleSheet.create({
  webBg: {
    width: '100%',
    backgroundColor: '#FFF',
    flex: 1
  }
});
const actions = {isEmpty:[], getImage: [], clear: []};
const isEmptyInj = 
class SignatureView extends Component {
  static defaultProps = {
    webStyle: '',
    onOK: () => { },
    onEmpty: () => { },
    descriptionText: 'Sign above',
    clearText: 'Clear',
    confirmText: 'Confirm',
  };

  constructor(props) {
    super(props);
    const { descriptionText, clearText, confirmText, emptyText, webStyle } = props;
    this.state = {
      base64DataUrl: props.dataURL || null
    };

    const injectedJavaScript = injectedSignaturePad + injectedApplication;
    let html = htmlContent(injectedJavaScript);
    html = html.replace('<%style%>', webStyle);
    html = html.replace('<%description%>', descriptionText);
    html = html.replace('<%confirm%>', confirmText);
    html = html.replace('<%clear%>', clearText);

    this.source = { html };
  };
  webview = null;

  async emit(ev){
    if(ev === 'clear'){
      this.webview.injectJavaScript(`contextEv(${ev})`)
      return true;
    }

    if(actions[ev]){
      const p =  new Promise(res=>{
        actions[ev].push(res);
        this.webview.injectJavaScript(`contextEv(${ev})`);
      })
      return p;
    }
  }

  _renderError = args => {
    console.log("error", args);
  };

  render() {
    return (
      <View style={styles.webBg}>
        <WebView
          ref={ref => (this.webview = ref)}
          useWebKit={true}
          source={this.source}
          onMessage={handler}
          javaScriptEnabled={true}
          onError={this._renderError}
        />
      </View>
    );
  }
}
function handler(e){
  const data = JSON.parse(e.nativeEvent.data);
  const [p] = actions[data.action].splice(0, 1);
  if(p)
    p(data.value);
}
export default SignatureView;
