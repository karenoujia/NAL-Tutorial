import React, { Component } from 'react';
import { Stitch, AnonymousCredential } from 'mongodb-stitch-browser-sdk'
import { AwsServiceClient, AwsRequest } from 'mongodb-stitch-browser-services-aws'
import './App.css';
import FileInput from './FileInput.js'

const convertImageToBSONBinaryObject = file => {
  return new Promise(resolve => {
    var fileReader = new FileReader()
    fileReader.onload = event => {
      resolve({
        $binary: {
          base64: event.target.result.split(',')[1],
          subType: '00'
        }
      })
    }
    fileReader.readAsDataURL(file)
  })
}

class StitchApp extends Component {
  constructor(props) {
    super(props)
    this.appId = props.appId
    this.client = Stitch.initializeDefaultAppClient(this.appId)
    this.client.auth.loginWithCredential(new AnonymousCredential()).then(user => {
      console.log('Logged in as anonymous user with id ${user.id}')
    }).catch(console.error)
    this.aws = this.client.getServiceClient(AwsServiceClient.factory, 'AWS')
    this.handleFileUpload = this.handleFileUpload.bind(this)
  }

  handleFileUpload(file) {
    if (!file) {
      return
    }

    convertImageToBSONBinaryObject(file).then(result => {
      //const picstream = this.mongodb.db('data').collection('picstream')

      //this will be the authenticated user's id and file name
      const key = `${this.client.auth.user.id}-${file.name}`
      const bucket = 'stitchcraft-picstream'
      const url = `http://${bucket}.s3.amazonaws.com/${encodeURIComponent(key)}`

      const args = {
        ACL: 'public-read',
        Bucket: bucket,
        ContentType: file.type,
        Key: key,
        Body: result
      }

      const request = new AwsRequest.Builder()
        .withService('s3')
        .withAction('PutObject')
        .withRegion('us-east-1')
        .withArgs(args)

        this.aws().execute(request.build())
        .then(result => {
          console.log(result)
          console.log(url)
        })

    })
  }

  render() {
    return (
      <div className="App">
        <div>
        <FileInput handleFileUpload={this.handleFileUpload} />
        </div>
      </div>
    );
  }
}

export default StitchApp;
