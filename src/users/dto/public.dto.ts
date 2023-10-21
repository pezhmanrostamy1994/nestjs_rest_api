import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { i18nValidationMessage, I18n, I18nContext } from 'nestjs-i18n';

// export class ExtraUserDto {
//   @IsBoolean({ message: 'validation.INVALID_BOOLEAN' })
//   subscribeToEmail: string;

//   @Min(5, {
//     message: i18nValidationMessage('validation.MIN', { message: 'COOL' }),
//   })
//   min: number;

//   @Max(10, {
//     message: i18nValidationMessage('validation.MAX', { message: 'SUPER' }),
//   })
//   max: number;
// }

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  mobile: string;

  @IsNotEmpty()
  password: string;

  // @ValidateNested()
  // @IsDefined()
  // @Type(() => ExtraUserDto)
  // extra: ExtraUserDto;
}

export class Paginate {
  limit?: string | number;
  page?: string | number;
  skip?: string | number;
}

export class SearchAllUsers extends Paginate {
  name?: string;
}
