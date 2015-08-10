var React = require( 'react' );

var OctoPrint = require('../OctoPrint')

var octo = new OctoPrint({server: '10.5.5.115', port: 5000})
octo.onError = function(msg) {
    console.error(msg)
}
octo.ping()


var OctoPrintInterface = React.createClass( {
    displayName: 'Main',

    componentDidMount: function() {
        var _this = this;

        if (false) {
            setInterval(function() {
                octo.getPrinter(function(printer) {
                    var temps = {
                        hotend: {
                            actual: printer.temps.tool0.actual
                        },
                        bed: {
                            actual: printer.temps.bed.actual
                        }
                    }

                    _this.setState({temps: temps})
                })
            }, 1000)
        }
    },

    getInitialState: function() {
        return {
            temps: {
                hotend: {actual: 0},
                bed: {actual: 0}
            }
        }
    },

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
            case 'z-home':
                octo.homeAxes('z', function() {})
                break;
            case 'z-up':
                octo.movePrinter(function() {}, 0, 0, -10);
                break;
            case 'z-down':
                octo.movePrinter(function() {}, 0, 0, 10);
                break;
        }
        octo.getPrinter(function(printer) {
            console.log(printer)
        })
    },

    render: function() {
        var buttonStyle = { marginLeft: '40px' }

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2">

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

                    <div className="col-md-1">

                        <button className="btn btn-default" onClick={this.handleClick.bind(this, 'z-up')}>
                            <span className="glyphicon glyphicon-arrow-up"></span>
                        </button>
                        <br/>

                        <button className="btn btn-default" onClick={this.handleClick.bind(this, 'z-home')}>
                            <span className="glyphicon glyphicon-home"></span>
                        </button>
                        <br/>

                        <button className="btn btn-default" onClick={this.handleClick.bind(this, 'z-down')}>
                            <span className="glyphicon glyphicon-arrow-down"></span>
                        </button>
                        <br/>

                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12 col-md-12">
                        Hotend Tempature {this.state.temps.hotend.actual}
                        <br/>
                        Bed Tempature {this.state.temps.bed.actual}
                    </div>
                </div>

            </div>
        );
    }
} );

module.exports = OctoPrintInterface;
