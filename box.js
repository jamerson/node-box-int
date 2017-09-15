// Initialize SDK
var BoxSDK = require('box-node-sdk')
var fs = require('fs')

var sdk = new BoxSDK({
  clientID: '5aovqb83nsbmbd7vkc12lzzxe0n9drqf',
  clientSecret: 'lGKXzM1Dlq2vK4ZFTcVIAHQncomSUmUa'
});

// Create a basic API client
var client = sdk.getBasicClient('n62vU5nN2qvu60scIr6NkcFlQOSs84hF');

// Get some of that sweet, sweet data!
client.users.get(client.CURRENT_USER_ID, null, function(err, currentUser) {
  if(err) throw err;
  console.log('Hello, ' + currentUser.name + '!');
});

// The SDK also supports Promises
client.users.get(client.CURRENT_USER_ID)
	.then(user => console.log('Hello', user.name, '!'))
    .catch(err => console.log('Got an error!', err));
    
client.files.getReadStream('24970300', null, function(error, stream) {
    if (error) {
        console.log('Got an error!', error)
    }

    // write the file to disk
    var output = fs.createWriteStream('./jamerson_curriculo.pdf');
    stream.pipe(output);
    console.log('DONE')
});