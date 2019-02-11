import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const mapStateToProps = reduxStore => {
  return {
    reduxStore
  }
}

class AdminMusic extends Component {
  state = {
    id: 0,
    edit: false,
    name: '',
    file: '',
    instrument: '',
    difficulty: '',
    open: false,
    hidden: false,
    searchInstrument: '',
    searchDifficulty: 0,
    searchName: '',

  }

  componentDidMount() {
    this.props.dispatch({
      type: 'GET_SHEET_MUSIC'
    });

  }

  handleClick = (event) => {
    this.setState({ open: false });
    // event.preventDefault();
    const formData = new FormData();
    formData.append('file', this.state.file[0]);
    formData.append('name', this.state.name);
    formData.append('instrument', this.state.instrument);
    formData.append('difficulty', this.state.difficulty);
    axios.post(`/api/upload/sheet-music`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      console.log('response:', response.data.Location);
      this.props.dispatch({
        type: 'GET_SHEET_MUSIC'
      });
      // handle your response;
    }).catch(error => {
      console.log('error in posting file or submitting state', error);

    });
  }

  editHandleClick = (event) => {
    this.setState({ edit: false });
    // event.preventDefault();
    const formData = new FormData();
    formData.append('file', this.state.file[0]);
    formData.append('id', this.state.id);
    formData.append('name', this.state.name);
    formData.append('instrument', this.state.instrument);
    formData.append('difficulty', this.state.difficulty);
    axios.put(`/api/upload/edit-sheet-music`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      console.log('response:', response.data.Location);
      this.props.dispatch({
        type: 'GET_SHEET_MUSIC'
      });
      // handle your response;
    }).catch(error => {
      console.log('error in editing file or submitting state', error);

    });
  }

  //dialog handlers
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  editHandleClose = () => {
    this.setState({ edit: false });
  };

  //slider handlers
  // handleHiddenChange = (event, hidden) => {
  //   this.setState(state => ({
  //     hidden,
  //     // hidden implies !open
  //     open: hidden ? false : state.open,
  //   }));
  // };

  // handleSliderChange = () => {
  //   this.setState({
  //     active: false,
  //   });
  //   console.log('hit handleSlider:', this.state.active);
  //   this.props.dispatch({ type: 'UPDATE_PERSON', payload: this.state })
  // }

  handleInstrumentChange = (event) => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
    });

    console.log(this.state.instrument);

  }

  handleDifficultyChange = (event) => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
    });
    console.log(this.state.difficulty);
  }

  handleNameChange = (event) => {
    this.setState({
      ...this.state,
      name: event.target.value
    })
  };

  handleFileUpload = (event) => {
    this.setState({ file: event.target.files });
  };

  // handle delete
  deleteSheetMusic = (row) => {
    this.props.dispatch({ type: 'DELETE_SHEET_MUSIC', payload: row.id })
  }

  editSheetMusic = (row) => {
    this.setState({ id: row.id });
    this.setState({ edit: true });
  }
  
  handleSearchChange = (event) => {
    console.log('event was here', this.state)
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value

    });
  }

  submitSearch = () => {
    this.props.dispatch({
      type: 'SEARCH_SHEET_MUSIC', payload: {instrument: this.state.searchInstrument, difficulty: this.state.searchDifficulty, name: this.state.searchName}
    });
  }
  
  render() {
    return (
      // our edit dialog box 
      this.state.edit ?
        <Dialog
          open={this.state.edit}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit Music</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Edit Song
                </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="File Name"
              type="text"
              onChange={this.handleNameChange}
              value={this.state.name}
              fullWidth
            />
            <DialogContentText>
              Choose Instrument
                </DialogContentText>
            <Select
              value={this.state.instrument}
              onChange={this.handleInstrumentChange}
              inputProps={{
                name: 'instrument',
              }}
            >
              <MenuItem value={'Tenor'}>Tenor</MenuItem>
              <MenuItem value={'Seconds'}>Seconds</MenuItem>
              <MenuItem value={'Cello'}>Cello</MenuItem>
              <MenuItem value={'Bass'}>Bass</MenuItem>
            </Select>
            <DialogContentText>
              Choose Difficulty
            </DialogContentText>
            <Select
              value={this.state.difficulty}
              onChange={this.handleDifficultyChange}
              inputProps={{
                name: 'difficulty',
              }}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
            </Select>

          </DialogContent>
          <form onSubmit={this.submitFile}>
            <input label='upload file' type='file' onChange={this.handleFileUpload} />
          </form>
          <DialogActions>
            <Button onClick={this.editHandleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={() => this.editHandleClick()} color="primary">
              Submit
            </Button>
          </DialogActions>
          
        </Dialog> :

        <div>
          <h1 className="heading">
            Sheet Music
        </h1>
          <center>
            <div>
              
              <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                Add New Music
              </Button>
            {/* start sorting table */}
              <DialogContentText>
                Sort by Instrument
                </DialogContentText>
              <Select
                name='searchInstrument'
                value={this.state.searchInstrument}
                onChange={this.handleSearchChange}
                inputProps={{
                  name: 'searchInstrument',
                }}
              >
                <MenuItem value={'Tenor'}>Tenor</MenuItem>
                <MenuItem value={'Seconds'}>Seconds</MenuItem>
                <MenuItem value={'Cello'}>Cello</MenuItem>
                <MenuItem value={'Bass'}>Bass</MenuItem>
              </Select>
              <DialogContentText>
                Sort by Difficulty
                </DialogContentText>
              <Select
                name='searchDifficulty'
                value={this.state.searchDifficulty}
                onChange={this.handleSearchChange}
                inputProps={{
                  name: 'searchDifficulty',
                }}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
              </Select>
              <DialogContentText>
                Search by Song Name
              </DialogContentText>
              <TextField onChange={this.handleSearchChange} name='searchName'> 
              </TextField>
              <Button variant="outlined" color="primary" onClick={this.submitSearch}>Submit Search</Button>
              {/* start add new music */}
              <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">Add Music</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Add New Song
                </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="File Name"
                    type="text"
                    onChange={this.handleNameChange}
                    value={this.state.name}
                    fullWidth
                  />
                  <DialogContentText>
                    Choose Instrument
                </DialogContentText>
                  <Select
                    value={this.state.instrument}
                    onChange={this.handleInstrumentChange}
                    inputProps={{
                      name: 'instrument',
                    }}
                  >
                    <MenuItem value={'Tenor'}>Tenor</MenuItem>
                    <MenuItem value={'Seconds'}>Seconds</MenuItem>
                    <MenuItem value={'Cello'}>Cello</MenuItem>
                    <MenuItem value={'Bass'}>Bass</MenuItem>
                  </Select>
                  <DialogContentText>
                    Choose Difficulty
                </DialogContentText>
                  <Select
                    value={this.state.difficulty}
                    onChange={this.handleDifficultyChange}
                    inputProps={{
                      name: 'difficulty',
                    }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                  </Select>

                </DialogContent>
                <form onSubmit={this.submitFile}>
                  <input label='upload file' type='file' onChange={this.handleFileUpload} />
                  {/* <button type='submit'>Send</button> */}
                </form>
                <DialogActions>
                  <Button onClick={this.handleClose} color="primary">
                    Cancel
                            </Button>
                  <Button onClick={() => this.handleClick()} color="primary">
                    Submit
                            </Button>
                </DialogActions>
              </Dialog>
              {/* ends add new music */}
            </div>
            {/* add table */}
            <Paper>
              <Table className="adminTable">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Instrument</TableCell>
                    <TableCell align="center">Difficulty</TableCell>
                    <TableCell align="center">URL</TableCell>
                    <TableCell align="center">Edit</TableCell>
                    <TableCell align="center">Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.props.reduxStore.sheetMusicReducer.map((row) => {
                    return (
                      <TableRow key={row.id}>
                        <TableCell align="left">{row.name}</TableCell>
                        <TableCell align="left">{row.instrument}</TableCell>
                        <TableCell align="left">{row.difficulty} </TableCell>
                        <TableCell align="center">{row.url} </TableCell>
                        <TableCell align="left"><Button onClick={() => this.editSheetMusic(row)}>Edit</Button></TableCell>
                        <TableCell align="left"><Button onClick={() => this.deleteSheetMusic(row)}>Delete</Button></TableCell>
                      </TableRow>
                    )
                  }
                  )}
                </TableBody>
              </Table>
            </Paper>
          </center>
        </div>
    )
  }
}

export default connect(mapStateToProps)(AdminMusic);
