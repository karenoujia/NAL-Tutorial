import React, {Component} from 'react'

class FileInput extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.fileInput = React.createRef()
    this.handleFileUpload = props.handleFileUpload
  }

  handleSubmit(event) {
    event.preventDefault()
    // const file = this.fileInput.current.files[0]
    // console.log(`Selected file is ${file.name}`)
    // this.handleFileUpload(file)
    for (var i = 0; i < this.fileInput.current.files.length; i++) {
      const file = this.fileInput.current.files[i]
      console.log(`Selected file is ${file.name}`)
      this.handleFileUpload(file)
    }
  }

  render() {
    return(
      <form onSubmit={this.handleSubmit}>
        <label>
          Upload file:
          <input type="file" ref={this.fileInput} />
        </label>
        <br />
        <button type="submit">Upload</button>
      </form>
    )
  }
}

export default FileInput
