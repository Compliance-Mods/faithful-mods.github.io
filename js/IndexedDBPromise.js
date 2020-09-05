class IndexedDBStore {
    constructor(db, storeName, access, createdStore = undefined) {
        this.db = db
        this.storeName = storeName
        this.access = access
        this.createdStore = createdStore
        
        let store = createdStore
        if(!store) {
            const tr = this.db.transaction(this.storeName, this.access)
            store = tr.objectStore(this.storeName)
        }
        
        let that = this;
        
        Object.keys(store.__proto__).forEach(key => {
            if(typeof store[key] === 'function') {
                that[key] = function() {
                    return new Promise((resolve, reject) => {
                        try {
                            
                            const req = that.store[key].apply(that.store, arguments)
                            
                            const returnType = req.__proto__.constructor.name
                            
                            if(returnType === 'IDBRequest') {
                                req.onsuccess = function(e) {
                                    resolve(e.target.result)
                                }
                                
                                req.onerror = function(err) {
                                    reject(err)
                                }
                            } else {
                                resolve(req)
                            }
                        } catch(err) {
                            reject(err)
                        }
                    })
                }
            }
        })
    }
    
    get store() {
        if(!this.createdStore) {
            const tr = this.db.transaction(this.storeName, this.access)
            return tr.objectStore(this.storeName)
        }
        return this.createdStore
        
    }
    set store(_value) {}
}

class IndexedDBDatabase {
    constructor(name, db, stores = undefined) {
        this.name = name
        this.db = db
        this.stores = stores
    }
    
    getStore(storeName, access) {
        return new Promise((resolve, reject) => {
            if(!!this.stores && Array.isArray(this.stores)) {
                let i = this.stores.findIndex(el => el.name === storeName)
                
                if(i != -1) {
                    resolve(new IndexedDBStore(this.db, storeName, access, this.stores[i].store))
                    return;
                }
            }
            
            resolve(new IndexedDBStore(this.db, storeName, access))
        })
    }
    
    close() {
        return IndexedDBPromise.close(this.name)
    }
    
    delete() {
        return IndexedDBPromise.delete(this.name)
    }
}

const IndexedDBPromise = {
    databases: [],
    open: function(name, version, stores = []) {
        let that = this;
        return new Promise(function(resolve, reject) {
            const request = indexedDB.open(name, version)
            let upgrading = false
            
            request.onsuccess = function(e) {
                if(!upgrading) {
                    let result = new IndexedDBDatabase(name, e.target.result)
                    that.databases.push(result)
                    resolve(result)
                }
            }
            
            request.onerror = function(e) {
                reject(e)
            }
        
            request.onupgradeneeded = function(e) {
                upgrading = true
                
                let db = e.target.result
                let store
                
                if(!!stores && Array.isArray(stores)) {
                    for(let i = 0; i < stores.length; ++i) {
                        store = stores[i]
                        
                        let tmp;
                        if('options' in store) {
                            tmp = db.createObjectStore(store.name, store.options)
                        } else {
                            tmp = db.createObjectStore(store.name)
                        }
                        store.store = tmp
                    }
                    
                    let result = new IndexedDBDatabase(name, db, stores)
                    that.databases.push(result)
                    resolve(result)
                } else {
                    reject('Uncorrect stores provided')
                }
            }
        })
    },
    close: function(name) {
        return new Promise((resolve, reject) => {
            let i
            while( (i = this.databases.findIndex(el => el.name === name)) != -1) {
                this.databases[i].db.close()
                this.databases.splice(i, 1)
            }
            
            resolve()
        })
    },
    delete: function(name) {
        return new Promise((resolve, reject) => {
            this.close(name).finally(() => {
                var DBDeleteRequest = window.indexedDB.deleteDatabase(name)
                
                DBDeleteRequest.onerror = function(error) {
                  reject(error)
                };
                 
                DBDeleteRequest.onsuccess = function(event) {
                  resolve(event)
                };
            })
        })
    }
}