import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('business_settings')
export class BusinessSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string;

  @Column({ type: 'text', nullable: true })
  value: string;
}
