export class ResponseUserDto {
  id: string;
  email: string;
  username: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    id: string,
    email: string,
    username: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class ResponseUserListDto {
  count: number;
  users: ResponseUserDto[];

  constructor(count: number, users: ResponseUserDto[]) {
    this.count = count;
    this.users = users;
  }
}

export class ResponseUserProfileDto {
  emails: string[];

  constructor(emails: string[]) {
    this.emails = emails;
  }
}
