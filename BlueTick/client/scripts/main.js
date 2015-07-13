// counter starts at 0
Session.setDefault('counter', 0);

Template.home.helpers({
  counter: function () {
    return Session.get('counter');
  }
});

Template.home.events({
  'click button': function () {
    // increment the counter when button is clicked
    Session.set('counter', Session.get('counter') + 1);
  }
});

Router.route('/', function () {
  this.render('home');
});
