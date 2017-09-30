'use strict'
// Initialize SDK
// based on https://github.com/box/box-node-sdk and http://opensource.box.com/box-node-sdk/Files.html and https://app.box.com/master/content/2547792580/0/0
var box = require('box-node-sdk')
var fs = require('fs')

let configFile = fs.readFileSync('config.json')
configFile = JSON.parse(configFile)
let session = box.getPreconfiguredInstance(configFile)
let serviceAccountClient = session.getAppAuthClient('enterprise')

// serviceAccountClient.users.get('me', null)
// .then((serviceAccountUser) => {
//     // Log the Service Account's login value which should contain "AutomationUser". 
//     // For example, AutomationUser_375517_dxVhfxwzLL@boxdevedition.com
//     console.log(serviceAccountUser.login)
// })
// .catch((err) => {
//     // Log any errors for debugging 
//     console.log(err);
// })

// serviceAccountClient.search.query('uploadtest.txt',null,(error, data)=> {
//     console.log(data.entries)
// })

// serviceAccountClient.files.getReadStream('39093244740',null,(error, data)=> {
//     if(error) {
//         console.log(error)
//     }
//     let writableStream = fs.createWriteStream('voldermort')
//     data.pipe(writableStream)
// })



serviceAccountClient.folders.getItems(,null,(error, data)=> {
    console.log(data)
})

// serviceAccountClient.folders.create('38511393171','test2', (error, data)=>{
//     // { type: 'folder',
//     // id: '38511393171',
//     // sequence_id: '0',
//     // etag: '0',
//     // name: 'test',
//     // created_at: '2017-09-20T07:03:27-07:00',
//     // modified_at: '2017-09-20T07:03:27-07:00',
//     // description: '',
//     // size: 0,
//     // path_collection: { total_count: 1, entries: [ [Object] ] },
//     // created_by: 
//     //  { type: 'user',
//     //    id: '2547792580',
//     //    name: 'voldemort-int',
//     //    login: 'AutomationUser_418042_xT7aVcnrA1@boxdevedition.com' },
//     // modified_by: 
//     //  { type: 'user',
//     //    id: '2547792580',
//     //    name: 'voldemort-int',
//     //    login: 'AutomationUser_418042_xT7aVcnrA1@boxdevedition.com' },
//     // trashed_at: null,
//     // purged_at: null,
//     // content_created_at: '2017-09-20T07:03:27-07:00',
//     // content_modified_at: '2017-09-20T07:03:27-07:00',
//     // owned_by: 
//     //  { type: 'user',
//     //    id: '2547792580',
//     //    name: 'voldemort-int',
//     //    login: 'AutomationUser_418042_xT7aVcnrA1@boxdevedition.com' },
//     // shared_link: null,
//     // folder_upload_email: null,
//     // parent: 
//     //  { type: 'folder',
//     //    id: '0',
//     //    sequence_id: null,
//     //    etag: null,
//     //    name: 'All Files' },
//     // item_status: 'active',
//     // item_collection: 
//     //  { total_count: 0,
//     //    entries: [],
//     //    offset: 0,
//     //    limit: 100,
//     //    order: [ [Object], [Object] ] } }
//     console.log(data)
// })



// var stream = fs.createReadStream('./uploadtest.txt')
// serviceAccountClient.files.uploadFile('0', 'uploadtest2.txt', stream, (error, data)=>{
//     // { total_count: 1,
//     //     entries: 
//     //      [ { type: 'file',
//     //          id: '226274106620',
//     //          file_version: [Object],
//     //          sequence_id: '0',
//     //          etag: '0',
//     //          sha1: '9dc628289966d144c1a5fa20dd60b1ca1b9de6ed',
//     //          name: 'uploadtest2.txt',
//     //          description: '',
//     //          size: 6,
//     //          path_collection: [Object],
//     //          created_at: '2017-09-19T14:00:32-07:00',
//     //          modified_at: '2017-09-19T14:00:32-07:00',
//     //          trashed_at: null,
//     //          purged_at: null,
//     //          content_created_at: '2017-09-19T14:00:32-07:00',
//     //          content_modified_at: '2017-09-19T14:00:32-07:00',
//     //          created_by: [Object],
//     //          modified_by: [Object],
//     //          owned_by: [Object],
//     //          shared_link: null,
//     //          parent: [Object],
//     //          item_status: 'active' } ] }
//     console.log(data)
//     if (error) {
//         console.log('Got an error during upload!')
//         return
//     }
// })

// serviceAccountClient.files.getReadStream('24970300', null, function(error, stream) {
//     if (error) {
//         console.log('Got an error!')
//         return
//     }

//     // write the file to disk
//     var output = fs.createWriteStream('./jamerson_curriculo.pdf')
//     stream.pipe(output)
//     console.log('DONE')
// })