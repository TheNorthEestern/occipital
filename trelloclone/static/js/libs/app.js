var App = Ember.Application.create({
  customEvents:{
    // Necessary because of jQueryUI's 'drop' conflicts with
    // Ember's built-in support for Native 'drop' (http://bit.ly/1048i82)
    'drop':'customDrop'
  }
});

var attr = DS.attr;
Ember.Handlebars.registerBoundHelper('pluralize', function(number, singular, plural){
  return (number === 1) ? singular : plural;
});

// You can learn more about using jQuery UI with
// Ember in this blog post by Luke Melia: http://bit.ly/GSufjG 
Moveable = Ember.Namespace.create();

Moveable.Widget = Ember.Mixin.create({
  didInsertElement: function(){
    if(this.get('ui')) { return; }

    var options = this._gatherOptions();
    this._gatherEvents(options);

    var uiType = this.get('uiType');
    var element = this.get('element');
    var that = this;

    var ui = this.$()[uiType](options, element);

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
  uiEvents: ['drop','over']
})

Moveable.Draggable = Ember.View.extend(Moveable.Widget, {
  uiType: 'draggable',
  uiOptions: ['appendTo', 'helper','stack', 'delay', 'revert', 'revertDuration', 'cancel'],
  uiEvents: ['start']
})

App.Draggable = Moveable.Draggable.extend({
  appendTo: 'body',
  helper: 'original',
  stack: '.card',
  delay: 75,
  revert: true,
  revertDuration: 250,
  cancel : '.card .option-square',
  start:function(event, ui){
    console.log('You\'re now dragging ' + this.get('controller').get('model'));
  }
});

App.Droppable = Moveable.Droppable.extend({
  activeClass: 'ui-state-default',
  hoverClass: 'ui-state-hover',
  accept: ':not(.ui-sortable-helper)',
  drop: function(event, ui) {
    // Is this even kosher? Who knows? If you do, give me a holler...
    var controller = this.get('controller');
    var currentBoard = this.get('controller').get('model');
    var currentCard = this.get('content.cards');

    console.dir(ui.draggable);
    console.log(currentBoard.name);
    // {hack}
    var viewId = ui.draggable.attr('id');
    card = Ember.View.views[viewId].get('controller.content');
    // {end-hack}

    controller.addSiblingCard(card);
    card.set('board_id', currentBoard.id);
    card.store.commit();
  },
  over:function(event, ui){
    $(ui.draggable).toggleClass('drop-ready');
    // console.log($(ui.draggable)[0].style.animationName);
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

App.BoardsController = Ember.ArrayController.extend({
  sortProperties:['id'], 
  sortAscending:false, 
  showNewCardForm: true,
  activeForm : 0
});

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

App.CreateCardView = Ember.View.extend({
  tagName : 'form'
});

App.BoardEntryItemController = Ember.ObjectController.extend({
  plural : 'cards',
  singular : 'card',
  // needs: ['boardsController'],
  save: function(){
    var title = this.get('newCardTitle');
    var content = this.get('newCardContent');
    if ( title ) {
      if (!content)
        content = "";
      card = this.get('model').get('cards');
      card.createRecord({title:title,content:content});
      card.store.commit();
    }
    this.set('newCardTitle', '');
    this.set('newCardContent', '');
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

App.Board = DS.Model.extend({
  owner: attr('string'),
  cards: DS.hasMany('App.Card'),
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
  revision: 12,
  adapter: 'App.Adapter'
});
