require("dotenv/config");

const express = require("express");
const app = express();
const cors = require("cors");
const homepageRoute = require("./routes/homepage");
const aboutUsRoute = require("./routes/aboutUs");
const galleryRoute = require("./routes/gallery");
const menuRoute = require("./routes/menu");

//middleware
app.use(cors());
app.use(express.json());

//homepage route
app.get("/homepage", homepageRoute);
app.get("/homepage/section/1", homepageRoute);
app.post("/homepage/section/1", homepageRoute);
app.put("/homepage/section/1/:id", homepageRoute);
app.delete("/homepage/section/1/:id", homepageRoute);

app.get("/homepage/section/2", homepageRoute);
app.post("/homepage/section/2", homepageRoute);
app.put("/homepage/section/2/:id", homepageRoute);
app.delete("/homepage/section/2/:id", homepageRoute);

app.get("/homepage/section/3", homepageRoute);
app.post("/homepage/section/3", homepageRoute);
app.put("/homepage/section/3/:id", homepageRoute);
app.delete("/homepage/section/3/:id", homepageRoute);

app.get("/homepage/section/4", homepageRoute);
app.post("/homepage/section/4", homepageRoute);
app.put("/homepage/section/4/:id", homepageRoute);
app.delete("/homepage/section/4/:id", homepageRoute);

//about us route
app.get("/about_us", aboutUsRoute);
app.put("/about_us/:id", aboutUsRoute);

//gallery route
app.get("/gallery", galleryRoute);
app.post("/gallery", galleryRoute);
app.put("/gallery/:id", galleryRoute);
app.delete("/gallery/:id", galleryRoute);

//menu route
app.get("/menu", menuRoute);
app.get("/menu/:name", menuRoute);
app.get("/menu/recommend", menuRoute);
app.post("/menu", menuRoute);
app.put("/menu/:id", menuRoute);
app.delete("/menu/:id", menuRoute);

//listen on port 5001
app.listen(process.env.API_PORT, () => {
  console.log("Server has started on PORT 5001");
});
