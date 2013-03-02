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
    // console.dir(App.Card.find(1));
    return App.Board.find();
  }
});

App.BoardsController = Ember.ArrayController.extend({sortProperties:['id']});

App.CreateCardView = Ember.TextField.extend({
  insertNewline: function(){
    var value = this.get('value');
    var title = 'something';
    if ( value ){
      card = App.Card.createRecord({board_id:'/api/v1/board/1/',title: 'soldier', content: value});
      card.store.commit();
      this.set('value', '');
    }
  }
});

App.Adapter = DS.DjangoTastypieAdapter.extend();

App.Store = DS.Store.extend({
  revision: 11,
  adapter: 'App.Adapter'
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

App.initialize();
