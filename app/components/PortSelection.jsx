var React = require( 'react' );

var remote = require('remote')
var app = remote.require('app')
var fs = require( 'fs' );

var PortSelection = React.createClass({
    getInitialState: function() {
        var userDataPath = app.getPath('userData');

        var data = JSON.stringify(this.state);

        var data
        if(fs.existsSync(userDataPath + '/settings.json')) {
            var json = fs.readFileSync(userDataPath + '/settings.json')
            data = JSON.parse(json)
        }

        if (data['on-connect-save-auto-connect']) {
            this.props.onConnectPrinter(data)

            return {
                port: null,
                baud: null,
            }
        } else {
            return {
                port: null,
                baud: null,
                'on-connect-save-auto-connect': false
            }
        }
    },

    isValid: function() {
        var valid = this.state.port != null && this.state.baud != null
        return valid
    },

    handleCOMMSelect: function(port) {
        this.setState({port: port})
        //this.props.onConnectPrinter(option.value)
    },

    handleBaudSelect: function(baud) {
        this.setState({baud: parseInt(baud)})
    },

    handleConnect: function() {
        this.props.onConnectPrinter(this.state)

        // need to make sure settings actually worked before we try saving them to the auto connect file.
        if (this.state['on-connect-save-auto-connect']) {
            var userDataPath = app.getPath('userData');

            var data = JSON.stringify(this.state);

            fs.writeFile(userDataPath + '/settings.json', data, function(error) {
                if (error) throw error;
                console.info('successfully saved settings.json')
            })
        }
    },

    handleAutoConnect: function() {
        this.setState({'on-connect-save-auto-connect': true})

    },

    render: function() {
        var ports = this.props.ports;
        var bauds = this.props.bauds;
        var disabled = !this.isValid()

        return (
            <div>
                <Select onChange={this.handleCOMMSelect}>
                    <option>Please select</option>

                    {ports.map(function(item, idx) {
                        return <option key={idx} value={item}>{item}</option>
                    })}
                </Select>

                <Select onChange={this.handleBaudSelect}>
                    <option>Please select</option>

                    {bauds.map(function(item, idx) {
                        return <option key={idx} value={item}>{item}</option>
                    })}
                </Select>

                <button className="btn btn-primary" onClick={this.handleConnect} disabled={disabled}>Connect</button>
                <label className="checkbox-inline">
                    <input type="checkbox" ref="autoconnect" onClick={this.handleAutoConnect} />
                    Autoconnect
                </label>
            </div>
        )
    }
})

var Select = React.createClass({
    handleSelect: function() {
        var el = this.getDOMNode()
        var option = el.options[el.selectedIndex]
        this.props.onChange(option.value)
    },

    render: function() {
        return (
            <select onChange={this.handleSelect}>
                {this.props.children}
            </select>
        )
    }
})

module.exports = PortSelection;
