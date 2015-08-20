var React = require('react');

var BootstrapModalMixin = require('./BootstrapModalMixin')

var BootstrapModal = React.createClass({
    mixins: [BootstrapModalMixin],

    render: function() {
        if (this.props.buttons) {
            var footer = <div className="modal-footer">
                {buttons}
            </div>
        }

        return (
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <strong>{this.props.header}</strong>
                        </div>
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                        {footer}
                    </div>
                </div>
            </div>
        )
    }
})

module.exports = BootstrapModal;
