import { ConflictException, Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma.service';
import { BaseUserDto, LoginUserDto } from './dto/users.dto';
import { User } from '@prisma/client';
import { AuthService } from 'src/common/auth/auth.service';
import { TasksService } from 'src/tasks/tasks.service';
import { TASK_KIND, USER_ROLE } from 'src/common/constants/constant';
import { customLogger } from 'src/config/api/logger.config';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private authService: AuthService, private tasksService: TasksService) {}

  /**
   * 유저 정보를 획득합니다.
   *
   * @param {string?} email - 유저 정보를 획득하기 위한 매개변수
   * @param {number?} id - 유저 정보를 획득하기 위한 id - only Admin
   * @returns {User} user 객체를 전달하거나, null을 반환합니다.
   */
  async user(email?: string, id?: number): Promise<User | null> {
    if (email) {
      return await this.prisma.user.findUnique({ where: { email } });
    }

    if (id) {
      return await this.prisma.user.findUnique({ where: { id } });
    }
  }

  /**
   * email 가입을 진행하는 사용자를 위한 함수 입니다.
   *
   * @param baseUserDto - 회원가입을 위한 필요 매개변수
   */
  async createUser(baseUserDto: BaseUserDto): Promise<void> {
    const user: User = await this.user(baseUserDto.email);

    if (user) {
      throw new ConflictException('등록된 사용자가 존재합니다');
    }

    if (baseUserDto.isAdmin) {
      const message = `email=${baseUserDto.email}|password=${baseUserDto.password}`;

      await this.tasksService.registTask({ type: TASK_KIND.REGIST, message });
    } else {
      // TODO: 인증코드 관련 기능 추가 후 아래 로직 수행

      return;
    }
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    if (loginUserDto.type == 'email') {
      const user = await this.user(loginUserDto.email);

      if (user == null) throw new UnauthorizedException('잘못된 정보 입니다.');

      const isRight = await this.authService.validatePassword(loginUserDto.password, user.password);

      if (!isRight) throw new UnauthorizedException('잘못된 정보 입니다.');

      try {
        return {
          accessToken: await this.authService.createJwtToken(user.id, user.isAdmin ? USER_ROLE.ADMIN : USER_ROLE.USER),
        };
      } catch (e) {
        customLogger.error(e.message);
        throw new ServiceUnavailableException('확인하지 못한 에러가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } else {
      // TODO: 카카오 로그인 구현.
    }
  }

  /**
   * 테스트를 위한 슈퍼유저 생성 함수입니다. 1회성입니다.
   * @param {BaseUserDto}baseUserDto - 슈퍼 관리자 생성을 위한 매개변수.
   */
  async createSuperUser(baseUserDto: BaseUserDto): Promise<void> {
    const { email, password } = baseUserDto;
    const hashedPassword = await this.authService.createHashPassword(password);

    await this.prisma.user.create({
      data: { email, password: hashedPassword, nickName: 'super', isAdmin: true },
    });
  }
}
