const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require('dotenv').config();
const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const app = express();

// Middleware & View Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection 
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Models

const TripQuote = require("./models/TripQuote");
const Stop = require("./models/Stop");
const tripTiming = require("./models/tripTiming");
const UserDetails = require("./models/UserDetails");

// Routes
app.get("/", (req, res) => {
  res.render("1stPage");
});


app.post("/api/trip/start", async (req, res) => {
  
  try {
    const { tripType, pickupLocation, destinationLocation, numberOfPeople } = req.body;

    const newQuote = new TripQuote({
      tripType,
      pickupLocation,
      destinationLocation,
      numberOfPeople
    });

    await newQuote.save();

    res.render("2ndPage", {tripId: newQuote._id , tripType: tripType });
  } catch (err) {
    console.error("Error saving trip quote:", err);
    res.status(500).send("Something went wrong");
  }


});


app.post('/save-stops', async (req, res) => {
  const { tripId, location, duration, stopType, tripType } = req.body;

  if (!tripId) {
    return res.status(400).send("Missing tripId");
  }

  // Agar user ne koi extra stop hi add nahi kiya
  if (!location || location.length === 0) {
    return res.render("3rdPage", { tripId, tripType });
  }

  const locations = Array.isArray(location) ? location : [location];
  const durations = Array.isArray(duration) ? duration : [duration];
  const stopTypes = Array.isArray(stopType) ? stopType : [stopType];

  const stopsData = [];

  for (let i = 0; i < locations.length; i++) {
    // Sirf tab save karo jab user ne stop fill kiya ho
    if (locations[i] && durations[i]) {
      stopsData.push({
        tripId,
        location: locations[i],
        duration: parseInt(durations[i]) || 0,
        stopType: stopTypes[i] || 'going',
      });
    }
  }

  try {
    if (stopsData.length > 0) {
      await Stop.insertMany(stopsData); // ✅ sirf valid stops save honge
    }
    res.render("3rdPage", { tripId, tripType });
    console.log("Trip Type:", req.body.tripType);


  } catch (err) {
    console.error("Error inserting stops:", err);
    res.status(500).send(err.message);
  }
});



app.post("/save-trip-timing", async (req, res) => {
  try {
    const { tripId, departureDate, departureTime, returnDate, returnTime, tripType } = req.body;

    const timing = new tripTiming({
      tripId,
      departureDate,
      departureTime,
      returnDate,
      returnTime
    });

    await timing.save();

    res.render("4thPage", { tripId, tripType });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});


app.post("/submit-user-details", async (req, res) => {
  try {
    const {
      tripId,
      fullName,
      phoneNumber,
      email,
      additionalInfo,
      confirmedDetails,
      agreedToPrivacyPolicy,
    } = req.body;

    const confirmed = confirmedDetails === "on";
    const agreed = agreedToPrivacyPolicy === "on";

    const userDetails = new UserDetails({
      tripId,
      fullName,
      phoneNumber,
      email,
      additionalInfo,
      confirmedDetails: confirmed,
      agreedToPrivacyPolicy: agreed,
    });

    await userDetails.save();

    // WhatsApp message bhejna
    try {
      await client.messages.create({
body: 
`*Hello ${fullName}!* 👋

Your booking request has been received successfully. Here are your booking details:

*Trip ID:* \`${tripId}\`
*Status:* _Pending Confirmation_

Please reply with *CONFIRM* to finalize your booking.
https://sigh-up-with-coach-hire-quick-quote.onrender.com
Thank you for choosing us! 🙏
`,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:+91${phoneNumber}`
         // country code ke hisaab se adjust karo
      });
      
      console.log("WhatsApp confirmation message sent.");
    } catch(err) {
      console.error("Failed to send WhatsApp message:", err);
    }

    // Fetch related trip data
    const trip = await TripQuote.findById(tripId).lean();
    const goingStops = await Stop.find({ tripId, stopType: 'going' }).lean();
    const returnStops = await Stop.find({ tripId, stopType: 'return' }).lean();
    const timing = await tripTiming.findOne({ tripId }).lean();
    const user = await UserDetails.findOne({ tripId }).lean();
    const {tripType } = req.body;
    // Pass all data to the reviewPage template
    res.render("reviewpage", {  tripType, trip, goingStops, returnStops, timing, user });
    

  } catch (err) {
    console.error("Error saving user details or fetching data:", err);
    res.status(500).send("Something went wrong");
  }
});



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

