import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../../entities/customer.entity';
import { CreateCustomerDto, UpdateCustomerDto, CustomerResponseDto } from './dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  private toCustomerResponseDto(customer: Customer): CustomerResponseDto {
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.addresses && customer.addresses.length > 0 ? customer.addresses[0].toString() : '', // Convert first address to string or return empty string
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      userId: customer.userId, 
    };
  }

  async create(dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    const customer = this.customerRepo.create(dto);
    const savedCustomer = await this.customerRepo.save(customer);
    return this.toCustomerResponseDto(savedCustomer);
  }

  async findAll(): Promise<CustomerResponseDto[]> {
    const customers = await this.customerRepo.find({
      relations: ['user', 'addresses', 'cart'], 
    });
    return customers.map(customer => this.toCustomerResponseDto(customer));
  }

  async findOne(id: string): Promise<CustomerResponseDto> { 
    const customer = await this.customerRepo.findOne({ 
      where: { id: Number(id) }, 
      relations: ['user', 'addresses', 'cart'], 
    });
    if (!customer) throw new NotFoundException(`Customer with ID ${id} not found`);
    return this.toCustomerResponseDto(customer);
  }

  async findByEmail(email: string): Promise<CustomerResponseDto> {
    const customer = await this.customerRepo.findOne({ 
      where: { email },
      relations: ['user', 'addresses', 'cart'],
    });
    if (!customer) throw new NotFoundException(`Customer with email ${email} not found`);
    return this.toCustomerResponseDto(customer);
  }

  async findEntityByEmail(email: string): Promise<Customer | null> {
    return await this.customerRepo.findOne({ 
      where: { email },
      relations: ['user', 'addresses', 'cart'],
    });
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<CustomerResponseDto> { 
    const customer = await this.customerRepo.findOne({ where: { id: Number(id) } }); 
    if (!customer) throw new NotFoundException(`Customer with ID ${id} not found`);

    Object.assign(customer, dto);
    const updated = await this.customerRepo.save(customer);
    return this.toCustomerResponseDto(updated);
  }

  async remove(id: string): Promise<void> { 
    const result = await this.customerRepo.delete(Number(id)); 
    if (result.affected === 0) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
  }

  async getProfile(customerId: string): Promise<CustomerResponseDto> {
    return this.findOne(customerId);
  }

  async updateProfile(customerId: string, dto: UpdateCustomerDto): Promise<CustomerResponseDto> { 
    return this.update(customerId, dto);
  }

  async findByPhone(phone: string): Promise<CustomerResponseDto> {
    return this.findOne(phone); 
  }
}