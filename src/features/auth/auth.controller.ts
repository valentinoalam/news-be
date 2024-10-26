import { AtGuard, RtGuard } from '@common/guards';
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Get,
  Res,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';

// import { AuthService } from './auth.service';
import { SigninDto } from './dto';
import { AuthService } from './services/auth.service';

@ApiTags('Auth')
@ApiBearerAuth('access-token')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('iam')
  async getIAM(@Req() req: Request) {
    const dataOut = {
      status: true,
      message: '',
      data: {
        user: null,
      },
      logs: {},
    };

    try {
      const user = await this.authService.getIAM(req.user['id']);

      // const { name, profilePic, position, phone, address } = user.profile;
      const { username, email } = user;
      dataOut.data.user = {
        username,
        email,
        // name,
        // profilePic,
        // position,
        // phone,
        // address,
      };
    } catch (error) {
      dataOut.status = false;
      dataOut.message = error.message;
      dataOut.logs = {
        ...dataOut.logs,
        error,
      };
    }

    return dataOut;
  }

  @Post('signin')
  @ApiOperation({
    summary: 'User login API',
  })
  @ApiOkResponse({ description: 'User has been successfully logged in' })
  @ApiBadRequestResponse({
    description: 'Some character error or type error',
  })
  @ApiForbiddenResponse({
    description: 'Email or password incorrect',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: SigninDto) {
    const dataOut = {
      status: true,
      message: '',
      data: {
        tokens: null,
        user: null,
      },
      logs: {},
    };

    try {
      const { tokens, user } = await this.authService.signin(dto);
      const { id, username, email } = user;
      dataOut.data.tokens = tokens;
      dataOut.data.user = user;
      dataOut.data.user = {
        id,
        username,
        email,
      };
      dataOut.message = 'Signed in successfully.';
    } catch (error) {
      dataOut.status = false;
      dataOut.message = error.message;
      dataOut.logs = {
        ...dataOut.logs,
        error,
      };
    }

    return dataOut;
  }

  @Post('signout')
  @ApiOperation({
    summary: 'Logout with a user',
  })
  @ApiOkResponse({
    description: 'User has been successfully logout',
  })
  @HttpCode(HttpStatus.OK)
  async signout(
    @Req() req: Request,
    @Res({
      passthrough: true,
    })
    res: Response,
  ) {
    const dataOut = {
      status: true,
      message: '',
      data: {},
      logs: {},
    };

    try {
      const isSuccess = await this.authService.signout(req.user['id'], res);

      if (isSuccess) {
        dataOut.message = 'Signed out successfully.';
      } else {
        dataOut.status = false;
        dataOut.message = 'Already signed out.';
      }
    } catch (error) {
      dataOut.status = false;
      dataOut.message = error.message;
      dataOut.logs = {
        ...dataOut.logs,
        error,
      };
    }

    return dataOut;
  }

  @Post('refresh')
  @UseGuards(RtGuard)
  @ApiOperation({
    summary: 'Refresh user token',
  })
  @ApiOkResponse({ description: 'Token has been successfully refresh' })
  @ApiForbiddenResponse({
    description: 'Access Denied',
  })
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: Request) {
    const dataOut = {
      status: true,
      message: '',
      data: {
        tokens: null,
      },
      logs: {},
    };

    try {
      const tokens = await this.authService.refreshToken(
        req.user['sub'],
        req.user['refreshToken'],
      );

      dataOut.data.tokens = tokens;
      dataOut.message = 'Token refreshed successfully.';
    } catch (error) {
      dataOut.status = false;
      dataOut.message = error.message;
      dataOut.logs = {
        ...dataOut.logs,
        error,
      };
    }

    return dataOut;
  }
}
