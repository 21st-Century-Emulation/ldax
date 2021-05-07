import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import got from 'got';
import { Response } from 'express';
import CacheableLookup from 'cacheable-lookup';
const { READ_MEMORY_API } = process.env;

const cacheable = new CacheableLookup();

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
  interruptsEnabled: boolean;
}

class Cpu {
  opcode: number;
  id: String;
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

      const response = await got(`${READ_MEMORY_API}?id=${cpu.id}&address=${address}`, { dnsCache: cacheable });
      cpu.state.a = parseInt(response.body, 10);
      cpu.state.cycles += 7;

      res.status(HttpStatus.OK).send(cpu);
    }
  }
}
