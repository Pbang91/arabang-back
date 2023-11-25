import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  /**
   * 해쉬된 비밀번호를 반환하는 함수 입니다.
   *
   * @param {string}password - 사용자가 입력한 PW 입니다.
   * @returns Hashed Password
   */
  async createHashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    return await bcrypt.hash(password, salt);
  }

  /**
   * 사용자가 입력한 PW와 기존에 저장된 PW를 비교하는 함수입니다.
   * @param {string}password - 사용자가 입력한 PW
   * @param {string}dbPassword - DB PW
   * @returns true or false
   */
  async validatePassword(password: string, dbPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, dbPassword);
  }
}
