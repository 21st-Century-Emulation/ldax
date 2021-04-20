import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';

const { READ_MEMORY_API } = process.env;

class CpuFlags {
  sign: boolean;
  zero: boolean;
  auxCarry: boolean;
  parity: boolean;
  carry: boolean;
}

class CpuState {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  h: number;
  l: number;
  stackPointer: number;
  programCounter: number;
  cycles: number;
  flags: CpuFlags;
}

class Cpu {
  opcode: number;
  state: CpuState;
}

@Controller()
export class ExecuteController {
  @Get('/api/v1/debug/readMemory')
  readMemoryDebug(@Query('address') address: number): number {
    return address & 0xff;
  }

  @Post('/api/v1/execute')
  async execute(@Body() cpu: Cpu, @Res() res: Response): Promise<void> {
    if (!cpu) {
      res.status(HttpStatus.BAD_REQUEST).send();
    }

    if (cpu.opcode != 0x0a && cpu.opcode != 0x1a) {
      res.status(HttpStatus.BAD_REQUEST).send();
    } else {
      let address: number;
      switch (cpu.opcode) {
        case 0x0a:
          address = (cpu.state.b << 8) | cpu.state.c;
          break;
        case 0x1a:
          address = (cpu.state.d << 8) | cpu.state.e;
          break;
      }

      const response = await axios.get(`${READ_MEMORY_API}?address=${address}`);
      cpu.state.a = response.data;
      cpu.state.cycles += 7;

      res.status(HttpStatus.OK).send(cpu);
    }
  }
}
