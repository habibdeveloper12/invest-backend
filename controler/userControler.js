const User = require("../modal/userModal");
const bcrypt = require("bcrypt");
const sendToken = require("../utilities/sendToken");

exports.registerUser = async (req, res, next) => {
  const { fullName, email, password, userId } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(202)
        .send({ success: false, message: "User already exists" });
    }

    // Password hashing
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    console.log("Generated Salt:", salt);

    const hashedPassword = await bcrypt.hash(`${password}`, salt);

    console.log("Hashed Password:", hashedPassword);

    // Create a new user in MongoDB
    const addedUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      userId: userId,
    });

    sendToken(addedUser, 200, res);
  } catch (e) {
    console.log(e);
  }
};
exports.getSingleUser = async (req, res, next) => {
  console.log("Received data from the client req. body:", req.body);
  try {
    const userEmail = req.params.email;

    // Fetch the user from the database using the provided email
    const user = await User.findOne({ email: userEmail });
    console.log("dfdfdf");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
exports.addProfit = async (req, res, next) => {
  console.log("Received data from the client req. body:", req.body);
  try {
    const userEmail = req.params.email;

    // Fetch the user from the database using the provided email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
exports.investMoney = async (req, res, next) => {
  console.log("Received data from the client req. body:", req.body);
  try {
    const userEmail = req.params.email;

    // Fetch the user from the database using the provided email
    const user = await User.findOne({ email: userEmail });
    console.log("dfdfdf");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
exports.totalReturn = async (req, res, next) => {
  console.log("Received data from the client req. body:", req.body);
  try {
    const userEmail = req.params.email; // Assuming you're passing email in the query params
    const withdrawalAmount = parseFloat(req.query.amount); // Assuming you're passing withdrawal amount in the query params

    // Fetch the user from the database using the provided email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Deduct the withdrawal amount from the user's wallet
    if (user.wallet >= withdrawalAmount) {
      user.wallet -= withdrawalAmount;
      user.return += withdrawalAmount;
      await user.save(); // Save the updated user object
      return res.status(200).json({
        success: true,
        message: "Withdrawal successful",
        remainingBalance: user.wallet,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient funds" });
    }
  } catch (error) {
    console.error("Error handling withdrawal:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getUserByEmail = async (req, res, next) => {
  try {
    const email = req.query;
    console.log(email);
    const user = await User.findOne({ email: email });

    res.json(user);
    console.log(user);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
