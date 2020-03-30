import React, { Component } from 'react';

var keys = {37: 1, 38: 1, 39: 1, 40: 1};


function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;  
  }
  
  function preventDefaultForScrollKeys(e) {
      if (keys[e.keyCode]) {
          preventDefault(e);
          return false;
      }
  }
  
  function disableScroll(ref) {
    let main = ref.current;

    if (main.addEventListener) // older FF
        main.addEventListener('DOMMouseScroll', preventDefault, false);
    main.addEventListener('wheel', preventDefault, {passive: false}); // Disable scrolling in Chrome
    main.onwheel = preventDefault; // modern standard
    main.onmousewheel = main.onmousewheel = preventDefault; // older browsers, IE
    main.ontouchmove  = preventDefault; // mobile
    main.onkeydown  = preventDefaultForScrollKeys;
  }
  
  function enableScroll(ref) {
    let main = ref.current;

      if (main.removeEventListener)
          main.removeEventListener('DOMMouseScroll', preventDefault, false);
      main.removeEventListener('wheel', preventDefault, {passive: false}); // Enable scrolling in Chrome
      main.onmousewheel = main.onmousewheel = null; 
      main.onwheel = null; 
      main.ontouchmove = null;  
      main.onkeydown = null;  
  }

class MainBody extends Component {
    state = { canScroll:true }

    setScroll = i => {
        i && enableScroll(this.ref);
        !i && disableScroll(this.ref);
    }

    ref = React.createRef()

    render() {
    
        return (<div id="main-body" ref={this.ref} className={ this.state.canScroll ? "scrollable" : "scrollable" }>
            {Object.keys(this.props.Menu.menus).map((menu, idx) => {
                let classes = ["navigation-page", (this.props.activeMenu === menu) ? "open" : "", this.props.Menu.menus[menu].canscroll ? "canscroll" : ""];
                return (
                    <div className={classes.join(" ")} key={idx}>
                        {
                        
                        React.cloneElement(
                            this.props.Menu.menus[menu].component, 
                            { setScroll: this.setScroll }
                        )
                        }
                    </div>
                )
            })}
        </div>);
    }
}

export default MainBody;