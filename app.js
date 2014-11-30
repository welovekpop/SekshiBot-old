var readline = require("readline");
var Sekshi = require("./sekshi");

var sekshi = new Sekshi();
var rl = readline.createInterface(process.stdin, process.stdout);

sekshi.start();

rl.setPrompt("Sekshi> ");
rl.prompt();

rl.on("line", function(line) {
    switch(line) {
        case "reloadmodules":
            sekshi.unloadModulesSync();
            sekshi.loadModulesSync();
            break;

        case "unloadmodules":
            sekshi.unloadModulesSync();
            break;

        case "loadmodules":
            sekshi.loadModulesSync();
            break;

        case "start":
            sekshi.start();
            break;

        case "stop":
            sekshi.stop();
            break;

        case "exit":
            sekshi.stop();
            process.exit(0);
            break;

        case "help":
            console.log("commands:\n\
                reloadmodules: reloads all modules in module path.\n\
                unloadmodules: unloads all modules in module path.\n\
                loadmodules: loads all modules in module path.\n\
                start: logs the bot in.\n\
                stop: logs the bot out.\n\
                exit: stops application.");
            break;

        default:
            console.log("unknown command: " + line);
            break;
    }
    rl.prompt();
});