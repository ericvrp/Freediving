Template.home.helpers({
  counter: function () {
    return Session.get('counter');
  }
});

Template.home.events({
  'click .incCounter': function () {
    // increment the counter when button is clicked
    Session.set('counter', Session.get('counter') + 1);
  },

  'click .resetCountdown': function () {
    countdownClock.setTime(120);
    new Howl({src: ['audio/en/120.ogg'], autoplay: true}); //Initial interval not called that's why it's manually done here??
  },
});

//Global template helpers
Template.registerHelper('randColor', function() {
  choices = ['#bada55','#B43831', '#783BA3', '#00AB1B', '#143275', '#FFA700'];
  return Random.choice(choices);
});
