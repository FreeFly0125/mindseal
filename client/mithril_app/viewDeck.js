var viewDeck = {};

viewDeck.rate = function(button){
  var convert = {
    'Did not remember': .9,
    'Hard': 1.1,
    'Good': 1.4,
    'Too Easy': 1.8
  }

  viewDeck.currentCard().tVal *= convert[button];
  viewDeck.currentCard().timeLastSeen = moment() //it was just seen now.
  viewDeck.currentCard().toBeSeen = ( viewDeck.currentCard().timeLastSeen.clone().add(viewDeck.currentCard().tVal, 'milliseconds') )
  console.log("Hours to next viewing: " + moment.duration(viewDeck.currentCard().toBeSeen.diff(viewDeck.currentCard().timeLastSeen), 'milliseconds').asHours())
  viewDeck.nextCard()
}

viewDeck.view = function(){

  // document.getElementById("see-decks").addClass("active")
  //^potentially different way of handling highlighting parts of the nav bar?
  
  return m(".container",[
    m(".starter-template", [
      // m("h1", "Let's look at cards!!!"),
      // m("p.lead", ["wheeeeeee......!!!111!1!!!1337", m("br")," nullundefined."]),
      m('strong','cards remaining in deck:'),m('br'),
      m('strong','minutes studied today:'),m('br'),
      m('strong','cards studied today:'),m('br'),
      m('br'),
      m(".center-block", [
        m(".card.front.center-block", viewDeck.currentCard().front),
        m('br'),
        m(".card.back.center-block", viewDeck.currentCard().back),
        m('br'),
        m("input",{type:'button', onclick: m.withAttr("value", viewDeck.rate), value:'Did not remember'}),
        m("input",{type:'button', onclick: m.withAttr("value", viewDeck.rate), value:'Hard'}),
        m("input",{type:'button', onclick: m.withAttr("value", viewDeck.rate), value:'Good'}),
        m("input",{type:'button', onclick: m.withAttr("value", viewDeck.rate), value:'Too Easy'}),
      ])
    ])
  ])
}

viewDeck.nextCard = function () {
  if (viewDeck.currentDeck.cards.length > viewDeck.index +1) {
    viewDeck.index++;
    viewDeck.currentCard(viewDeck.currentDeck.cards[viewDeck.index]);
  }
}

viewDeck.controller = function(args){
  var ctrl = this;
  console.log(args.deck, args.name)
  viewDeck.currentDeck = args.deck
  viewDeck.index = 0
  viewDeck.currentCard = m.prop(viewDeck.currentDeck.cards[viewDeck.index])

  //should be called on every button press
  // ctrl.rate = function (flag) {
  //   var toRate /*= ctrl.contacts().splice(, 1);*/ //should be the card...
  //   m.request({
  //     method: 'POST',
  //     url: '/decks/' + options.deck,
  //     data: toRate
  //   });
  // //   var newModel = new Contacts.model()
  // //   ctrl.contacts().push(newModel)
  //   if (!ctrl.deck[cardIndex + 1].flag) //if the flag of the next card indicates it should be seen...
  //     ctrl.nextCard() //then run the next card function
  // }

}
