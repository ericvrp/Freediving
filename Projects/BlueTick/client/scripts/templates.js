//
// helpers
//
Template.home.helpers({
   languages: function() {
     return Languages.find({}, {sort: {name: 1}});
   },

   audioformats: function() {
     return AudioFormats.find({}, {sort: {name: 1}});
   },
});


//
// Global template helpers
//
Template.registerHelper('language', function() {
  return Session.get('language');
});

Template.registerHelper('audioformat', function() {
  return Session.get('audioformat');
});


//
// events
//
Template.home.events({
    'click #startCountdown': function () {
      if (!countdownClock.running) {
        countdownClock.start();
      }
    },

    'click #stopCountdown': function () {
      if (countdownClock.running) {
        countdownClock.stop();
      }
    },

    'click #resetCountdown': function () {
      countdownClock.setTime(120);
    },

    'click #testAudio': function () {
      PlaySample('120');
    },

    'change #language': function (e, c) {
      Session.set('language', e.currentTarget.value);
    },

    'change #audioformat': function (e, c) {
      Session.set('audioformat', e.currentTarget.value);
    },
});
