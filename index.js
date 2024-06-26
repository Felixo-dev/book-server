const http = require('http');
const fs = require('fs');
const path = require('path');

const booksDbPath = path.join(__dirname,'books.json');
const usersDbPath = (__dirname, 'users.json');

const PORT = process.env.PORT || 4000;
const HOST_NAME = 'localhost';


//Routes for users
function requestHandler(req, res) {

    if (req.url === '/users' && req.method === "GET") { //Get all usrs
        getAllUsers(req, res)
    } else if (req.url === '/users' && req.method === "POST") { // Create a new user
        addUser(req, res)
    } 
}

function getAllUsers(req, res) {
    fs.readFile(usersDbPath, "utf8", (err, data) => {
        if (err) {
            console.log(err)
            res.writeHead(201)
            res.end("An error occured")
        }

        res.end(data)
    })
}


function addUser(req, res) {
    const body = []

    req.on("data", (chunk) => {
        body.push(chunk)
    })

    req.on("end", () => {
        const parsedUser = Buffer.concat(body).toString()
        const newUser = JSON.parse(parsedUser)

        //add the new user to the end of the existing users array
        fs.readFile(usersDbPath, "utf8", (err, data) => {
            if (err) {
                console.log(err)
                res.writeHead(201)
                res.end("An error occured")
            }

            const oldUsers = JSON.parse(data)
            const allUsers = [...oldUsers, newUser]

            fs.writeFile(users, JSON.stringify(allUsers), (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(400);
                    res.end(JSON.stringify({
                        message: 'Internal Server Error. Could not save user to database.'
                    }));
                }

                res.end(JSON.stringify(newUser));
            });

        })

    })
}

//Routes for books

function requestHandler(req, res) {

    if (req.url === '/books' && req.method === "GET") { //READ
        // LOAD AND RETURN BOOKS
        getAllBooks(req, res)
    } else if (req.url === '/books' && req.method === "POST") { // Create
        addBook(req, res)
    } else if (req.url === '/books' && req.method === "PUT") { // Update
        updateBook(req, res)
    } else if (req.url === '/books' && req.method === "DELETE") {
        deleteBook(req, res)
    }
}

function getAllBooks(req, res) {
    fs.readFile(booksDbPath, "utf8", (err, data) => {
        if (err) {
            console.log(err)
            res.writeHead(400)
            res.end("An error occured")
        }

        res.end(data)
    })
}

function addBook(req, res) {
    const body = []

    req.on("data", (chunk) => {
        body.push(chunk)
    })

    req.on("end", () => {
        const parsedBook = Buffer.concat(body).toString()
        const newBook = JSON.parse(parsedBook)

        //add the new book to the end of the existing books array
        fs.readFile(booksDbPath, "utf8", (err, data) => {
            if (err) {
                console.log(err)
                res.writeHead(400)
                res.end("An error occured")
            }

            const oldBooks = JSON.parse(data)
            const allBooks = [...oldBooks, newBook]

            fs.writeFile(booksDbPath, JSON.stringify(allBooks), (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: 'Internal Server Error. Could not save book to database.'
                    }));
                }

                res.end(JSON.stringify(newBook));
            });

        })

    })
}


function updateBook(req, res) {
    const body = []

    req.on("data", (chunk) => {
        body.push(chunk)
    })

    req.on("end", () => {
        const parsedBook = Buffer.concat(body).toString()
        const detailsToUpdate = JSON.parse(parsedBook)
        const bookId = detailsToUpdate.id

        fs.readFile(booksDbPath, "utf8", (err, books) => {
            if (err) {
                console.log(err)
                res.writeHead(400)
                res.end("An error occured")
            }

            const booksObj = JSON.parse(books)

            const bookIndex = booksObj.findIndex(book => book.id === bookId)

            if (bookIndex === -1) {
                res.writeHead(404)
                res.end("Book with the specified id not found!")
                return
            }

            const updatedBook = { ...booksObj[bookIndex], ...detailsToUpdate }
            booksObj[bookIndex] = updatedBook

            fs.writeFile(booksDbPath, JSON.stringify(booksObj), (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: 'Internal Server Error. Could not save book to database.'
                    }));
                }

                res.writeHead(200)
                res.end("Update successfull!");
            });

        })

    })
}


function deleteBook(req, res) {
    const body = []

    req.on("data", (chunk) => {
        body.push(chunk)
    })

    req.on("end", () => {
        const parsedBook = Buffer.concat(body).toString()
        const detailsToUpdate = JSON.parse(parsedBook)
        const bookId = detailsToUpdate.id

        fs.readFile(booksDbPath, "utf8", (err, books) => {
            if (err) {
                console.log(err)
                res.writeHead(400)
                res.end("An error occured")
            }

            const booksObj = JSON.parse(books)

            const bookIndex = booksObj.findIndex(book => book.id === bookId)

            if (bookIndex === -1) {
                res.writeHead(404)
                res.end("Book with the specified id not found!")
                return
            }

            // DELETE FUNCTION
            booksObj.splice(bookIndex, 1)

            fs.writeFile(booksDbPath, JSON.stringify(booksObj), (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: 'Internal Server Error. Could not save book to database.'
                    }));
                }

                res.writeHead(200)
                res.end("Deletion successfull!");
            });

        })

    })
}


const server = http.createServer(requestHandler)

server.listen(PORT, HOST_NAME, () => {
    booksDB = JSON.parse(fs.readFileSync(booksDbPath, 'utf8'));
    usersDB = JSON.parse(fs.readFileSync(usersDbPath, 'utf8'));
    console.log(`Server is listening on ${HOST_NAME}:${PORT}`)
 
})