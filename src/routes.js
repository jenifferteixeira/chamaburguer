import { Router } from 'express'
import { v4 } from 'uuid'

import User from './app/models/User'

const routes = new Router();

routes.get('/', async (request, response) => {
    const user = await User.create({
        id: v4(),
        name: 'Jeni',
        email: 'jeni@gmail.com',
        password_hash: '1234',
    });
    return response.status(201).json(user);
});

export default routes;