import { ResponseUserDto } from "./response-user.dto";

export class ResponseValidateTokenDto {
  valid: boolean;
  user: ResponseUserDto;

  constructor(valid: boolean, user: ResponseUserDto) {
    this.valid = valid;
    this.user = user;
  }
}
