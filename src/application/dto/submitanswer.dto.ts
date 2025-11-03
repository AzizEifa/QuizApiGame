import { IsUUID, IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitAnswerDto {
  @ApiProperty({
    description: 'UUID of the question being answered',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID()
  questionId: string;

  @ApiProperty({
    description: 'The answer submitted by the player',
    example: 'Paris'
  })
  @IsString()
  answer: string;

  @ApiProperty({
    description: 'Time spent on the question in seconds',
    example: 15,
    minimum: 0
  })
  @IsInt()
  @Min(0)
  timeSpent: number;
}