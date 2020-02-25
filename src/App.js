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
        this.state.data = value.toJSON();
        this.forceUpdate();
      });
  }

  firebasePath = (location, org, index) => {
    if (index != undefined) {
      return '/' + location + '/' + org + '/' + index;
    }
    if (org != undefined) {
      return '/' + location + '/' + org;
    }
    return '/' + location;
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

  addEvent = (location, org) => {
    const keys = Object.keys(this.state.data[location][org]);
    const index = keys.length == 0 ? 0 : Number(keys[keys.length - 1]) + 1;
    this.state.data[location][org][index] = {
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

  addOrg = location => {
    const name = prompt('Organization name: ');
    this.state.data[location][name] = {};
    this.addEvent(location, name);
  };

  addLocation = () => {
    const name = prompt('Location name: ');
    this.state.data[name] = {};
    this.addOrg(name);
  };

  addItem = (location, index, org) => {
    const obj =
      org != null
        ? this.state.data[location][org][index]
        : index != null
        ? this.state.data[location][index]
        : this.state.data[location];

    const name = prompt('Enter Field Name: ');
    if (Object.keys(obj).includes(name)) {
      alert('Error: Event already has that field.');
    } else {
      obj[name] = '';
      this.forceUpdate();
    }
  };

  addOverview = org => {
    const name = prompt('Enter Org Name: ');
    this.state['Overviews'][name] = {
      description: '',
      video: ''
    };
  };

  deleteItem = (location, org, index, field) => {
    if (field != null) {
      delete this.state.data[location][org][index][field];
    } else {
      // eslint-disable-next-line
      if (confirm('Are you sure you wish to delete this event?')) {
        delete this.state.data[location][org][index];
        for (
          let i = index + 1;
          i < Object.keys(this.state.data[location][org]).length;
          i++
        ) {
          this.state.data[location][org][index - 1] = this.state.data[location][
            org
          ][index];
        }
        this.updateFirebase(
          '/' + location + '/' + org,
          this.state.data[location][org]
        );
      }
    }

    this.forceUpdate();
  };

  fixEventItemsOrdering = (location, org) => {
    const keys = Object.keys(this.state.data[location][org]);
    let temp = {};
    for (let i = 0; i < keys.length; i++) {
      temp[i] = this.state.data[location][org][keys[i]];
    }
    this.state.data[location][org] = temp;
    this.updateFirebase(
      this.firebasePath(location, org),
      this.state.data[location][org]
    );
  };

  changeItemValue = (location, title, newVal, org, index) => {
    if (org == null) {
      // Overview update
      this.state.data[location][title] = newVal;
    } else if (index == null) {
      this.state.data[location][org][title] = newVal;
    } else {
      this.state.data[location][org][index][title] = newVal;
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
            <h2>{org}</h2>
            {Object.keys(this.state.data['Overviews'][org]).map(field => (
              <div>
                <button
                  onClick={() => {
                    // Custom function for overview item deletion
                    delete this.state.data['Overviews'][org][field];
                    this.forceUpdate();
                  }}
                >
                  (X)
                </button>
                <b>{org}: </b>
                <textarea
                  rows={1}
                  style={{ minWidth: 500 }}
                  value={this.state.data['Overviews'][org][field]}
                  onChange={evt =>
                    this.changeItemValue('Overviews', field, evt.target.value)
                  }
                />
              </div>
            ))}
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
        {/* TOP-LEVEL LOCATIONS */}
        {Object.keys(this.state.data)
          .filter(x => x !== 'Overviews')
          .map(location => (
            <div>
              <h1>{location}</h1>
              {console.log(this.state.data)}
              {Object.keys(this.state.data[location]).map(org => (
                <div style={{ marginLeft: 10 }}>
                  <h2>{org}</h2>
                  {/* ORG EVENTS */}
                  {Object.keys(this.state.data[location][org]).map(index => (
                    <div style={{ marginLeft: 10 }}>
                      <h3>
                        <button
                          onClick={() => this.deleteItem(location, org, index)}
                        >
                          (X)
                        </button>
                        {this.state.data[location][org][index]['Title']}
                      </h3>
                      <div style={{ marginLeft: 10 }}>
                        {/* INDIVIDUAL EVENT FIELDS */}
                        {Object.keys(this.state.data[location][org][index])
                          .sort((x, y) => {
                            return (
                              this.getOrderNumber(x) - this.getOrderNumber(y)
                            );
                          })
                          .map(field => (
                            <div>
                              <button
                                onClick={() =>
                                  this.deleteItem(location, org, index, field)
                                }
                              >
                                (X)
                              </button>
                              <b>{field}: </b>
                              <textarea
                                rows={1}
                                style={{ minWidth: 500 }}
                                value={
                                  this.state.data[location][org][index][field]
                                }
                                onChange={evt =>
                                  this.changeItemValue(
                                    location,
                                    field,
                                    evt.target.value,
                                    org,
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
                              this.firebasePath(location, org, index),
                              this.state.data[location][org][index]
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
                          Add {this.state.data[location][org][index]['Title']}{' '}
                          Field
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    style={{ marginTop: 10 }}
                    onClick={() => this.fixEventItemsOrdering(location, org)}
                  >
                    Fix {org}
                  </button>
                  <button
                    style={{ marginTop: 10 }}
                    onClick={() => this.addEvent(location, org)}
                  >
                    Add {org} Event
                  </button>
                </div>
              ))}
              <button
                style={{ marginTop: 10 }}
                onClick={() => this.addOrg(location)}
              >
                Add {location} Organization
              </button>
            </div>
          ))}
        <button style={{ marginTop: 10 }} onClick={() => this.addLocation()}>
          Add Location
        </button>
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
