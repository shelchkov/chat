"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
app.get("/", function (req, res) {
    res.send("Chat Api");
});
app.listen(5000, function () {
    console.log("App is listening on port 5000");
});
