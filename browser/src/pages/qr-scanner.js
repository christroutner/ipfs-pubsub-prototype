import React, { Component } from 'react'
import loadable from '@loadable/component'

import '../assets/css/qr-scanner.css'
const QrReader = loadable(() => import('react-qr-reader'))


let _this
class Test extends Component {

  constructor(props) {
    super(props)
    _this =  this


    this.state = {
      result: 'No Result',
      facingMode: 'environment'
    }
  }

  handleScan = data => {
    if (data) {
      this.setState({
        result: data
      })
    }
  }
  handleError = err => {
    console.error(err)
    alert(err)
  }
  render() {
    return (
      <div className="QRScanner-container">
        <h4>Facing Mode: {_this.state.facingMode}</h4>
        <button className="change-button" onClick={_this.changeMode}>Change</button>
        <QrReader
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
          facingMode={_this.state.facingMode}
        />
        <b><p className="qr-result">{this.state.result}</p></b>
      </div>
    )
  }
  
  changeMode() {
    let mode = _this.state.facingMode === 'user' ?
      'environment' : 'user'
    console.log(`changing to ${mode} mode`)
    _this.setState({
      facingMode: mode
    })
  }
}

export default Test
