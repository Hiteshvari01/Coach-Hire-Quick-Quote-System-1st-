const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require('dotenv').config();
const twilio = require('twilio');


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

const nodemailer = require("nodemailer");

app.post("/sendQuoteRequest", async (req, res) => {
  try {
    const {
      tripId,
      fullName,
      phoneNumber,
      email,
      password,
      additionalInfo,
      confirmedDetails,
      agreedToPrivacyPolicy,
      tripType
    } = req.body;

    const confirmed = confirmedDetails === "on";
    const agreed = agreedToPrivacyPolicy === "on";

    // ✅ Save user details
    const userDetails = new UserDetails({
      tripId,
      fullName,
      phoneNumber,
      email,
      additionalInfo,
      password,
      confirmedDetails: confirmed,
      agreedToPrivacyPolicy: agreed,
    });
    await userDetails.save();

    // ✅ Fetch trip & timing
    const trip = await TripQuote.findById(tripId).lean();
    const timing = await tripTiming.findOne({ tripId }).lean();

    if (!trip || !timing) {
      return res.status(400).send("Trip data not found. Please check tripId.");
    }

    const pickup = trip.pickupLocation;
    const destination = trip.destinationLocation;
    const date = timing.departureDate;
    const time = timing.departureTime;
    const returnDate = timing.returnDate || "N/A";
    const returnTime = timing.returnTime || "N/A";

    // ✅ Fetch stops
    const goingStops = await Stop.find({ tripId, stopType: "going" }).lean();
    const returnStops = await Stop.find({ tripId, stopType: "return" }).lean();

    // ✅ Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,  // sender email
        pass: process.env.EMAIL_PASS,  // app password
      },
    });

    // ✅ User Email (Detailed + Pending)
    const userMailOptions = {
      from: `"Bus Hire Service" <${process.env.EMAIL_USER}>`,
      to: userDetails.email,
      subject: "Your Bus Hire Quote Request - Status Pending",
      html: `
        <h2>Hi ${userDetails.fullName},</h2>
        <p>Thank you for submitting your trip details. Your request is currently <b>Status: Pending</b>.</p>
        <h3>Trip Details:</h3>
        <p><b>Pickup:</b> ${pickup}</p>
        <p><b>Destination:</b> ${destination}</p>
        <p><b>Date & Time:</b> ${date} ${time}</p>
        <p><b>Return Date & Time:</b> ${returnDate} ${returnTime}</p>
        <h3>Stops:</h3>
        <ul>
          ${goingStops.map(stop => `<li>Going Stop: ${stop.location} (${stop.duration} mins)</li>`).join("")}
          ${returnStops.map(stop => `<li>Return Stop: ${stop.location} (${stop.duration} mins)</li>`).join("")}
        </ul>
        <p><b>Additional Info:</b> ${userDetails.additionalInfo || "N/A"}</p>
        <p>We will get back to you soon with a quote.</p>
        <br>
        <p>Regards,<br>Bus Hire Team</p>
      `
    };

    // ✅ Admin Email (Detailed)
    const adminMailOptions = {
      from: `"Bus Hire Service" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New Quote Request Received",
      html: `
        <h2>New Quote Request Received</h2>
        <h3>User Details:</h3>
        <p><b>Name:</b> ${userDetails.fullName}</p>
        <p><b>Phone:</b> ${userDetails.phoneNumber}</p>
        <p><b>Email:</b> ${userDetails.email}</p>
        
        <h3>Trip Details:</h3>
        <p><b>Pickup:</b> ${pickup}</p>
        <p><b>Destination:</b> ${destination}</p>
        <p><b>Date & Time:</b> ${date} ${time}</p>
        <p><b>Return Date & Time:</b> ${returnDate} ${returnTime}</p>
        
        <h3>Stops:</h3>
        <ul>
          ${goingStops.map(stop => `<li>Going Stop: ${stop.location} (${stop.duration} mins)</li>`).join("")}
          ${returnStops.map(stop => `<li>Return Stop: ${stop.location} (${stop.duration} mins)</li>`).join("")}
        </ul>
        
        <p><b>Additional Info:</b> ${userDetails.additionalInfo || "N/A"}</p>
        <br>
        <p>Regards,<br>Bus Hire System</p>
      `
    };

    // ✅ Send both emails
    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(adminMailOptions);
    console.log("Emails sent to user & admin.");

    // Render review page
    res.render("reviewpage", { tripType, trip, goingStops, returnStops, timing, user: userDetails });

  } catch (err) {
    console.error("Error in sendQuoteRequest route:", err);
    res.status(500).send("Something went wrong");
  }
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

