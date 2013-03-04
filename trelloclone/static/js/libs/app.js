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

App.CreateCardView = Ember.TextField.extend({
  insertNewline: function(){
    var value = this.get('value');
    var titleAndContent = value.split(':');
    var title = titleAndContent[0];
    var content = titleAndContent[1];
    console.dir(this.get('title'));
    if ( value ){
      card = App.Card.createRecord({title: title, content: content, board_id:'/api/v1/board/1'});
      card.store.commit();
      this.set('value', '');
    }
  }
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