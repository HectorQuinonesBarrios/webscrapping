import React from 'react'
import axios from 'axios'
import { FormControl, TextField, Button, Input, InputLabel, Snackbar, Modal} from '@material-ui/core'
import Loader from 'react-loader-spinner'
import './../public/styles/main.scss'

class App extends React.PureComponent {
  state = { 
    image : '',
    modalOpen: false,
    open: false,
    openError: false,
    loading: false
  }
  desc = React.createRef()
  price = React.createRef()
  createAd = () => {
    let desc = this.desc.current.value
    let price = this.price.current.value
    if(desc && price){
      this.setState({loading:true})
      axios.post('/api/ad/create', {
        desc,
        price
      }).then(response => {
        this.setState({
          image: `data:image/png;base64,${response.data}`,
          modalOpen: true,
          loading:false
        })
      }).catch(error => {
        this.setState({
          openError: true,
          loading: false
        })
        setTimeout(() => {
          this.setState({openError: false})
        }, 3000)
      })
    } else {
      this.setState({open: true})
      setTimeout(() => {
        this.setState({open: false})
      }, 3000)
    }
    
  }
  render(){
    return (
      <div className="container">
        <div className="big-box">
          <div className="box1">
            <form noValidate={false}>
              <FormControl fullWidth={true}>
                <InputLabel>Precio</InputLabel>
                <Input 
                  id="price" 
                  aria-describedby="price" 
                  type="number" 
                  color="secondary"
                  fullWidth={true}
                  margin="dense"
                  inputRef={this.price}
                  required={true}
                />
                <TextField 
                  id="desc" 
                  aria-describedby="desc" 
                  multiline={true}
                  rows={5}
                  color="secondary"
                  placeholder="Descripcion"
                  fullWidth={true}
                  margin="dense"
                  inputRef={this.desc}
                  required={true}
                />
                <Button onClick={this.createAd} color="primary" variant="contained">Submit</Button>
              </FormControl>
            </form>
            <div className="loader">
              <Loader
                type="Circles"
                color= "#000000"
                visible={this.state.loading}
              />
            </div>
           
            <Snackbar
              open={this.state.open}
              ContentProps={{
                'aria-describedby': 'message-id',
              }}
              message={<span id="message-id">Todos los campos son requeridos</span>}
            />
            <Snackbar
              open={this.state.openError}
              ContentProps={{
                'aria-describedby': 'message-id',
              }}
              message={<span id="message-id">Oops paso algo</span>}
            />
            <Modal open={this.state.modalOpen}
            style={{width: '1000px', heigth: '1000px'}}>
              <img src={this.state.image}/>
            </Modal>
          </div>
        </div>
      </div>
      
    )
  }
}

export default App