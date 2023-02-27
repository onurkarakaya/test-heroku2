const fetch = require("node-fetch");

module.exports = function() {
    return new Promise(function(myResolve, myReject) {
        fetch("https://api.orhanaydogdu.com.tr/deprem/kandilli/live?limit=10")
            .catch(() => myReject("Error"))
            .then((res) => res.json())
            .then((res) => {            
                myResolve(res);
            });
    });
}