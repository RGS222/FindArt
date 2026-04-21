import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://collectionapi.metmuseum.org/public/collection/v1";
const subs = ["images/sub1.jpg", "images/sub2.jpg", "images/sub3.jpg"];
const frames = [
    {
        file: "images/frame1.png",
        dimension: [1292,1734],
        picture_dimension: [883,1292],
        picture_offset: [200,220],
    },
    {
        file: "images/frame2.png",
        dimension: [1666,2409],
        picture_dimension: [1336,2038],
        picture_offset: [169,179], 
    },
    {
        file: "images/frame3.png",
        dimension: [2031,2396],
        picture_dimension: [1609,1993],
        picture_offset: [203,199],
    }
];

const departments = [
    {
      "departmentId": 1,
      "displayName": "American Decorative Arts"
    },
    {
      "departmentId": 6,
      "displayName": "Asian Art"
    },
    {
      "departmentId": 7,
      "displayName": "The Cloisters"
    },
    {
      "departmentId": 9,
      "displayName": "Drawings and Prints"
    },
    {
      "departmentId": 11,
      "displayName": "European Paintings"
    },
    {
      "departmentId": 15,
      "displayName": "The Robert Lehman Collection"
    },
];

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    try {
        res.render("index.ejs", {
            categories: departments,
        });        
    }
    catch(error) {
        res.status(404).send(error.message);
    }
});

app.get("/arts", async (req, res) => {
    let search = [];
    if (req.query.department > 0) {
        search.push("departmentId=" + req.query.department);
    }
    search.push("q=" + req.query.search);
    search.push("hasImages=true");
    let suffix = "/search?" + search.join("&");
    // console.log(suffix);
    let imageSrc = "";
    try {
        const response = await axios.get(API_URL + suffix);

        if (response.data.objectIDs)
        {
            let objectIds = response.data.objectIDs;
            let objectId = objectIds[Math.floor(Math.random() * objectIds.length)];
            const objResponse = await axios.get(API_URL + "/objects/" + objectId);
            imageSrc = objResponse.data.primaryImageSmall;
        }
    }
    catch(error) {
        res.status(404).send(error.message);
    }

    if (!imageSrc) {
        //get substitute image
        imageSrc = subs[Math.floor(Math.random() * subs.length)];
    }
    let frame = frames[Math.floor(Math.random() * frames.length)];

    res.render("index.ejs", {
        categories: departments,
        imageSrc: imageSrc,
        frame: frame,
    });

});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});