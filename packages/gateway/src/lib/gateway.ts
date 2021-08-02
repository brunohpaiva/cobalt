import { http } from '@cobalt/http';

export function gateway(): string {
  return 'gateway ' + http();
}
