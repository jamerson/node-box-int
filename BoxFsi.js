'use strict';

const box = require('box-node-sdk')
const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf');

var voldemortFolderId = '39093244740'
var voldemortFolderName = 'voldemort'

class BoxFsi {

	constructor () {
        let configFile = fs.readFileSync('config.json')
        configFile = JSON.parse(configFile)
        let session = box.getPreconfiguredInstance(configFile)
        this.serviceAccountClient = session.getAppAuthClient('enterprise')
        this.descriptorIdMap = null
    }

    getVoldemortContent() {
        let descriptorIdMap = { id: '39093244740', type:'folder', items: {} }
        return new Promise((resolve,reject)=>{
            this.serviceAccountClient.folders.getItems(voldemortFolderId,null,(error, data)=> {
                if(error) {
                    reject({error: "Box Communication Error", box_error: error})
                    return
                }
                let promises = []
                data.entries.forEach((item)=>{ 
                    promises.push(this.getContent(item, descriptorIdMap))
                })
    
                Promise.all(promises).then((descriptor)=>{
                    resolve(descriptorIdMap)
                },(error)=>{
                    reject(error)
                }).catch(function (ex) {
                    reject({error: "Internal Exception", exception: ex})
                })
            })
        })
    }

    getContent(fileDescriptor, currentFolderDescriptor) {
        if(fileDescriptor.type === 'file') {
            currentFolderDescriptor.items[fileDescriptor.name] = {
                id:fileDescriptor.id
                ,type: fileDescriptor.type
                ,items: null }
            return Promise.resolve(currentFolderDescriptor)
        } else if(fileDescriptor.type === 'folder') {
            currentFolderDescriptor.items[fileDescriptor.name] = {
                id:fileDescriptor.id
                ,type: fileDescriptor.type
                ,items: {} }
                currentFolderDescriptor.items['..'] = currentFolderDescriptor
            return new Promise((resolve,reject)=>{
                this.serviceAccountClient.folders.getItems(fileDescriptor.id, null, (error, data)=> {
                    if(error) {
                        reject({error: "Box Communication Error", box_error: error})
                        return
                    }

                    let promises = []
                    data.entries.forEach((item)=>{ 
                        promises.push(this.getContent(item,currentFolderDescriptor.items[fileDescriptor.name]))
                    })

                    Promise.all(promises).then(()=>{
                        resolve(currentFolderDescriptor)
                    },(error)=>{
                        reject(error)
                    }).catch(function (ex) {
                        reject({error: "Internal Exception", exception: ex})
                    })
                })
            })
        }
    }
    getEntryId(item_path) {
        return new Promise((resolve, reject) => {
            if(!this.descriptorIdMap) {
                this.getVoldemortContent().then((descriptorIdMap)=>{
                    this.descriptorIdMap = descriptorIdMap

                    let path_parts = item_path.split(path.sep)
                    let path_length = path_parts.length
                    let fileDescriptor = null

                    let current_descriptor = this.descriptorIdMap
                    for(let i = 0; i < path_length; i++) {
                        current_descriptor = current_descriptor.items[path_parts[i]]
                        if(!current_descriptor) {
                            reject({error: "Not Found"})
                            return
                        }
                    }
                    resolve(current_descriptor)
                },(error)=>{
                    reject(error)
                }).catch(function (ex) {
                    reject({error: "Internal Exception", exception: ex})
                })
            }
        })
    }

	// returns a promise containing the list of files on a given directory
	readdir (path) {
        return new Promise((resolve, reject) => {
            this.getEntryId(path).then((fileDescriptor)=> {
                this.serviceAccountClient.folders.getItems(fileDescriptor.id, null, (error, data)=> {
                    if(error) {
                        reject(error)
                        return
                    }
    
                    let result = data.entries.map((item)=>{ 
                        return item.name 
                    })
                    resolve(result)
                })
            },(error)=>{
                reject(error)
            })
        })
	}

	// returns synchronously the list of files on a given directory
	readdirSync (directory) {
		throw new TypeError("FSI is merely an interface, override this method");
	}

	// returns a promise containing data from a file (stream)
	readFile (path, encoding) {
		return new Promise((resolve, reject) => {
            this.getEntryId(path).then((fileDescriptor)=> {
                this.serviceAccountClient.files.getReadStream(fileDescriptor.id, null, (error, data)=> {
                    if(error) {
                        reject(error)
                        return
                    }
                    resolve(data)
                })
            },(error)=>{
                reject(error)
            }).catch(function (ex) {
                reject({error: "Internal Exception", exception: ex})
            })
        })
	}

	// returns synchronously the data from a file
	readFileSync (path, encoding) {
		throw new TypeError("FSI is merely an interface, override this method");
    }

    // check if it is a directory
	isDirectory (path) {
		return new Promise((resolve, reject) => {
            this.getEntryId(path).then((fileDescriptor)=> {
                this.serviceAccountClient.files.getReadStream(fileDescriptor.id, null, (error, data)=> {
                    if(error) {
                        reject(error)
                        return
                    }
                    resolve(fileDescriptor.type === 'folder')
                })
            },(error)=>{
                reject(error)
            })
        })
	}
    
    // check if it is a directory
	isDirectorySync (path) {
		throw new TypeError("FSI is merely an interface, override this method");
	}

	// check if it is a directory
	isDirectorySync (path) {
		throw new TypeError("FSI is merely an interface, override this method");
	}

	// returns the basename of a given directory
	basename (directory) {
		throw new TypeError("FSI is merely an interface, override this method");
	}
}

var fsi = new BoxFsi()

fsi.readFile('uploadtest2.txt').then((result)=>{
    let writableStream = fs.createWriteStream('file2.txt')
    result.pipe(writableStream)
},(error)=>{
    console.log(error)
}).catch(function (ex) {
    console.log(ex)
})

fsi.readFile('00 intro/intro_Speech.mp3').then((result)=>{
    let writableStream = fs.createWriteStream('file2.txt')
    result.pipe(writableStream)
},(error)=>{
    console.log(error)
}).catch(function (ex) {
    console.log(ex)
})

// fsi.getVoldemortContent().then((item)=>{
//     printItem(item)
// },(error)=>{
//     console.log(error)
// }).catch(function (error) {
//     console.log("Promise Rejected", error);
// })

// function printItem(item) {
//     console.log(item.type)
//     if(item.items !== null) {
//         console.log('items:')
//         Object.keys(item.items).forEach((subitem)=>{
//             console.log(subitem)
//             printItem(item.items[subitem])
//         })
//     }
// }
