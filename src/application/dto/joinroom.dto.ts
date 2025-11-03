import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinRoomDto {
  @ApiProperty({
    description: '6-character uppercase alphanumeric room code',
    example: 'ABC123',
    pattern: '^[A-Z0-9]{6}$',
    minLength: 6,
    maxLength: 6,
    type: 'string'
  })
  @IsString()
  @Matches(/^[A-Z0-9]{6}$/, { message: 'Room code must be 6 uppercase alphanumeric characters' })
  code: string;
}