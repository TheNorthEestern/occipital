var App = Ember.Application.create();
var attr = DS.attr;

Ember.Handlebars.registerBoundHelper('pluralize', function(number, singular, plural){
  return (number === 1) ? singular : plural;
});

Moveable = Ember.Namespace.create();

Moveable.cancel = function(event){
  event.preventDefault();
  return false;
}

Moveable.Draggable = Ember.Mixin.create({
  attributeBindings : 'draggable',
  draggable: 'true',
  dragStart: function(event){
    console.log('Dragging has commenced');
  }
});

Moveable.Droppable = Ember.Mixin.create({
  dragEnter: Moveable.cancel,
  dragOver: Moveable.cancel,
  drop: function(event){
    event.preventDefault();
    return false;
  }
});

App.loginController = Ember.Object.create({
  login: function(username, password){
    
  }
});

App.LoginFormView = Ember.View.extend({
  tagName: 'form',
  username: null,
  password: null,
  submit: function(event){
    event.preventDefault();
    var username = this.get('');
    var password = this.get('password');
  },

});

App.CardView = Ember.View.extend(Moveable.Draggable);

App.CardDropArea = Ember.View.extend(Moveable.Droppable);

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
App.CardsController = Ember.ArrayController.extend({sortProperties:['id']});

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
  plural : 'cards',
  singular : 'card',
  save: function(){
    var title = this.get('newCardTitle');
    var content = this.get('newCardContent');
    if ( title && content ) {
      card = this.get('model').get('cards');
      card.createRecord({title:title,content:content});
      card.store.commit();
    }
  },
  submit:function(){
    this.set('newCardTitle', '');
  }
});

App.CardEntryItemController = Ember.ObjectController.extend({
  delete: function(){
    currentCard = this.get('model');
    currentCard.deleteRecord();
    currentCard.store.commit();
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
