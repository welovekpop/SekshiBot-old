var Sekshi = require("./sekshi");
var sekshi = new Sekshi();

sekshi.loadModulesSync("./modules");

sekshi.start({
    "email": "sa@gmail.com",
    "password": "sa"
}, "loves-kpop");