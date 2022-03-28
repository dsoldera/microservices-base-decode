import express from 'express';
import cors from 'cors';
import { PrismaCustomersRepository } from '../database/prisma/repositories/prisma-customers-repository';
import { PrismaProductsRepository } from '../database/prisma/repositories/prisma-products-repository';
import { PrismaPurchasesRepository } from '../database/prisma/repositories/prisma-purchases-repository';
import { PurchaseProduct } from '../../application/usecases/purchase-product';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  return res.json({ ok: true })
})

app.post('/purchases', async (request, response) => {
  const { productId, name, email } = request.body;

  const prismaCustomersRepository = new PrismaCustomersRepository();
  const prismaProductsRepository = new PrismaProductsRepository();
  const prismaPurchasesRepository = new PrismaPurchasesRepository();

  const purchaseProductUseCase = new PurchaseProduct(
    prismaCustomersRepository, 
    prismaProductsRepository,
    prismaPurchasesRepository,
  )

  try {
    await purchaseProductUseCase.execute({
      name,
      email,
      productId,
    })

    return response.status(201).send();
  } catch (err) {
    return response.status(400).json({
      error: 'Error while creating a new purchase'
    })
  }
})

app.listen(3333, () => {
  console.log('[Purchases] Server running');
});