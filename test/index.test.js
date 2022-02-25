const localdb = require("../index.js")

// create local db (returns path)
const dataPath = localdb.createDB("MyTest", { logStatus: true })

// write to db/auth/users.json
// localdb.write("auth/users.json", JSON.stringify([{ test: "Hello, world!" }]), (err) => { if (err) { return console.error(err) } })

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

// create server with vercel serve
const handler = require('serve-handler')
const http = require('http')

const baseUrl = "/test"
const specialUrls = ['api']

const server = http.createServer((request, response) => {
  request.url.split("/").forEach((_url_point) => {
    if (specialUrls.includes(_url_point)) {
      // is special url with special response
      if (_url_point === "api") {
        console.log("API request recieved")

        if (request.url.split("/").includes("newuser")) {
          const query = request.url.split("?")[1]

          function getValue(name) {
            // get value from url query (?test=1&test1=2)
            const promise = new Promise((resolve, reject) => {
              const values = query.split("=")
              values.forEach((_query) => {
                let i = values.indexOf(_query)
                const value = values.at(i + 1)
                if (_query === name && value) {
                  resolve(value)
                } else {
                  reject()
                }
              })
            })


            return promise
          }

          // get query
          getValue("name")
            .then((name) => {
              localdb.read("auth/users.json", (data, err) => {
                if (err) {
                  console.error(err)
                } else {
                  let newData = JSON.parse(data)
                  newData.push({
                    username: name
                  })

                  // write new data to file
                  localdb.write("auth/users.json", JSON.stringify(newData), () => { return })
                }
              })
            })
        }
      }

      return handler(request, response, {
        "public": baseUrl + "/" + request.url, // make ./test/{url} the base url
        cleanUrls: true,
      })
    } else {
      // return default response
      return handler(request, response, {
        "public": baseUrl, // make ./test the base url
        cleanUrls: true,
      })
    }
  })
})

server.listen(3000, () => {
  console.log('Running at http://localhost:3000')
})