import React, { Component } from 'react';
import firebase from 'firebase';
import config from './config';
import Logo from './images/uw_name_logo.jpg';
class App extends Component {
  constructor(props) {
    super(props);
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    this.state = {
      dialogOpen: false,
      isSignedIn: false,
      data: []
    };
    firebase
      .database()
      .ref()
      .once('value')
      .then(value => {
        const items = value.toJSON();
        for (let key in items) {
          this.state.data[key] = items[key];
        }
        this.forceUpdate();
      });
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

  signIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(res => {
        if (res.user.email !== 'slweb@uw.edu') {
          alert('Error: Unauthorized Email.');
        } else {
          this.setState({ isSignedIn: true });
        }
      })
      .catch(function(error) {
        console.log('ERROR: Sign in failed.' + error.code);
      });
  };

  addEvent = org => {
    const index = Object.keys(this.state.data[org]).length;
    this.state.data[org][index] = {
      Title: '',
      'Sign-up Link': '',
      'Project Description': '',
      'Types of Volunteers Needed': '',
      'Clinic Schedule': '',
      Location: '',
      'Parking and Directions': '',
      'Provider Information': '',
      'HS Grad Student Information': '',
      'Undergraduate Information': '',
      'Project Specific Training': '',
      'Tips and Reminders': '',
      'Contact Information and Cancellation Policy': '',
      'Services Provided': '',
      'Clinic Flow': '',
      'Website Link': ''
    };
    this.forceUpdate();
  };

  addItem = (org, index) => {
    const obj =
      index == null ? this.state.data[org] : this.state.data[org][index];

    const name = prompt('Enter Field Name: ');
    if (Object.keys(obj).includes(name)) {
      alert('Error: Event already has that field.');
    } else {
      obj[name] = '';
      this.forceUpdate();
    }
  };

  deleteItem = (org, index, field) => {
    if (field != null) {
      delete this.state.data[org][index][field];
    } else {
      // eslint-disable-next-line
      if (confirm('Are you sure you wish to delete this event?')) {
        delete this.state.data[org][index];
        for (
          let i = index + 1;
          i < Object.keys(this.state.data[org]).length;
          i++
        ) {
          this.state.data[org][index - 1] = this.state.data[org][index];
        }
        this.updateFirebase('/' + org, this.state.data[org]);
      }
    }

    this.forceUpdate();
  };

  changeItemValue = (org, title, newVal, index) => {
    if (index == null) {
      this.state.data[org][title] = newVal;
    } else {
      this.state.data[org][index][title] = newVal;
    }

    this.forceUpdate();
  };

  getOrderNumber = x => {
    if (x.toLowerCase().includes('title')) return 1;
    if (x.toLowerCase().includes('sign-up link')) return 2;
    if (x.toLowerCase().includes('project description')) return 3;
    if (x.toLowerCase().includes('types of volunteers needed')) return 3.5;
    if (x.toLowerCase().includes('clinic schedule')) return 4;
    if (x.toLowerCase().includes('location')) return 4.5;
    if (x.toLowerCase().includes('parking and directions')) return 5;
    if (x.toLowerCase().includes('provider information')) return 6;
    if (x.toLowerCase().includes('hs grad student information')) return 7;
    if (x.toLowerCase().includes('undergraduate information')) return 8;
    if (x.toLowerCase().includes('project specific training')) return 9;
    if (x.toLowerCase().includes('tips and reminders')) return 10;
    if (x.toLowerCase().includes('contact information and cancellation policy'))
      return 11;
    if (x.toLowerCase().includes('services provided')) return 11.5;
    if (x.toLowerCase().includes('clinic flow')) return 12;
    if (x.toLowerCase().includes('website link')) return 13;
    return 14;
  };

  render() {
    return this.state.isSignedIn ? (
      <div>
        <i>
          <b>Instructions:</b> To edit items, edit the text boxes and click
          save. To delete an item or event, click the "(X)" button to the left -
          if you are deleting a field, click save, and if you are deleting an
          event, confirm in the pop-up. To add a new event, click "add event"
          under the organization you wish to add it under - the button will be
          at the bottom, below all that organization's events.
        </i>

        {/* OVERVIEWS */}
        <h1>Overviews</h1>
        {Object.keys(this.state.data['Overviews']).map(org => (
          <div>
            <button
              onClick={() => {
                // Custom function for overview item deletion
                delete this.state.data['Overviews'][org];
                this.forceUpdate();
              }}
            >
              (X)
            </button>
            <b>{org}: </b>
            <textarea
              rows={1}
              style={{ minWidth: 500 }}
              value={this.state.data['Overviews'][org]}
              onChange={evt =>
                this.changeItemValue('Overviews', org, evt.target.value)
              }
            />
          </div>
        ))}
        <div>
          <button
            style={{ marginTop: 10 }}
            onClick={() =>
              this.updateFirebase('/Overviews', this.state.data['Overviews'])
            }
          >
            Save Overviews
          </button>
          <button onClick={() => this.addItem('Overviews')}>
            Add Overview
          </button>
        </div>

        {/* TOP-LEVEL ORGS */}
        {Object.keys(this.state.data)
          .filter(x => x !== 'Overviews')
          .map(org => (
            <div>
              <h1>{org}</h1>
              {/* ORG EVENTS */}
              {Object.keys(this.state.data[org]).map(index => (
                <div>
                  <h2>
                    <button onClick={() => this.deleteItem(org, index)}>
                      (X)
                    </button>
                    {this.state.data[org][index]['Title']}
                  </h2>
                  <div>
                    {/* INDIVIDUAL EVENT FIELDS */}
                    {Object.keys(this.state.data[org][index])
                      .sort((x, y) => {
                        return this.getOrderNumber(x) - this.getOrderNumber(y);
                      })
                      .map(field => (
                        <div>
                          <button
                            onClick={() => this.deleteItem(org, index, field)}
                          >
                            (X)
                          </button>
                          <b>{field}: </b>
                          <textarea
                            rows={1}
                            style={{ minWidth: 500 }}
                            value={this.state.data[org][index][field]}
                            onChange={evt =>
                              this.changeItemValue(
                                org,
                                field,
                                evt.target.value,
                                index
                              )
                            }
                          />
                        </div>
                      ))}
                    <button
                      style={{ marginTop: 10 }}
                      onClick={() => {
                        this.updateFirebase(
                          this.firebasePath(org, index),
                          this.state.data[org][index]
                        );
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        this.addItem(org, index);
                      }}
                    >
                      Add Field
                    </button>
                  </div>
                </div>
              ))}
              <button
                style={{ marginTop: 10 }}
                onClick={() => this.addEvent(org)}
              >
                Add Event
              </button>
            </div>
          ))}
      </div>
    ) : (
      <div>
        <div>
          <img src={Logo} alt="Logo" />
        </div>
        <button style={{ marginTop: 10 }} onClick={this.signIn}>
          Sign In
        </button>
        <div style={{ marginTop: 10 }}>
          <i>
            Enter slweb@uw.edu to login. All other users are unauthorized
            currently.
          </i>
        </div>
      </div>
    );
  }
}

export default App;
