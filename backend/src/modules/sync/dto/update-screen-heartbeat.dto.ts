import { IsString, IsUrl,IsBoolean } from 'class-validator';

export class UpdateScreenHeartbeatDto {

  @IsString()
  @IsUrl({
    require_protocol: true,
    require_tld: false,
  })
  playerUrl: string;

  @IsBoolean()
  visible: boolean;
}