import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://collectionapi.metmuseum.org/public/collection/v1";

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    try {
        const response = await axios.get(API_URL + "/departments");
        console.log(response.data.departments);
        res.render("index.ejs", {
            categories: response.data.departments
        });        
    }
    catch(error) {
        res.status(404).send(error.message);
    }
});

app.get("/arts", async (req, res) => {
    let search = [];
    if (req.query.departmentId > 0) {
        search.push("departmentId=" + req.query.departmentId)
    }
    search.push("q=" + req.query.searchTerm)
    search.push("hasImages=true")
    let suffix = "/search?" + search.join("&");

    try {
        const response = await axios.get(API_URL + suffix);
        let objectId = 0;
        if (response.data.objectIDs)
        {
            let objectIds = response.data.objectIDs;
            objectId = objectIds[Math.floor(Math.random() * objectIds.length)];
            const objResponse = await axios.get(API_URL + "/objects/" + objectId);
            console.log(objResponse.data.primaryImage)
            res.render("index.ejs", {
                imageURL: objResponse.data.primaryImage
            });
        }
    }
    catch(error) {
        res.status(404).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});