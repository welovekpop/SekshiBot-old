var Sekshi = require("./sekshi");
var sekshi = new Sekshi("./config.json");

sekshi.loadModulesSync("./modules");

sekshi.start();