const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const mailer = require('../nodemailer');

const generateAccessToken = (id, roles) => {
  const payload = { id, roles };
  return jwt.sign(payload, secret, { expiresIn: '24h' });
};

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Ошибка при регистрации', errors: errors.array() });
      }

      const { name, email, password } = req.body;
      const candidate = await User.findOne({ $or: [{ name }, { email }] });
      if (candidate) {
        return res.status(400).json({ error: 'Пользователь с таким именем или email уже существует' });
      }

      let userRole = await Role.findOne({ value: 'User' });
      if (!userRole) {
        userRole = new Role({ value: 'User' });
        await userRole.save();
      }

      const hashPassword = bcrypt.hashSync(password, 8);
      const user = new User({
        name,
        email,
        password: hashPassword,
        roles: [userRole.value]
      });

      if (req.file) {
        user.avatar = req.file.path;
      }

      await user.save();

      const message = {
        from: 'Mailer Test <wedzigew777@gmail.com>',
        to: email,
        subject: 'Подтверждение электронной почты',
        text: `Поздравляем, вы успешно зарегистрировались!\nЛогин: ${name}\nEmail: ${email}`
      };
      mailer(message);

      const token = generateAccessToken(user._id, user.roles);
      return res.status(200).json({ message: 'Регистрация прошла успешно', token });
    } catch (e) {
      console.error('Ошибка регистрации:', e.message, e.stack);
      res.status(500).json({ error: 'Ошибка сервера при регистрации' });
    }
  }

  async login(req, res) {
    try {
      const { name, password } = req.body;
      const user = await User.findOne({ name });
      if (!user) {
        return res.status(400).json({ error: 'Неверный логин или пароль' });
      }

      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Неверный логин или пароль' });
      }

      const token = generateAccessToken(user._id, user.roles);
      return res.status(200).json({ token });
    } catch (e) {
      console.error('Ошибка авторизации:', e.message);
      res.status(500).json({ error: 'Ошибка сервера при авторизации' });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find().select('-password');
      res.status(200).json({ users });
    } catch (e) {
      console.error('Ошибка getUsers:', e);
      res.status(500).json({ error: 'Ошибка при получении пользователей' });
    }
  }

  async profile(req, res) {
    try {
      const { id } = req.user;
      const user = await User.findById(id).select('-password');
      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }
      res.status(200).json(user);
    } catch (e) {
      console.error('Ошибка profile:', e);
      res.status(500).json({ error: 'Ошибка при получении профиля' });
    }
  }

  async updateProfile(req, res) {
    try {
      const { id } = req.user;
      const { name, email, phone } = req.body;

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }

      const existingUser = await User.findOne({
        $or: [
          { name: name, _id: { $ne: id } },
          { email: email, _id: { $ne: id } },
          { phone: phone, _id: { $ne: id } }
        ]
      });

      if (existingUser) {
        return res.status(400).json({
          error: existingUser.name === name
            ? 'Имя уже занято'
            : existingUser.email === email
              ? 'Email уже занят'
              : 'Телефон уже используется'
        });
      }

      const updateData = {};
      if (name && name !== user.name) updateData.name = name;
      if (email && email !== user.email) updateData.email = email;
      if (phone && phone !== user.phone) updateData.phone = phone;
      if (req.file) updateData.avatar = req.file.path;

      const updatedUser = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      res.status(200).json(updatedUser);
    } catch (e) {
      console.error('Ошибка обновления профиля:', e.message);
      if (e.message.includes('Недопустимый формат файла')) {
        return res.status(400).json({ error: e.message });
      }
      res.status(500).json({ error: 'Ошибка сервера при обновлении профиля' });
    }
  }

  async deleteProfile(req, res) {
    try {
      const { id } = req.user;
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }
      res.status(200).json({ message: 'Профиль успешно удалён' });
    } catch (e) {
      console.error('Ошибка удаления профиля:', e.message);
      res.status(500).json({ error: 'Ошибка сервера при удалении профиля' });
    }
  }
}

module.exports = new authController();