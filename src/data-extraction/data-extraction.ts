import { Injectable } from '@nestjs/common';
import type { OnModuleInit } from '@nestjs/common';

@Injectable()
export class DataExtraction implements OnModuleInit {
  onModuleInit() {
    console.log('TODO: Init DataExtraction. Note to myself that onModuleInit can be async)');
  }
}
