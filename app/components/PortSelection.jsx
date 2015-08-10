var React = require( 'react' );

var PortSelection = React.createClass({
    getInitialState: function() {
        return {
            port: null,
            baud: null
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
