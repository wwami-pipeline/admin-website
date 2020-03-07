import firebase from 'firebase';

export default class FirebaseHelpers {
  static firebasePath = (location, org, index) => {
    if (index !== undefined) {
      return '/' + location + '/' + org + '/' + index;
    }
    if (org !== undefined) {
      return '/' + location + '/' + org;
    }
    return '/' + location;
  };

  static updateFirebase = (path, content) => {
    console.log(path);
    console.log(content);
    firebase
      .database()
      .ref(path)
      .set(content, function(error) {
        if (error) {
          // The write failed...
          console.error('ERROR. Database write failed: ' + error);
        }
      });
  };

  static getOrderNumber = x => {
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
}
