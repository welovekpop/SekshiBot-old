var Sekshi = require("./sekshi");
var sekshi = new Sekshi();

sekshi.loadModulesSync("./modules");

sekshi.start("config.json");