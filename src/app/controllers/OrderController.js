import * as Yup from 'yup'
import Order from '../schemas/Order';
import Product from '../models/Product';
import Category from '../models/Category';
import User from '../models/User';

class OrderController {
    async store(request, response) {
        const schema = Yup.object({
            products: Yup.array().required().of(
                Yup.object({
                    id: Yup.number().required(),
                    quantity: Yup.number().required()
                }),
            ),
        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ message: err.errors })
        }

        const { products } = request.body;

        //filtra os ids dos produtos
        const productIds = products.map((product) => product.id);

        //busca os produtos pelo id dos produtos
        const findProducts = await Product.findAll({
            where: {
                id: productIds,
            },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['name'],
                },
            ],
        });

        const formattedProducts = findProducts.map((product) => {
            //busca o id do produto que vem da request, compara o id do banco, busca quantidade
            const productIndex = products.findIndex((item) => item.id === product.id);

            if (productIndex === -1) {
                console.error(`Produto com ID ${product.id} não encontrado`);
                return response.status(404).json({ error: `Produto com ID ${product.id} não encontrado` });
            }

            const newProduct = {
                id: product.id,
                name: product.name,
                category: product.category ? product.category.name : 'Sem categoria', //tratamento
                price: product.price,
                url: product.url,
                quantity: products[productIndex]?.quantity || 0,
            };

            return newProduct;
        });

        const order = {
            user: {
                id: request.userId,
                name: request.userName,
            },
            products: formattedProducts,
            status: 'Pedido realizado 😁'
        };

        const createdOrder = await Order.create(order);

        return response.status(201).json(createdOrder);
    }

    async index(request, response) {
        const orders = await Order.find();

        return response.json(orders);
    }

    async update(request, response) {
        const schema = Yup.object({
            status: Yup.string().required()
        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ message: err.errors })
        }

        const { admin: isAdmin } = await User.findByPk(request.userId);
        if (!isAdmin) {
            return response.status(401).json();
        }

        const { id } = request.params;
        const { status } = request.body;

        try {
            await Order.updateOne({ _id: id }, { status });
        } catch (err) {
            return response.status(400).json({ message: err.message })
        }

        return response.json({ message: 'Status alterado com sucesso 😎' })
    }
}

export default new OrderController();