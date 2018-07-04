import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import ding from './ding.wav';
import './App.css';

const mainTimerLength = 10;
const breakTimerLength = 5;

const defaultState = {
  timerId: -1,
  timeLeft: mainTimerLength,
  timerActive: false,
  currentTimerIsWorkTimer: true
};

class App extends Component {
  state = defaultState;

  startOnClick = () => {
    if (!this.state.timerActive) {
      this.runTimer();
    } else {
      this.pauseTimer();
    }
  };

  resetOnClick = () => {
    if (this.state.timerId !== -1) {
      clearInterval(this.state.timerId);
    }
    this.setState(defaultState);
  };

  runTimer = () => {
    const lastTime = new Date();
    const startTime =
      this.state.timeLeft > 0 ?
        this.state.timeLeft :
        this.state.currentTimerIsWorkTimer ?
          mainTimerLength :
          breakTimerLength;
    this.setState(() => {
      return {
        timeLeft: startTime
      };
    });
    const intervalId = setInterval(
      () => {
        let timeSinceTimerCreated = Math.floor((Date.now() - lastTime.getTime()) / 1000);
        let timeLeft = startTime - timeSinceTimerCreated;
        this.setState(() => {
          return { timeLeft: timeLeft };
        }, () => {
          if (timeLeft === 0) {
            clearInterval(intervalId);
            this.makeNoise();
            this.setState((prevState) => {
              return {
                currentTimerIsWorkTimer: !prevState.currentTimerIsWorkTimer
              }
            }, () => {
              this.runTimer();
            });
          }
        });
      },
      500);
    this.setState({ timerId: intervalId, timerActive: true });
  };

  pauseTimer = () => {
    clearInterval(this.state.timerId);
    this.setState({ timerActive: false });
  };

  renderButton = () => {
    return (
      <Button variant="contained" color="primary" onClick={this.startOnClick}>
        {this.state.timerId === -1 ? 'Start' : this.state.timerActive ? 'Pause' : 'Resume'}
      </Button>
    );
  };

  renderResetButton = () => {
    return (
      <Button variant="contained" color="primary" onClick={this.resetOnClick}>
        Reset
      </Button>
    );
  };

  makeNoise = () => {
    this.refs.Player.play();
  };

  renderTime = (seconds) => {
    seconds = Number(seconds);

    return (new Date(seconds * 1000)).toUTCString().match(/\d\d:(\d\d:\d\d)/)[1];
  };

  renderMessage = () => {
    if (this.state.currentTimerIsWorkTimer) {
      if (this.state.timerActive) {
        return (
          <p>Get to work!</p>
        );
      } else {
        return (
          <p>20 Minutes of work followed by 20 seconds of looking at something 20 feet away. Click Start.</p>
        )
      }
    } else {
      return (
        <p>Take a break. Look at something 20 feet away.</p>
      );
    }
  };

  renderWorkSection = () => {
    if (this.state.currentTimerIsWorkTimer) {
      return (
        <div>
          {this.renderMessage()}
          <p>
            {this.renderTime(this.state.timeLeft)}
          </p>
          <p className="App-intro">
            {this.renderButton()}
            {this.renderResetButton()}
          </p>
        </div>
      );
    }

    return null;
  };

  renderBreakSection = () => {
    if (!this.state.currentTimerIsWorkTimer) {
      return (
        <div>
          {this.renderMessage()}
          <p>
            {this.renderTime(this.state.timeLeft)}
          </p>
          <p className="App-intro">
            {this.renderButton()}
            {this.renderResetButton()}
          </p>
        </div>
      );
    }

    return null;
  };

  render() {
    return (
      <div className="App">
        <p>
          <audio ref='Player'>
            <source src={ding} type='audio/wav' />
          </audio>
        </p>
        {this.renderWorkSection()}
        {this.renderBreakSection()}
      </div>
    );
  }
}

export default App;
