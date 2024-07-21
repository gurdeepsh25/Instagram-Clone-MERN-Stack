const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const { mongoose, User } = require("./dbConnect");

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '')}`);
  },
});

const upload = multer({ storage });


// Signup endpoint
app.post("/signup", async (req, res) => {
  try {
    const { emailOrMobile, fullName, username, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }],
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    let email, mobile;

    if (emailOrMobile.includes("@")) {
      email = emailOrMobile;
    } else {
      mobile = emailOrMobile;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      mobile,
      fullName,
      username,
      hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [
        { email: identifier },
        { mobile: identifier },
        { username: identifier },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.status(200).json({
      userId: user._id,
      email: user.email,
      mobile: user.mobile,
      fullName: user.fullName,
      username: user.username,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a logout endpoint
app.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logout successful" });
});

// Profile image upload endpoint
app.patch(
  "/uploadProfileImage/:Username",
  upload.single("profileImage"),
  async function (req, res) {
    try {
      const profileImage = req.file.path;
      const Username = req.params.Username; // Fix the parameter name
      let updatedUser = await User.findOneAndUpdate(
        { username: Username },
        { $set: { profileImage: profileImage } },
        { new: true }
      );

      console.log(req.file);
      // Check if the user was found and updated
      if (updatedUser) {
        const imagePath = `${req.protocol}://${req.get(
          "host"
        )}/${updatedUser.profileImage.replace(/\\/g, "/")}`;
        res.status(200).json({ profileImage: imagePath });
      } else {
        res.status(404).send("User not found");
      }

      // Handle further logic here
    } catch (error) {
      console.error("Error uploading profile image:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);


// Profile image fetch endpoint
app.get(
  "/profileImage/:Username",

  async function (req, res) {
    try {
      const Username = req.params.Username;
     
      let updatedUser = await User.findOne({ username: Username });

      if (updatedUser) {
        res.status(200).json({ profileImage: updatedUser.profileImage });
      } else {
        res.status(404).send("User not found");
      }

      // Handle further logic here
    } catch (error) {
      console.error("Error uploading profile image:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Profile image remove endpoint
app.patch("/removeProfileImage/:Username", async function (req, res) {
  try {
    const Username = req.params.Username;

    let updatedUser = await User.findOneAndUpdate(
      { username: Username },
      { $set: { profileImage: "" } },
      { new: true }
    );

    if (updatedUser) {
      res.status(200).json({ message: "Profile image updated successfully" });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch images, videos, username, descriptions and posts images endpoint
app.get("/api/fetchMedia", async (req, res) => {
  try {
    const timestamp = new Date().getTime();

    const nasaApiResponse = await axios.get(
      `https://api.nasa.gov/planetary/apod?api_key=FRb35iBBdsANCLHcdmum8O9gwBfknhI9umOGykIX&count=5`
    );

    const nasaMedia = [];
    const videoResponse = await axios.get(
      `https://api.pexels.com/videos/search?query=nature&per_page=5&timestamp=${timestamp}`,
      {
        headers: {
          Authorization:
            "ThwUyopRxIDB5He47HdnsWkw8GDHrQQ9NMgMBxq4jALFUaZSI1xv91Xa",
        },
      }
    );

    for (
      let index = 0;
      index <
      Math.max(nasaApiResponse.data.length, videoResponse.data.videos.length);
      index++
    ) {
      if (index < nasaApiResponse.data.length) {
        const nasaItem = nasaApiResponse.data[index];
        nasaMedia.push({
          type: "image",
          url: nasaItem.url,
          username: nasaItem.title,
          description: nasaItem.explanation,
        });
      }

      if (index < videoResponse.data.videos.length) {
        const video = videoResponse.data.videos[index];
        nasaMedia.push({
          type: "video",
          url: video.video_files[0].link,
          username: "Pexels Video",
          description: "",
        });
      }
    }

    console.log("NASA Media:", nasaMedia);

    res.json(nasaMedia);
  } catch (error) {
    console.error("Error fetching media from Pexels and NASA:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
