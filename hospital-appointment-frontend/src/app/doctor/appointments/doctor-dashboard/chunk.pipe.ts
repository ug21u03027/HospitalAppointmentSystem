import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'chunk', standalone: true })
export class ChunkPipe implements PipeTransform {
  transform<T>(array: T[], size: number): T[][] {
    if (!Array.isArray(array) || size < 1) return [];
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }
}