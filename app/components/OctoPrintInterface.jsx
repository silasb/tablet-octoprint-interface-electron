var React = require( 'react' );

var OctoPrint = require('../OctoPrint')
var octo = new OctoPrint({server: '10.5.5.115', port: 5000})

var OctoPrintInterface = React.createClass( {
    displayName: 'Main',

    handleClick: function(dir) {
        switch(dir) {
            case 'up':
                octo.movePrinter(function() {}, 0, -10);
                break;
            case 'down':
                octo.movePrinter(function() {}, 0, 10);
                break;
            case 'right':
                octo.movePrinter(function() {}, 10);
                break;
            case 'left':
                octo.movePrinter(function() {}, -10);
                break;
            case 'home':
                octo.homeAxes(['x', 'y'],  function() {});
                break;
        }
        octo.getTool(function(printer) {
            console.log(printer)
        })
    },

    render: function() {
        var buttonStyle = { marginLeft: '40px' }

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12 col-md-12">

                        <button className="btn btn-default" style={buttonStyle} onClick={this.handleClick.bind(this, 'up')}>
                            <span className="glyphicon glyphicon-arrow-up"></span>
                        </button>
                        <br/>

                        <button className="btn btn-default" onClick={this.handleClick.bind(this, 'left')}>
                            <span className="glyphicon glyphicon-arrow-left"></span>
                        </button>

                        <button className="btn btn-default" onClick={this.handleClick.bind(this, 'home')}>
                            <span className="glyphicon glyphicon-home"></span>
                        </button>

                        <button className="btn btn-default" onClick={this.handleClick.bind(this, 'right')}>
                            <span className="glyphicon glyphicon-arrow-right"></span>
                        </button>
                        <br/>

                        <button className="btn btn-default" style={buttonStyle} onClick={this.handleClick.bind(this, 'down')}>
                            <span className="glyphicon glyphicon-arrow-down"></span>
                        </button>

                    </div>
                </div>
            </div>
        );
    }
} );

module.exports = OctoPrintInterface;
