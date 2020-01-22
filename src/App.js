import React, { Component } from 'react';
import firebase from 'firebase';
import config from './config';
class App extends Component {
  constructor(props) {
    super(props);
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    this.state = {};
    firebase
      .database()
      .ref()
      .once('value')
      .then(value => {
        const items = value.toJSON();
        for (let key in items) {
          this.state[key] = items[key];
        }
        this.forceUpdate();
      });
  }

  changeOrgItemValue = (org, index, title, newVal) => {
    this.state[org][index][title] = newVal;
    this.forceUpdate();
  };

  render() {
    return this.state != null ? (
      <div>
        {Object.keys(this.state).map(org => (
          <div>
            <h1>{org}</h1>
            {Object.keys(this.state[org]).map(index =>
              !isNaN(index) ? (
                <div>
                  <h2>{this.state[org][index]['Title']}</h2>
                  <div>
                    {Object.keys(this.state[org][index]).map(field => (
                      <div>
                        <b>{field}: </b>
                        <input
                          value={this.state[org][index][field]}
                          onChange={evt =>
                            this.changeOrgItemValue(
                              org,
                              index,
                              field,
                              evt.target.value
                            )
                          }
                        />
                        <input
                          type="submit"
                          onClick={() => {
                            this.updateFirebase(
                              this.firebasePath(org, index),
                              this.state[org][index]
                            );
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h2>{index}</h2>
                  <input value={this.state[org][index]} />
                </div>
              )
            )}
          </div>
        ))}
      </div>
    ) : (
      <div />
    );
  }

  firebasePath = (org, index) => {
    return '/' + org + '/' + index;
  };

  updateFirebase = (path, content) => {
    console.log(path);
    console.log(content);
    firebase
      .database()
      .ref(path)
      .set(content, function(error) {
        if (error) {
          // The write failed...
          console.error('ERROR. Database write failed: ' + error);
        } else {
          // Data saved successfully!
          console.log('Database successfully updated!');
        }
      });
  };
}

export default App;
