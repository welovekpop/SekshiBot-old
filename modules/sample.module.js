function Sample(sekshi) {
    this.str = "Hello Sample";
    this.sekshi = sekshi;

    this.permissions = {
    "hello": sekshi.USERROLE.NONE,
    "smple": sekshi.USERROLE.MANAGER
    };
}

Sample.prototype.name = "Sample Module";
Sample.prototype.author = "Sooyou";
Sample.prototype.version = "0.1.1";
Sample.prototype.description = "Sample Module";

Sample.prototype.hello = function() {
    this.sekshi.sendChat("sample module");
};

Sample.prototype.smple = function(user, repeat) {
    this.sekshi.sendChat(['@', user.username, " entered as argument: ", repeat].join(''), 5*1000);
};

module.exports = Sample;