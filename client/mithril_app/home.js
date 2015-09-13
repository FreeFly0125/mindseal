var Home = {};

Home.view = function(){
  //creates a button for every deck
  var mArray = [];
  for (var deck in App.Decks()){
    mArray.push(
      m("a", {href:('#/deckDash/' + deck)}, 
        m("input[type='button']",{value:deck})
      ),
      m("br"),
      m("br")
    )
  }

  return m("div.container center-block",[
    m('br'),
    m("a[href='#/newDeck']", //m routing to a new deck view
        m("input[type='button']",{value:"New Button"}) //need to call a function at all?
      ), //m creating a button before rendering deck links
    m('br'),
    m("p", "Some basic user stats would look great here. Especially any kind of visualization."),
    m("p", "Select a deck:"),
    m("", mArray), 
  ]);
}

Home.controller = function(){

}

