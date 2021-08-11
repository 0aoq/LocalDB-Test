const localdb = require("./index.js")

// create local db (returns path)
const dataPath = localdb.createDB("MyTest", { logStatus: true })

// write to db/auth/users.json
localdb.write("auth/users.json", JSON.stringify([{ test: "Hello, world!" }]), (err) => { if (err) { return console.error(err) } })

// read from db/auto/users.json
localdb.read("auth/users.json", (data, err) => {
    if (err) {
        console.error(err)
    } else {
        console.log(data)
    }
})

// log the db path
console.log(dataPath)