import { Body, Controller, Param, Post } from '@nestjs/common';
import { SpinService } from './spin.service';

@Controller('spin')
export class SpinController {
  constructor(private readonly spinService: SpinService) {}

  @Post(':id')
  async findOne(
    @Param('id') id: string,
    @Body() body: { lines: number; freeSpin: boolean },
  ) {
    const result = await this.spinService.generateSlotResult();

    const arrangedResult = result[0].map((_, index) =>
      result.map((row) => row[index]),
    );

    const winLines = this.spinService.calculateWinLines(
      arrangedResult,
      body?.lines,
      body?.freeSpin,
    );

    return { result, winLines };
  }
}
