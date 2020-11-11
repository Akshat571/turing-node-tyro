function handleResponse(error, result, res) {
    if (error != null) {
        res.send({
            error: error
        });
    } else {
        console.log(result);
        res.send(result);
    }
}

exports.handleResponse = handleResponse;