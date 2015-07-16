Session.setDefault('language', 'en');
Session.setDefault('audioformat', 'mp3');

PlaySample = function (sampleName) {
  var filename = 'audio/' + Session.get('language') + '/' + sampleName + '.' + Session.get('audioformat');
  if (Meteor.isCordova){
    filename = Meteor.absoluteUrl(filename);
  }
  console.log(filename);
  new Audio(filename).play();
}
