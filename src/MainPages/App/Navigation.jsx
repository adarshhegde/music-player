import React, { Component } from 'react';

class Navigation extends Component {
    state = {}
    render() {
        return (
            <div id="navigation">
                {Object.keys(this.props.Menu.menus).map((menu, idx) => {
                    let classes = ["navigation-item", (this.props.activeMenu === menu) ? "active" : ""];
                    return (
                        <span
                            onClick={() => this.props.setMenu(menu)}
                            className={classes.join(" ")}
                            key={idx}>
                            {this.props.Menu.menus[menu].label}
                        </span>
                    )
                })}
            </div>);
    }
}

export default Navigation;