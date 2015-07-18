Meteor.startup(function () {
  // code to run on server at startup

  // console.log("count=" + Languages.find().count());
  if (Languages.find().count() == 0) {
    Languages.insert({name: "English", abbr: "en"});
    Languages.insert({name: "Swedish", abbr: "sv"});
  }

  // console.log("count=" + AudioFormats.find().count());
  if (AudioFormats.find().count() == 0) {
    AudioFormats.insert({name: "MP3", abbr: "mp3"});
    AudioFormats.insert({name: "Ogg Vorbis", abbr: "ogg"});
  }

  Meteor.publish("languages", function () {
    return Languages.find();
  });

  Meteor.publish("audioformats", function () {
    return AudioFormats.find();
  });

});
