var os = require('os');

// window.env contains data from config/env_XXX.json file.
var envName = window.env.name;

var React = require( 'react' );
var OctoPrintInterface = require( './components/OctoPrintInterface' );

window.React = React;
React.render( <OctoPrintInterface />, document.body );
