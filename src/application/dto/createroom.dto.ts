import { IsUUID, IsInt, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({
    description: 'The UUID of the quiz to use for this room',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID()
  quizId: string;

  @ApiPropertyOptional({
    description: 'Maximum number of players allowed in the room',
    minimum: 2,
    maximum: 50,
    default: 10,
    example: 8
  })
  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(50)
  maxPlayers?: number = 10;
}