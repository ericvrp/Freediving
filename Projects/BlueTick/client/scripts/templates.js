Template.home.helpers({
  counter: function () {
    return Session.get('counter');
  }
});

Template.home.events({
  'click button': function () {
    // increment the counter when button is clicked
    Session.set('counter', Session.get('counter') + 1);

    /*var sound =*/
    new Howl({src: ['audio/en/top.ogg'], autoplay: true});
    //console.log(sound);
  }
});

//Global template helpers
Template.registerHelper('randColor', function() {
  choices = ['#bada55','#B43831', '#783BA3', '#00AB1B', '#143275', '#FFA700'];
  return Random.choice(choices);
});
