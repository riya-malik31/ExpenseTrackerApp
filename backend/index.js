const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const app = express();
app.use(express.json())
app.use(cors());
// const uri = "mongodb://0.0.0.0:27017";
const uri= "mongodb+srv://riyacws123:t5ykuujYGJWmgU5g@cluster0.nsec2.mongodb.net/Users?retryWrites=true&w=majority";
const port = process.env.PORT || 5000
app.use(bodyParser.json());
let client;

async function connectToMongo() {
  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB !');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
connectToMongo();
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const database = client.db('ExpenseTracker');
    const usersCollection = database.collection('Users');

    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await usersCollection.insertOne({
      username,
      password: hashedPassword
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const database = client.db('ExpenseTracker');
    const usersCollection = database.collection('Users');
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found, kindly register first" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.status(200).json({
      message: "Login successful", userId: user._id.toString()
      , username: user.username
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.post('/add-expense', async (req, res) => {
  try {
    const { userId, title, amount, date } = req.body;

    if (!title || !amount || !date || !userId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const database = client.db('ExpenseTracker');
    const expensesCollection = database.collection('Expenses');
    const newExpense = {
      userId: new ObjectId(userId),
      title,
      amount: parseFloat(amount),
      date
    };

    await expensesCollection.insertOne(newExpense);

    res.status(201).json({ message: "Expense added successfully" });
  } catch (error) {
    console.error("Add Expense Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get('/get-expenses/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const database = client.db('ExpenseTracker');
    const expensesCollection = database.collection('Expenses');

    const expenses = await expensesCollection.find({ userId: new ObjectId(userId) }).toArray();
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    res.status(200).json({ expenses, totalExpense });
  } catch (error) {
    console.error("Get Expenses Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete('/delete-expense/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const database = client.db('ExpenseTracker');
    const expensesCollection = database.collection('Expenses');

    const result = await expensesCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Expense deleted successfully" });
    } else {
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.post('/add-income', async (req, res) => {
  try {
    const { userId, title, amount, date } = req.body;

    if (!userId || !title || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const database = client.db('ExpenseTracker');
    const incomeCollection = database.collection('Income');
    const newIncome = {
      userId: new ObjectId(userId),
      title,
      amount: parseFloat(amount),
      date
    };


    await incomeCollection.insertOne(newIncome);

    res.status(201).json({ message: "Income added successfully" });
  } catch (error) {
    console.error("Add Income Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.get('/get-income/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const database = client.db('ExpenseTracker');
    const incomeCollection = database.collection('Income');

    const incomes = await incomeCollection.find({ userId: new ObjectId(userId) }).toArray();
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

    res.status(200).json({ incomes, totalIncome });
  } catch (error) {
    console.error("Get Income Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete('/delete-income/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const database = client.db('ExpenseTracker');
    const incomeCollection = database.collection('Income');

    const result = await incomeCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Income deleted successfully" });
    } else {
      res.status(404).json({ message: "Income not found" });
    }
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);

});

