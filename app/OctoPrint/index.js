class OctoPrint {
    constructor(props) {
        this.server = 'localhost'
        this.port = 5000
        this.base = 'api'

        if ('server' in props)
            this.server = props.server

        if ('port' in props)
            this.port = props.port

        if ('base' in props)
            this.base = props.base

        console.log(this.server, this.port, this.base)
    }

    callAPI(method, resource, request = {}, cb) {
        var url = `http://${this.server}:${this.port}/${resource}`

        console.info(`${method} ${resource}`)

        var myRequest = new XMLHttpRequest();
        myRequest.addEventListener('load', function() {
            if (this.responseText.length != 0) {
                var obj = JSON.parse(this.responseText)
                cb(obj)
            } else {
                cb(undefined)
            }
        })
        myRequest.open(method, url, true);

        if ( Object.keys(request).length != 0 ) {
            myRequest.setRequestHeader('Content-Type', 'application/json')
            myRequest.send(JSON.stringify(request));
        } else {
            myRequest.send()
        }

        return url
    }

    getTool(cb) {
        var resource = `${this.base}/printer/tool`
        return this.callAPI('GET', resource, {}, cb)
    }

    getPrinter(cb) {
        var resource = `${this.base}/printer`
        return this.callAPI('GET', resource, {}, cb)
    }

    movePrinter(cb, x = 0, y = 0, z = 0) {
        var resource = `${this.base}/printer/printhead`
        var request = {
            command: 'jog'
        }

        if (x) request.x = x
        if (y) request.y = y
        if (z) request.z = z


        return this.callAPI('POST', resource, request, cb)
    }

    _homePrinter(axes, cb) {
        var resource = `${this.base}/printer/printhead`
        var request = {
            command: 'home',
            axes: axes
        }

        return this.callAPI('POST', resource, request, cb)
    }

    homeAxes(axes, cb) {
        if (Array.isArray(axes))
            this._homePrinter(axes, cb)
        else
            this._homePrinter([axes], cb)
    }

    getFiles(cb) {
        var resource = `${this.base}/files`
        return this.callAPI('GET', resource, cb)
    }
}

export default OctoPrint;
