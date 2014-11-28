function Sample(sekshi) {
    this.str = "Hello Sample";
    this.sekshi = sekshi;

    this.permission = {
    "hello": sekshi.USERROLE.NONE,
    "smple": sekshi.USERROLE.MANAGER
    };
}

Sample.prototype.hello = function() {
    this.sekshi.sendChat("sample module");
};

Sample.prototype.smple = function(user, repeat) {
    this.sekshi.sendChat(['@', user.username, " entered as argument: ", repeat].join(''), 5*1000);
};

module.exports = Sample;