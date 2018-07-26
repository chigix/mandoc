import * as fs from 'fs';
import * as path from 'path';
import * as through from 'through2';

test('Through a File Reading Stream', done => {
  const test_file = path.join(__dirname, './fixtures/ipsum.md');
  const sep_chunk_size = 50;
  let remain_length = fs.readFileSync(test_file).length;
  fs.createReadStream(path.join(__dirname, './fixtures/ipsum.md'))
    .pipe(through())
    .pipe(through(function (chunk: Buffer, enc, callback) {
      let current_index = 0;
      const total_length = chunk.length;
      expect(chunk.length).toBe(remain_length);
      expect(enc).toBe('buffer');
      while (true) {
        if (current_index + sep_chunk_size >= total_length) {
          this.push(chunk.slice(current_index, total_length));
          callback();

          return;
        }
        this.push(chunk.slice(current_index, current_index + sep_chunk_size));
        current_index += sep_chunk_size;
      }
    })).pipe(through(function (chunk: Buffer, encoding, callback) {
      remain_length -= chunk.length;
      callback();
    }, function () {
      expect(remain_length).toBe(0);
      done();
    }));
});
