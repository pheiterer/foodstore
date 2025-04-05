import express from 'express';
import cors from 'cors';
import { sample_foods, sample_users } from './data';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/foods', (req, res) => {
  res.json(sample_foods);
})

app.get('/api/foods/search/:searchTerm', (req, res) => {
  const searchTerm = req.params.searchTerm.toLowerCase();
  const filteredFoods = sample_foods.filter(food => food.name.toLowerCase().includes(searchTerm));
  res.json(filteredFoods);
})

app.get('/api/foods/tags', (req, res) => {
  const tagCount: { [key: string]: number } = {};
  
  sample_foods.forEach(food => {
    food.tags?.forEach((tag: string) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  const tags: any[] = Object.keys(tagCount).map(tag => ({
    name: tag,
    count: tagCount[tag]
  }));

  res.json([{ name: 'All', count: sample_foods.length }, ...tags]);
});

app.get('/api/foods/tag/:tagName', (req, res) => {
  const tagName = req.params.tagName;
  const filteredFoods = tagName === 'All' ? sample_foods : sample_foods.filter(food => food.tags?.includes(tagName));
  res.json(filteredFoods);
})

app.get('/api/foods/:id', (req, res) => {
  const foodId = req.params.id;
  const food = sample_foods.find(food => food.id === foodId);
  if (food) {
    res.json(food);
  }
  else {
    res.status(404).json({ message: 'Food not found' });
  }
})

app.post('/api/users/login', (req, res) => {
  if (req.body === null || req.body === undefined) {
    res.status(400).json({ Alert: 'Invalid request' });
  }
  const { email, password } = req.body;
  const user = sample_users.find(user => user.email === email && user.password === password);
  if (user) {
    res.send(generateTokenResponse(user));
  } else {
    res.status(401).json({ Alert: 'Invalid email or password' });
  }
})

const generateTokenResponse = (user: any) => {
  const token = jwt.sign({
    email: user.email, isAdmin: user.isAdmin
  }, "something", {
    expiresIn: '30d'
  })

  user.token = token;
  return user;
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

