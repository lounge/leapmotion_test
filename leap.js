
(function run() {

  function update(hands) {
    hands.forEach(function(hand, index) {
      var normalizedPoint = iBox.normalizePoint(hand.palmPosition, true);
      // console.log('loop');
    });
  }



  var controller = Leap.loop({enableGestures: true}, function(frame){
    iBox = frame.interactionBox;
    update(frame.hands);
  });

  controller.on("gesture", function(gesture){
    // console.log('gesture detected');
    // if (gesture.state.stop) {
      switch (gesture.type){
        case "circle":
            execute(gesture);
            break;
        // case "keyTap":
        //     console.log("Key Tap Gesture "  + gesture.state);
        //     break;
        // case "screenTap":
        //     console.log("Screen Tap Gesture "  + gesture.state);
        //     break;
        case "swipe":
            // console.log("Swipe Gesture "  + gesture.state);
            calculateSwipe(gesture);
            break;
      }
    // }


  });

  function calculateSwipe(gesture) {
    if (gesture.state !== 'stop')
      return

      //Classify swipe as either horizontal or vertical
      var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);

      //Classify as right-left or up-down
      if(isHorizontal) {
          if(gesture.direction[0] > 0){
              swipeDirection = "right";
              prevPage();
          } else {
              swipeDirection = "left";
              nextPage();
          }
      } else { //vertical
          if(gesture.direction[1] > 0){
              swipeDirection = "up";
          } else {
              swipeDirection = "down";
          }
      }
      console.log(swipeDirection);
  }

  function nextPage() {
    var pages = document.getElementsByClassName('page');
    var currentPage = document.getElementsByClassName('active')[0];

    var next;
    for(var i = 0; i < pages.length; i++) {
       if(pages[i] == currentPage) {
        if ((i + 1) === pages.length) {
          next = pages[0];
        } else {
          next = pages[i + 1];
        }
      }
    }

    currentPage.className = "page";
    next.className = "page active";

  }

  function prevPage() {
    var pages = document.getElementsByClassName('page');
    var currentPage = document.getElementsByClassName('active')[0];

    var previous;
    for(var i = 0; i < pages.length; i++) {
       if(pages[i] == currentPage) {
        if (i === 0) {
          previous = pages[pages.length - 1];
        } else {
          previous = pages[i - 1];
        }
      }
    }

    currentPage.className = "page";
    previous.className = "page active";
  }

  function execute(gesture) {
    if (gesture.state !== 'stop')
      return

    var currentPage = document.getElementsByClassName('active')[0];
    currentPage.className += " selected";
  }

}());
