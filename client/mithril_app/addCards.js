var addCards = {};

addCards.makeCard = function(frontAndBack){
  var newCard = {}

  newCard.front = frontAndBack[0]
  //...

  Card.vm(newCard)
}

addCards.view = function(){
  return m(".container", [
      m(".starter-template", [
        m("h1", "CODENAME: IGGY"),
        m("p.lead", ["Let's make some cards.",
          m("br")," So you can remember stuff."]),
        m("input[type='text'][class='newFront']"),
        m("br"),
        m("input[type='text'][class='newBack']"),
        m("br"),
        m("input[type='button'][value='make a card!']",
          {onclick:m.withAttr(/*input stuff goes here*/,addCards.makeCard)}
          )
      ])
    ])
}

addCards.controller = function(){
  var ctrl = this;

  // ctrl.contacts = m.prop( [new Contacts.model()] );

  ctrl.update = function(index) {
    var toUpdate = ctrl.contacts()[index];
    m.request({
      method: 'POST',
      url: '/decks/' + options.deck,
      data: toUpdate
    })
    .then(function(updatedCard) {
      ctrl.cards()[index] = updatedCard;
    })
  }

}
