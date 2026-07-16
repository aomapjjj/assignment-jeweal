import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9+\-\s]{9,15}$/, {
    message: 'Invalid Phone Number',
  })
  phoneNumber: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
