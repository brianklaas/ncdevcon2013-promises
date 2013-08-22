From:
http://coenraets.org/blog/2013/04/building-pluggable-and-mock-data-adapters-for-web-and-phonegap-applications/

var MemoryAdapter = function() {

    this.initialize = function() {
        // No Initialization required
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }

	this.findByName = function(searchKey) {
        var deferred = $.Deferred();
        var results = employees.filter(function(element) {
            var fullName = element.firstName + " " + element.lastName;
            return fullName.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
        });
        deferred.resolve(results);
        return deferred.promise();
    }

    var employees = [
        {"id": 1, "firstName": "James", "lastName": "King", "title": "President and CEO"},
        {"id": 2, "firstName": "Julie", "lastName": "Taylor", "title": "VP of Marketing"},
        ...
    ];

}

var JSONPAdapter = function() {

    this.initialize = function(data) {
        var deferred = $.Deferred();
        url = data;
        deferred.resolve();
        return deferred.promise();
    }

    this.findByName = function(searchKey) {
        return $.ajax({url: url + "?name=" + searchKey, dataType: "jsonp"});
    }

    var url;

}


var app = {

    findByName: function() {
        this.store.findByName($('.search-key').val()).done(function(employees) {
            var l = employees.length;
            var e;
            $('.employee-list').empty();
            for (var i=0; i<l; i++) {
                e = employees[i];
                $('.employee-list').append('<li><a href="#employees/' + e.id + '">' + e.firstName + ' ' + e.lastName + '</a></li>');
            }
        });
    },

    initialize: function() {
        this.store = new MemoryAdapter();
        this.store.initialize().done(function() {
            console.log("Data store initialized");
        });
        $('.search-key').on('keyup', $.proxy(this.findByName, this));
    }

};

app.initialize();