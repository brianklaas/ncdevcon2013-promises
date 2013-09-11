Credit card processing via the Balanced API
From: https://hacks.mozilla.org/2013/07/so-you-wanna-build-a-crowdfunding-site/

// Helper method for using deferreds to call the Balanced REST API
var Q = require('q');
var httpRequest = require('request');
function _callBalanced(url,params){

    // Promise an HTTP POST Request
    var deferred = Q.defer();
    httpRequest.post({

        url: "https://api.balancedpayments.com"+BALANCED_MARKETPLACE_URI+url,
        auth: {
            user: BALANCED_API_KEY,
            pass: "",
            sendImmediately: true
        },
        json: params

    }, function(error,response,body){

        // Handle all Bad Requests (Error 4XX) or Internal Server Errors (Error 5XX)
        if(body.status_code>=400){
            deferred.reject(body.description);
            return;
        }

        // Successful Requests
        deferred.resolve(body);

    });
    return deferred.promise;

}

// Pay via Balanced
app.post("/pay/balanced",function(request,response){

    // Payment Data
    var card_uri = request.body.card_uri;
    var amount = request.body.amount;
    var name = request.body.name;

    Q.fcall(function(){

        // Create an account with the Card URI
        return _callBalanced("/accounts",{
            card_uri: card_uri
        });

    }).then(function(account){

        // Charge said account for the given amount
        return _callBalanced("/debits",{
            account_uri: account.uri,
            amount: Math.round(amount*100) // Convert from dollars to cents, as integer
        });

	}).then(function(transaction){
		// Store transaction info in the db and return a response....

    },function(err){
        response.send("Error: "+err);
    });

});