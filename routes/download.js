// Script to download the database on the download-db route
const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const { error } = require("console");

const downloadDatabase = async () => {
  const response = await axios.get("http://localhost:3000/download-db", {
    responseType: "stream",
  });
  
  const filePath = path.join(__dirname, "/dowloadedFile/phising.db");
  console.log(filePath);
  

  //decide where to save the file on the the local computer
  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);

  writer.on("finish", ()=>{
    console.log("file downloaded successfully");
    
  });

  writer.on("error", (err)=>{
    console.error("Error writing file", err);
    
  })
};

downloadDatabase()

module.exports = downloadDatabase;
