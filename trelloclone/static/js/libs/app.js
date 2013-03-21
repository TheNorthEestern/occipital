var App = Ember.Application.create();
var attr = DS.attr;

Ember.Handlebars.registerBoundHelper('pluralize', function(number, singular, plural){
  return (number === 1) ? singular : plural;
});

Moveable = Ember.Namespace.create();

Moveable.Widget = Ember.Mixin.create({
  didInsertElement: function(){
    if(this.get('ui')) { return; }

    var options = this._gatherOptions();
    // this._gatherEvents(options);

    var uiType = this.get('uiType');
    var uiOptions = this._gatherOptions();
    var element = this.get('element');
    var that = this;

    var ui = this.$()[uiType]({
      drop: function(event, ui){
       that.cardWasDropped(event, ui);
      }
    }, uiOptions);

    this.set('ui', ui);
  },
  willDestroyElement: function(){
    var ui = this.get('ui');
      if (ui){
        var observers = this._observers;
        for(var prop in observers){
          if(observers.hasOwnProperty(prop)) {
            this.removeObserver(prop, observers[prop]);
          }
        }
        // ui._destroy();
      }
  },
  _gatherOptions: function(){
    var uiOptions = this.get('uiOptions'),
    options = {};

    uiOptions.forEach(function(key){
      options[key] = this.get(key);

      var observer = function(){
        var value = this.get(key);
        this.get('ui')._setOption(key, value);
      };

      this.addObserver(key, observer);

      this._observers = this._observers || {};
      this._observers[key] = observer;
    }, this);
      return options;
  },
  _gatherEvents: function(options){
    var uiEvents = this.get('uiEvents') || [],
                self = this;

    uiEvents.forEach(function(event){
      var callback = self[event];
      if(callback){
        options[event] = function(event, ui){
          callback.call(self, event, ui);
        };
      }
    });
  }
});

Moveable.Droppable = Ember.View.extend(Moveable.Widget, {
  uiType: 'droppable',
  uiOptions: ['activeClass', 'hoverClass', 'accept'],
  uiEvents: ['drop']
})

Moveable.Draggable = Ember.View.extend(Moveable.Widget, {
  uiType: 'draggable',
  uiOptions: ['appendTo', 'helper','stack', 'delay', 'containment'],
  uiEvents: []
})

App.Draggable = Moveable.Draggable.extend({
  appendTo: 'body',
  helper: 'original',
  stack: '.card',
  delay: 75,
  cancel : '.option-square'
})

App.Droppable = Moveable.Droppable.extend({
  activeClass: 'ui-state-default',
  hoverClass: 'ui-state-hover',
  accept: ':not(.ui-sortable-helper)',
  cardWasDropped: function(event, ui) {
    var controller = this.get('controller')

    // hack
    var viewId = ui.draggable.attr('id');
    card = Ember.View.views[viewId].get('controller.content');
    // hack

    controller.addSiblingCard(card);
    // card.createRecord({title:title,content:content});
    // card.store.commit();
    // console.log('Dropped!');
    // console.dir('this');
  }
})

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
  },
  addSiblingCard: function(card){
    var cards = this.get('content.cards');
    Ember.Logger.info(card.toString(), ' added to ' , cards.toString())
    cards.addObject(card)
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
