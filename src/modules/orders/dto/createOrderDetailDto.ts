import { IsUUID, IsDecimal, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';
import { Order } from '../entities/order.entity';

export class CreateOrderDetailDto {

  @ApiProperty({
    description: 'The price of the order detail',
    example: 19.99,
  })
  @IsDecimal()
  price: number;

  @ApiPropertyOptional({
    description: 'The order associated with the order detail',
    example: {
      id: 'order-id-1',
      customerName: 'John Doe',
      totalAmount: 59.97,
      status: 'pending',
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => Order)
  order?: Order;

  @ApiProperty({
    description: 'The list of products in the order detail',
    example: [
      {
        id: 'product-id-1',
        name: 'Product 1',
        price: 9.99,
        stock: 50,
        image: 'http://example.com/product1.jpg',
      },
      {
        id: 'product-id-2',
        name: 'Product 2',
        price: 19.99,
        stock: 30,
        image: 'http://example.com/product2.jpg',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Product)
  products: Product[];
}