import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/config/database/prisma.service';
import { User } from '@prisma/client';
import { AuthService } from 'src/common/auth/auth.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let authService: AuthService;

  const createdUsers: User[] = [
    {
      id: 1,
      nickName: 'test',
      email: 'test-admin@arabang.com',
      password: 'hashedPw',
      isAdmin: true,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      socialId: null,
      socialRefreshToken: null,
    },
  ];

  beforeEach(async () => {
    createdUsers[0].password = await authService.createHashPassword(createdUsers[0].password);

    const mockDb = {
      user: {
        create: jest.fn().mockResolvedValue(createdUsers[0]),
        findUnique: jest.fn().mockResolvedValue(createdUsers[0]),
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthService,
        {
          provide: PrismaService,
          useValue: mockDb,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });
});
