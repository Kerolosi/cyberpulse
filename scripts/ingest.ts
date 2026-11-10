import 'dotenv/config';
import { runIngest } from '../lib/ingest';

runIngest()
  .then((r) => {
    console.table(r.map((x) => ({ source: x.source, fetched: x.fetched, inserted: x.inserted, errors: x.errors.length })));
    const errs = r.flatMap((x) => x.errors);
    if (errs.length) {
      console.error('Errors:', errs);
      process.exit(1);
    }
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
