import Router from 'express';
import { sample_users } from '../data';
import jwt from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';
import { UserModel } from '../models/user.model';
import { HTTP_CONFLICT, HTTP_UNAUTHORIZED } from '../constants/http_status';
import bycrpt from 'bcryptjs';

const router = Router();

router.get('/seed', expressAsyncHandler(
  async (_req, res) => {
    const usersCount = await UserModel.countDocuments();
    if (usersCount > 0) {
      res.send('Seed is already done!');
      return;
    }

    await UserModel.create(sample_users);
    res.send('Seed is done!');
}
))

router.post('/login', expressAsyncHandler(
  async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email, password });

    
    if (user) {
      res.send(generateTokenResponse(user));
    } else {
      res.status(HTTP_UNAUTHORIZED).json({ Alert: 'Invalid email or password' });
    }
  }
));

router.post('/register', expressAsyncHandler(
  async (req, res) => {    
    const { name, email, password, address } = req.body;

    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      res.status(HTTP_CONFLICT).json({ Alert: 'User already exists' });
      return;
    } else {
      const encryptedPassword = await bycrpt.hash(password, 10);
      const user = await UserModel.create({
        id:'',
        name,
        email: email.toLowerCase(),
        password: encryptedPassword,
        address,
        isAdmin: false,
      });

      res.send(generateTokenResponse(user));
    }
  }
));

const generateTokenResponse = (user: any) => {
  const token = jwt.sign({
    id: user.id, email: user.email, isAdmin: user.isAdmin
  }, process.env.JWT_SECRET! , {
    expiresIn: '30d'
  })

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    address: user.address,
    token
  };
}

export default router;