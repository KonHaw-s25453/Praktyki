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
} from '@nestjs/common';
import { SyncService } from './sync.service.js';
import { GetManifestQueryDto } from './dto/get-manifest-query.dto.js';
import { UpdateScreenStateDto } from './dto/update-screen-state.dto.js';
import { RecordLogDto } from './dto/record-log.dto.js';

@Controller('sync')
export class SyncController {
  constructor(private syncService: SyncService) {}

  /**
   * Ekran pobiera manifest
   * GET /sync/manifest?sinceRevision=123
   */
  @Get('manifest')
  async getManifest(
    @Query() query: GetManifestQueryDto,
    @Request() req: any,
  ): Promise<any> {
    // screenId będzie identyfikowany z nagłówka X-Screen-ID lub API key
    const screenId = req.headers['x-screen-id'];
    
    if (!screenId) {
      throw new Error('Missing X-Screen-ID header');
    }

    return this.syncService.getManifestForScreen(parseInt(screenId), query.sinceRevision);
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
  async heartbeat(@Param('screenId', ParseIntPipe) screenId: number): Promise<void> {
    return this.syncService.updateScreenState(screenId, null, 0);
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
