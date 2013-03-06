var App = Ember.Application.create();
var attr = DS.attr;

Handlebars.registerHelper('pluralize', function(number, singular, plural){
  return (number === 1) ? singular : plural;
});

App.Router.map(function(){
  this.resource('application');
  this.resource('boards', function(){
    this.resource('board', {path:':board_id'});
  });
});

App.IndexRoute = Ember.Route.extend({
  redirect:function(){
    this.transitionTo('boards');
  }
});

App.BoardsRoute = Ember.Route.extend({
  model:function(params){
    return App.Board.find();
  }
});

App.BoardsController = Ember.ArrayController.extend({sortProperties:['id']});
App.BoardController = Ember.ObjectController.extend();
App.CardsController = Ember.ArrayController.extend({sortProperties:['id']});
App.CardController = Ember.ObjectController.extend()

App.CreateBoardView = Ember.TextField.extend({
  placeholder:'Enter the title of a new board here',
  insertNewline:function(){
    var value = this.get('value');
    board = App.Board.createRecord({title:value});
    board.store.commit();
    this.set('value', '');
  }
});

App.CreateCardController = Ember.ObjectController.extend({
});

App.BoardEntryItemController = Ember.ObjectController.extend({
  save: function(){
    debugger;
  }
});

App.Owner = DS.Model.extend({
  boards:DS.hasMany('App.Board'),
});

App.Board = DS.Model.extend({
  cards:DS.hasMany('App.Card'),
  title: attr('string'),
  resource_uri: attr('string')
});

App.Card = DS.Model.extend({
  board: DS.belongsTo('App.Board'),
  title: attr('string'),
  content: attr('string')
});

App.Adapter = DS.DjangoRESTAdapter.create({
  namespace:"api/v1"
});

App.Store = DS.Store.extend({
  revision: 11,
  adapter: 'App.Adapter'
});

App.initialize();
