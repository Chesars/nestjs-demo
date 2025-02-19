import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { CreateOrderDetailDto } from './dto/createOrderDetailDto';
import { ProductsRepository } from '../products/products.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, In, MoreThan, Repository } from 'typeorm';
import { OrderDetail } from './entities/order-details.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { CreateOrderDto } from './dto/createOrderDto';


@Injectable()
export class OrdersRepository {
constructor(
  private readonly usersRepository: UsersRepository,
  private readonly productsRepository: ProductsRepository,
  @InjectRepository(Order) private readonly ordersRepository: Repository<Order>,
  @InjectRepository(OrderDetail) private readonly ordersDetailRepository: Repository<OrderDetail>,
  private dataSource: DataSource
) {}

  async getOrder(id: string) {
    return await this.ordersRepository.findOne({ where: { id } });
  }


  async addOrder(userId : string ,order: CreateOrderDetailDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      const user = await queryRunner.manager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }
      
      const productIds = order.products.map(product => product.id);
      const products = await queryRunner.manager.find(Product, {
        where: {
          id: In(productIds),
          stock: MoreThan(0),
        },
      });

      console.log('Productos encontrados', products  )

      if (products.length !== order.products.length) {
        throw new Error('Some products are not available or out of stock');
      }
   
      let totalPrice =  products.reduce((sum, product) => sum + parseFloat(product.price.toString()), 0);
      console.log('precio total', totalPrice)
      
      const newOrderDetail = new OrderDetail();
      newOrderDetail.price = totalPrice;
      newOrderDetail.products = products;

      
      await queryRunner.manager.save(newOrderDetail); 

      console.log('instancia de detalle de orden creada y guardada', newOrderDetail)
      
      const newOrder = new Order();
      newOrder.user = user;
      newOrder.date = new Date();
      newOrder.orderDetail = newOrderDetail;

      
      await queryRunner.manager.save(newOrder); 
      
      console.log('instancia de orden creada y guardada', newOrder)

      newOrderDetail.order = newOrder;      

      await queryRunner.manager.save(newOrderDetail); 

      console.log('El detalle de orden se actualizo...', newOrderDetail)



      console.log(newOrder.id, newOrderDetail.id)
  

      if (!user.orders) {
        user.orders = [];
      }
      
      user.orders.push(newOrder);

      await queryRunner.manager.save(User, user); 
 
      console.log('Se Guardo correctamente el usuario.', user)

      
      await queryRunner.commitTransaction();
  
      return   {
  
        orderId: newOrder.id,
        totalPrice,
        orderDetailId: newOrderDetail.id,
      }

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  
  /* addOrder(order: CreateOrderDto){
    const user = this.usersRepository.getUserById(order.userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const products = this.productsRepository.getProductsForOrder(order.products)

    this.orders.push(order);
    return this.orders.push(order)
  } 
  */

  /* async addOrder(order: CreateOrderDto) {
    const user = await this.usersRepository.getUserById(order.userId);
    if (!user) {
      throw new Error('User not found');
    }

  
    const products = await this.productsRepository.getProductsForOrder(order.products);
    if (products.length !== order.products.length) {
      throw new Error('Some products are not available or out of stock');
    }
  
    let totalPrice = products.reduce((sum, product) => sum + parseFloat(product.price.toString()), 0);
  
  
    const orderDetail = this.ordersDetailRepository.create({
      price: totalPrice, // Ensure price is in correct numeric format
      products,
    });
  
    const newOrder = this.ordersRepository.create({
      user,
      date: new Date(),
      orderDetail,
    });
  
    orderDetail.order = newOrder;
  
    console.log('Saving order detail:', orderDetail);
    await this.ordersDetailRepository.save(orderDetail);
  
    console.log('Saving new order:', newOrder);
    await this.ordersRepository.save(newOrder);
  
    return {
      orderId: newOrder.id,
      totalPrice,
      orderDetailId: orderDetail.id,
    };
  } */
  
}
