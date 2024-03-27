import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ProfileService } from './profile.service';
import { EditProfileDto } from './dto';

@UseGuards(AuthGuard('jwt'))
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Put('edit')
  public editProfile(@Body() body: EditProfileDto) {
    return this.profileService.editProfile(body);
  }
}
