import express = require("express")

const app: express.Application = express()

app.get("/", function (req, res) {
	res.send("Chat Api")
})

app.listen(5000, function () {
	console.log("App is listening on port 5000");
})
