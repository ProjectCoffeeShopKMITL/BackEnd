require("dotenv/config");

const express = require("express");
const app = express();
const cors = require("cors");
const homepageRoute = require("./routes/homepage");
const aboutUsRoute = require("./routes/aboutUs");
const galleryRoute = require("./routes/gallery");
const menuRoute = require("./routes/menu");
const memberRoute = require("./routes/member");
const orderRoute = require("./routes/order");

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
app.get("/gallerys", galleryRoute);
app.post("/gallerys", galleryRoute);
app.put("/gallerys/:id", galleryRoute);
app.delete("/gallerys/:id", galleryRoute);

//menu route
app.get("/menus", menuRoute);
app.get("/menus/:name", menuRoute);
app.get("/menus/recommend", menuRoute);
app.post("/menus", menuRoute);
app.put("/menus/:id", menuRoute);
app.delete("/menus/:id", menuRoute);

//member route
app.get("/management/members", memberRoute);
app.get("/members/:id", memberRoute);
app.post("/register", memberRoute);
app.post("/login", memberRoute);
app.get("/members/:id/membership", memberRoute);

//address
app.get("/members/:id/addresses", memberRoute);
app.get("/members/:id/addresses/:id_address", memberRoute);
app.put("/members/:id/addresses/:id_address", memberRoute);
app.delete("/members/:id/addresses/:id_address", memberRoute);
app.post("/members/:id/addresses", memberRoute);

app.get("/members/:id/coupons", memberRoute);

//order route
app.get("/orders", orderRoute);
app.get("/orders/:firstname", orderRoute);
app.post("/order", orderRoute);


//listen on port 5001
app.listen(process.env.API_PORT, () => {
  console.log("Server has started on PORT 5001");
});
