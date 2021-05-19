import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidRunException extends HttpException {
  constructor() {
    super('Invalid Run', HttpStatus.BAD_REQUEST);
  }
}
