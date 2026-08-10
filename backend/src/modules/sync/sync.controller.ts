import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { SyncService } from './sync.service';
import { GetManifestQueryDto } from './dto/get-manifest-query.dto';
import { UpdateScreenStateDto } from './dto/update-screen-state.dto';
import { RecordLogDto } from './dto/record-log.dto';
import { ApiHeader,ApiTags } from '@nestjs/swagger';
import { UpdateScreenHeartbeatDto } from './dto/update-screen-heartbeat.dto';


// import { ScreenAuthGuard } from './guards/screen-auth.guard'; // Przykładowy guard auth

@Controller('sync')
@ApiTags('Sync')
// @UseGuards(ScreenAuthGuard) // Odkomentuj, aby zabezpieczyć cały kontroler przed nieautoryzowanym dostępem
export class SyncController {
  constructor(private syncService: SyncService) {}
  @Get('manifest')
  @ApiHeader({
  name: 'X-Screen-ID',
  description: 'Screen identifier',
  required: true,
})
  async getManifest(
    @Query() query: GetManifestQueryDto,
    @Request() req: any,
  ): Promise<any> {
    console.log('MANIFEST REQUEST');
    console.log('SCREEN ID HEADER:', req.headers['x-screen-id']);
    console.log('QUERY:', query);
    // Bezpieczne wyciągnięcie nagłówka (nagłówek może być stringiem lub tablicą)
    const rawScreenId = req.headers['x-screen-id'];
    const screenIdStr = Array.isArray(rawScreenId) ? rawScreenId[0] : rawScreenId;
    
    if (!screenIdStr) {
      throw new BadRequestException('Missing X-Screen-ID header');
    }

    const screenId = parseInt(screenIdStr, 10);
    if (isNaN(screenId)) {
      throw new BadRequestException('Invalid X-Screen-ID header format');
    }

    return this.syncService.getManifestForScreen(screenId, query.sinceRevision);
  }

  /**
   * Ekran aktualizuje swój state
   * POST /sync/:screenId/state
   */
  @Post(':screenId/state')
  async updateScreenState(
    @Param('screenId', ParseIntPipe) screenId: number,
    @Body() updateStateDto: UpdateScreenStateDto,
  ): Promise<any> {
    return this.syncService.updateScreenState(
      screenId,
      updateStateDto.currentPlaylistId,
      updateStateDto.currentIndex,
    );
  }

  /**
   * Ekran wysyła log
   * POST /sync/:screenId/logs
   */
  @Post(':screenId/logs')
  async recordLog(
    @Param('screenId', ParseIntPipe) screenId: number,
    @Body() recordLogDto: RecordLogDto,
  ): Promise<void> {
    return this.syncService.recordLog(screenId, recordLogDto.message, recordLogDto.level);
  }

  /**
   * Ekran wysyła heartbeat
   * POST /sync/:screenId/heartbeat
   */
 @Post(':screenId/heartbeat')
async heartbeat(
  @Param('screenId', ParseIntPipe) screenId: number,
  @Body() heartbeatDto: UpdateScreenHeartbeatDto,
): Promise<void> {

  console.log('HEARTBEAT DTO:', heartbeatDto);

  await this.syncService.touchScreen(
    screenId,
    heartbeatDto.playerUrl,
  );
}

  /**
   * Sprawdź czy manifest się zmienił
   * GET /sync/:screenId/check?currentRevision=123
   */
  @Get(':screenId/check')
  async checkManifestChanged(
    @Param('screenId', ParseIntPipe) screenId: number,
    @Query('currentRevision', ParseIntPipe) currentRevision: number,
  ): Promise<any> {
    return this.syncService.checkIfManifestChanged(screenId, currentRevision);
  }

  /**
   * Pobierz fallback asset
   * GET /sync/:screenId/fallback
   */
  @Get(':screenId/fallback')
  async getFallback(@Param('screenId', ParseIntPipe) screenId: number): Promise<any> {
    return this.syncService.getFallbackAsset(screenId);
  }

  /**
   * Pobierz logi ekranu
   * GET /sync/:screenId/logs
   */
  @Get(':screenId/logs')  
  async getLogs(@Param('screenId', ParseIntPipe) screenId: number): Promise<any[]> {
    return this.syncService.getScreenLogs(screenId);
  }
}