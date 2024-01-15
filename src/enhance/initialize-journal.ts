import Journal from '@byaga/journal';
import {StructuredLog} from '@byaga/journal/lib/StructuredLog';

/**
 * Initialize journal
 */
Journal.configure({
    // For Lambdas logging structured logs should
    // - Bypass console.X because AWS prefixes the output all calls to those methods
    // - Remove newline characters because AWS CloudWatch Logs splits the log stream on newlines
    write: (data: StructuredLog) => process.stdout.write(JSON.stringify(data).replace(/\r/g, '\\r').replace(/\n/g, '\\n') + '\r\n')
});