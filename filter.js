
const fs = require('fs');
const file = 'src/main.ts';
let code = fs.readFileSync(file, 'utf8');

const filter = \
import { Catch, ArgumentsHost, HttpServer } from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import * as fs from 'fs';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    fs.appendFileSync('error_log.txt', JSON.stringify({
      message: exception.message,
      stack: exception.stack,
      response: exception.response
    }, null, 2) + '\\\\n');
    super.catch(exception, host);
  }
}
\;

if (!code.includes('AllExceptionsFilter')) {
  code = filter + code.replace(
    'await app.listen(3000);',
    'const adapterHost = app.get(HttpAdapterHost); app.useGlobalFilters(new AllExceptionsFilter(adapterHost.httpAdapter)); await app.listen(3000);'
  );
  fs.writeFileSync(file, code);
}

