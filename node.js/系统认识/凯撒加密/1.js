import { readFileSync } from 'node:fs';

// import { readFile } from 'node:fs/promises';
// const file = await readFile('../files/成绩ori.txt', 'utf-8');
// console.log(file);

const data = readFileSync('../files/成绩ori.txt', 'utf-8', () => {});
```    
export function readFile(
        path: PathOrFileDescriptor,
        options:
            | ({
                encoding?: null | undefined;
                flag?: string | undefined;
            } & Abortable)
            | undefined
            | null,
        callback: (err: NodeJS.ErrnoException | null, data: NonSharedBuffer) => void,
    ): void;
```;
console.log(data);  console.log();

