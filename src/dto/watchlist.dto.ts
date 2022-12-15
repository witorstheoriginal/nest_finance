export class CreateWatchlistDto {
  readonly name: string;
  readonly description: string;
  readonly ownerId: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly symbols: Symbol[];
}
