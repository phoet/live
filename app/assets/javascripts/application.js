// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require moment
//= require handlebars
//= require ember
//= require ember-data
//= require_self
//= require_tree ./templates
//= require twitter/bootstrap

// start ember

App = Ember.Application.create({
  ready: function() {
    setInterval(function() {
      App.set('currentTime', new Date(2013, 8, 19, 13, 30));
    }, 1000);
  }
});

App.Session = DS.Model.extend({
  time: DS.attr('date'),
  speaker: DS.attr('string'),
  info: DS.attr('string')
});

App.Trip = DS.Model.extend({
  time: DS.attr('string'),
  train: DS.attr('string'),
  route: DS.attr('string'),
  platform: DS.attr('string')
});

App.IndexController = Ember.ObjectController.extend({
  needs: ['sessions', 'trips', 'directions', 'contacts']
});

App.TripsController = Ember.ArrayController.extend({});
App.DirectionsController = Ember.ObjectController.extend({});
App.ContactsController = Ember.ObjectController.extend({});

App.SessionsController = Ember.ArrayController.extend({
  nextUp: function() {
    return this.find(function(session) {
      return session.get('time') >= App.currentTime;
    });
  }.property('@each', 'currentTime'),

  current: function() {
    return this.filter(function(session) {
      return session.get('time') <= App.currentTime;
    }).get('lastObject');
  }.property('@each', 'currentTime'),

  currentTimeBinding: Ember.Binding.oneWay('App.currentTime')
});

App.Router.map(function() {
  this.resource('sessions', function() {
    this.resource('session', {
      path: ':session_id'
    });
  });
  this.resource('trips', function() {
    this.resource('trip', {
      path: ':trip_id'
    });
  });
  this.resource('directions');
});

App.ApplicationRoute = Ember.Route.extend({
  actions: {
    goToLink: function(item, anchor) {
      var $elem = $(anchor);
      var $scrollTo = $('body').scrollTop($elem.offset().top - 60);

      this.transitionTo(item.route).then($scrollTo);
    }
  }
});

App.IndexRoute = Ember.Route.extend({
  setupController: function(controller, model) {
    var store = this.get('store');
    this.controllerFor('sessions').set('model', store.find('session'));
    this.controllerFor('trips').set('model', store.find('trip'));
  }
});

App.SessionsRoute = Ember.Route.extend({
  model: function() {
    var store = this.get('store');
    return store.find('session');
  }
});

App.TripsRoute = Ember.Route.extend({
  model: function() {
    var store = this.get('store');
    return store.find('trip');
  }
});

App.DirectionsRoute = Ember.Route.extend({});
App.ContactsRoute = Ember.Route.extend({});

Ember.Handlebars.helper('dateTime', function(value, options) {
  return moment(value).format('MMM D HH:mm')
});

Ember.Handlebars.helper('time', function(value, options) {
  return moment(value).format('HH:mm')
});

// app specific

$(document).ready(function() {
  $('body').scrollspy({
    target: '#navigation'
  });
});