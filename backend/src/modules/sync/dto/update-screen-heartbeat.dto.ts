import { IsString, IsUrl } from 'class-validator';

export class UpdateScreenHeartbeatDto {
    @IsString()
    @IsUrl({
        require_protocol: true,
        require_tld: false,
    })
    playerUrl: string;
}