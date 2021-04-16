

exports.startServer = function(server) {
    return function(req, res){
        server.startServer()
            .then(response => res.send(response))
            .catch(err => res.status(500).send(err));
    }
}

exports.killServer = function(server) {
    return function(req, res){
        server.killServer()
            .then(response => res.send(response))
            .catch(err => res.status(400).send(err));
    }
}