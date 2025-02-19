import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Product Name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 29.99,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'The stock quantity of the product',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @ApiPropertyOptional({
    description: 'The image URL of the product',
    example: 'http://example.com/product.jpg',
  })
  @IsString()
  @IsOptional()
  image?: string;
}