import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import LinearProgress from '@material-ui/core/LinearProgress';
import moment from 'moment'
import { Bar } from 'react-chartjs-2'
import { Input } from 'semantic-ui-react'
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Spinner from 'react-bootstrap/Spinner'
class App extends React.Component {

  state = {
    weather: [],
    loading: false,
    text: '',
  }

  getWeather = async (e) => {
    // this line prevents the page from reloading (which is the default for <form> elements)
    e.preventDefault()
    // set "loading" to true in the state so we can show a spinner
    this.setState({ loading: true, weather: [] })
    // here is our giphy api key
    var key = 'c0ce51e4fea78661e9e478214f0336d3'
    // this line make a URL string, I got this from their documentation
    var url = `https://api.openweathermap.org/data/2.5/forecast?q=${this.state.text}&units=imperial&APPID=${key}`
    // "fetch" calls the giphy API!
    var r = await fetch(url)
    // this lines extracts JSON (javascript object notation)
    var json = await r.json()

    if (r.status === 200) {
      // set the weather in state, and loading to false, and the text to blank again
      this.setState({
        weather: json.list,
        loading: false,
        text: '',
        error: null
      })
    } else {
      this.setState({
        error: json.message,
        loading: false
      })
    }
  }
  render() {
    // extract the pieces of state so we can use them easily in our HTML code
    var { weather, loading, text, error } = this.state
    var data

    if(weather){
      data = {
        labels: weather.map(w=> moment(w.dt*1000).format('ll hh:mm a')),
        datasets: [{
          label:'Temperature',
          borderWidth: 1,
          data: weather.map(w=> w.main.temp),
          backgroundColor: 'rgba(132,99,255,0.2)',
          borderColor: 'rgba(132,99,255,1)',
          hoverBackgroundColor: 'rgba(132,99,255,0.4)',
          hoverBorderColor: 'rgba(132,99,255,1)',
        }]
      }
    }
    return (
      <div className="App">
        <form className="App-header" onSubmit={this.getWeather}>
          <TextField value={text}
            autoFocus
            label="Search for Weather"
            id="mui-theme-provider-standard-input"
            onChange={e => this.setState({ text: e.target.value })}
            style={{ width: '100%', marginLeft: 8 }}
          />
          <Button 
            color="primary"
            disabled={loading || !text}
            type="submit"
            style={{ width: 100, margin: '0 10px', height: 60 }}>
            <SearchIcon style={{ marginRight: 8 }} />
          </Button>
          
        </form>
        {loading && <CircularProgress />}
        <main>
          {data && <Bar
            data={data}
            width={800}
            height={400}
          />}
          {error && <div style={{ color: 'rgb(150,80,50)' }}>{error}</div>}
        </main>
      </div>
    );
  }
}

export default App;
