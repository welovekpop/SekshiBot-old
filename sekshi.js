/*****************************/
/*         sekshi.js         */
/*         by Sooyou         */
/*                           */
/*  Last Modified: 24/11/14  */
/*  by: Sooyou               */
/*****************************/
/* Bot created for We <3 KPOP*/
/*          on plug.dj.      */
/*                           */
/*          join at:         */
/*    play.welovekpop.club   */
/*****************************/

var mongoose = require("mongoose");
var Plugged = require("plugged");
var redis = require("redis");
var path = require("path");
var util = require("util");
var fs = require("fs");
var nconf = require("nconf");

function Sekshi(config_path) {
    Sekshi.super_.call(this);

    this.config = nconf;
    this.config.file(config_path || "./config.json");

    this.modules = [];
    this.delimiter = this.config.get("delimiter") || "!";
}

util.inherits(Sekshi, Plugged);

Sekshi.prototype.start = function() {
    try {
        this.login(this.config.get("credentials"));
    }
    catch (err) {
        console.error(err.message);
        return;
    }

    this.on(this.CONNECTED, function _onConnect() {

        this.connect(this.config.get("room"), function _onRoomJoinError(err) {
            if(!err) {
                this.on(this.CHAT, this.onMessage.bind(this));
            } else {
                console.log(err);
                process.exit(1);
            }
        }.bind(this));

    }.bind(this));
};

Sekshi.prototype.stop = function() {
    this.unloadModules();

    this.logout(function _logout() {
        this.off(this.CHAT);
    });
};

Sekshi.prototype.parseArguments = function(str, args) {
    args = args || [];
    str = str || "";
    var length = str.length;
    var compound = false;   //quoted?
    var sarg = false;       //started argument?
    var sidx = 0;           //start index
    var cidx = 0;           //current index


    //instead of apply the rules ([^"]+)"|(\S+) in an regular expression
    //it seemed to be a quicker approach to apply the rules manually
    //old school style.
    //rule1: every non quoted word is a single argument
    //rule2: quoted words are meant to be a single argument
    while(cidx < length) {
        if(!sarg && str[cidx] !== ' ') {
            
            if(str[cidx] === '"') {
                sidx = ++cidx;
                compound = true;
            } else {
                sidx = cidx;
            }

            sarg = true;
        } else if(sarg && !compound && str[cidx] === ' ') {
            args.push(str.slice(sidx, cidx));
            sarg = false;
        } else if(sarg && compound && str[cidx] === '"') {
            args.push(str.slice(sidx, cidx));
            compound = false;
            sarg = false;
        }

        cidx++;
    }

    if(sarg)
        args.push(str.slice(sidx, cidx));
};

Sekshi.prototype.onMessage = function(msg) {
    if(msg.message.charAt(0) === this.delimiter) {
        this.deleteMessage(msg.cid);

        var self = this;
        var args = [];
        var func = null;

        this.parseArguments(msg.message, args);

        func = args.shift().replace(this.delimiter, '');
        args.unshift(self.getUserByID(msg.id, true));

        for(var i = 0, l = self.modules.length; i < l; i++) {
            if(self.modules[i].enabled && typeof self.modules[i].module[func] === "function") {
                if(args[0].role >= self.modules[i].module.permissions[func])
                    self.modules[i].module[func].apply(self.modules[i].module, args);
                else
                    self.sendChat(['@', msg.username, " you don't have permission to use this command"].join(''), 5*1000);
                break;
            }
        }
    } else {
        console.log([msg.username, ": ", msg.message].join(''));
    }
};

//delimiter used for chat commands
Sekshi.prototype.setDelimiter = function(delimiter) {
    this.delimiter = delimiter;
};

//load all modules of a base path
Sekshi.prototype.loadModulesSync = function(modulePath) {
    if(!fs.existsSync(modulePath)) {
        console.log(modulePath + " does not exist!");
        return;
    }

    var stat = fs.statSync(modulePath);

    if(typeof stat === "undefined") {
        console.log("An error occured while fetching the path");
    } else {
        if(stat.isDirectory()) {
            var files = fs.readdirSync(modulePath);

            if(typeof files !== "undefined") {
                for(var i = 0, l = files.length; i < l; i++)
                    this.loadModulesSync(path.join(modulePath, files[i]));
            }

        } else if(stat.isFile()) {
            if(modulePath.slice(modulePath.indexOf('.') + 1) === "module.js") {
                var module = require(["./", modulePath].join(''));

                this.modules.push({
                    enabled: true,
                    module: new module(this)
                });
            }
        }
    }
}

Sekshi.prototype.unloadModules = function() {
    for(var i = 0, l = this.modules.length; i < l; i++) {
        //make sure destroy exists
        if(typeof this.modules[i].module !== "undefined" && typeof this.modules[i].module.destroy === "function")
            this.modules[i].module.destroy();
    }

    this.modules = [];
};

module.exports = Sekshi;