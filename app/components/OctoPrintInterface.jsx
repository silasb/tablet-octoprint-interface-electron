var React = require( 'react' );

var OctoPrint = require('../OctoPrint')
var PortSelection = require('./PortSelection')

var octo = new OctoPrint({server: '10.5.5.115', port: 5000})
octo.onError = function(msg) {
    console.error(msg)
    alert(msg)
}
/*octo.ping()*/

var enableGetPortsAndBaud = false;
var enableUpdateTempInterval = false;

var OctoPrintInterface = React.createClass( {
    displayName: 'Main',

    componentDidMount: function() {
        var _this = this;

        if (enableGetPortsAndBaud) {
            octo.getConnection(function(connection) {
                console.log(connection)
                _this.setState({
                    ports: connection.options.ports,
                    bauds: connection.options.baudrates
                })
            })
        }

        if (enableUpdateTempInterval) {
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

    connectPrinter: function(settings) {
        octo.setConnection(settings.port, settings.baud, function(printer) {
            var intervalCount = 0
            var intervalID = setInterval(function() {
                intervalCount += 1;

                octo.getConnection(function(connection) {
                    if (connection.current.state === 'Operational') {
                        this.setState({connected: true})
                        clearInterval(intervalID)
                    }
                }.bind(this))

                if (intervalCount > 3) {
                    clearInterval(intervalID)
                    octo.onError('Trouble connecting to printer')

                }

            }.bind(this), 1000)
        }.bind(this))
    },

    disconnectPrinter: function() {
        octo.disconnect(function(printer) {
            var intervalCount = 0
            var intervalID = setInterval(function() {
                intervalCount += 1;

                octo.getConnection(function(connection) {
                    if (connection.current.state === 'Closed') {
                        this.setState({connected: false})
                        clearInterval(intervalID)
                    }
                }.bind(this))

                if (intervalCount > 3) {
                    clearInterval(intervalID)
                    octo.onError('Trouble connecting to printer')

                }

            }.bind(this), 1000)
        }.bind(this))
    },

    getInitialState: function() {
        return {
            connected: false,
            temps: {
                hotend: {actual: 0},
                bed: {actual: 0}
            },
            ports: [],
            bauds: []
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
                octo.movePrinter(function() {}, -10);
                break;
            case 'left':
                octo.movePrinter(function() {}, 10);
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
            case 'extrude':
                octo.extrude(5, function() {});
                break;
            case 'retract':
                octo.extrude(-5, function() {});
                break;

            case 'start':
                /*ecto.*/
                break;
            case 'pause':
                break;
            case 'stop':
                break;
        }
        octo.getPrinter(function(printer) {
            console.log(printer)
        })
    },

    render: function() {
        var buttonStyle = { marginLeft: '56px' }

        if (! this.state.connected) {
            var portSelection = <PortSelection ports={this.state.ports} bauds={this.state.bauds} onConnectPrinter={this.connectPrinter} />
        }

        if (this.state.connected) {
            var disconnectButton = <button className="btn btn-sm" onClick={this.disconnectPrinter}>Disconnect</button>
        }

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2">
                        {this.state.connected ? 'Connected' : 'Not Connected'}
                        {disconnectButton}
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-2">

                        <button className="btn btn-lg btn-default" style={buttonStyle} disabled={this.state.connected ? '' : 'disabled'} onClick={this.handleClick.bind(this, 'up')}>
                            <span className="glyphicon glyphicon-arrow-up"></span>
                        </button>
                        <br/>

                        <button className="btn btn-lg btn-default" disabled={this.state.connected ? '' : 'disabled'} onClick={this.handleClick.bind(this, 'left')}>
                            <span className="glyphicon glyphicon-arrow-left"></span>
                        </button>

                        <button className="home-btn btn btn-lg btn-default" disabled={this.state.connected ? '' : 'disabled'} onClick={this.handleClick.bind(this, 'home')}>
                            <span className="glyphicon glyphicon-home"></span>
                        </button>

                        <button className="btn btn-lg btn-default" disabled={this.state.connected ? '' : 'disabled'} onClick={this.handleClick.bind(this, 'right')}>
                            <span className="glyphicon glyphicon-arrow-right"></span>
                        </button>
                        <br/>

                        <button className="btn btn-lg btn-default" style={buttonStyle} disabled={this.state.connected ? '' : 'disabled'} onClick={this.handleClick.bind(this, 'down')}>
                            <span className="glyphicon glyphicon-arrow-down"></span>
                        </button>
                    </div>

                    <div className="col-md-1">
                        <button className="btn btn-lg btn-default" disabled={this.state.connected ? '' : 'disabled'} onClick={this.handleClick.bind(this, 'z-up')}>
                            <span className="glyphicon glyphicon-arrow-up"></span>
                        </button>
                        <br/>

                        <button className="z-home-btn btn btn-lg btn-default" disabled={this.state.connected ? '' : 'disabled'} onClick={this.handleClick.bind(this, 'z-home')}>
                            <span className="glyphicon glyphicon-home"></span>
                        </button>
                        <br/>

                        <button className="btn btn-lg btn-default" disabled={this.state.connected ? '' : 'disabled'} onClick={this.handleClick.bind(this, 'z-down')}>
                            <span className="glyphicon glyphicon-arrow-down"></span>
                        </button>
                        <br/>
                    </div>

                    <div className="col-md-1">
                        {portSelection}
                    </div>

                </div>

                <div className="row">
                    <div className="col-sm-12 col-md-12">
                        <button className="btn btn-lg btn-default" disabled={this.state.connected ? '' : 'disabled'} onClick={this.handleClick.bind(this, 'retract')}>
                            <span className="glyphicon glyphicon-minus"></span>
                        </button>
                        <br/>

                        <button className="btn btn-lg btn-default" disabled={this.state.connected ? '' : 'disabled'} onClick={this.handleClick.bind(this, 'extrude')}>
                            <span className="glyphicon glyphicon-plus"></span>
                        </button>
                        <br/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12 col-md-12">
                        <button className="btn btn-lg btn-default" disabled={this.state.connected ? '' : 'disabled'} onClick={this.handleClick.bind(this, 'start')}>
                            <span className="glyphicon glyphicon-play"></span>
                        </button>

                        <button className="btn btn-lg btn-default" disabled={this.state.connected ? '' : 'disabled'} onClick={this.handleClick.bind(this, 'pause')}>
                            <span className="glyphicon glyphicon-pause"></span>
                        </button>

                        <button className="btn btn-lg btn-default" disabled={this.state.connected ? '' : 'disabled'} onClick={this.handleClick.bind(this, 'stop')}>
                            <span className="glyphicon glyphicon-stop"></span>
                        </button>
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
