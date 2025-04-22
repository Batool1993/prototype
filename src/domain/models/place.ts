export class Place {
  public readonly id?: number;
  public readonly name: string;
  public readonly description?: string;
  public readonly category?: string;
  public readonly latitude: number;
  public readonly longitude: number;
  public readonly createdAt?: Date;

  constructor(props: {
    id?: number;
    name: string;
    description?: string;
    category?: string;
    latitude: number;
    longitude: number;
    createdAt?: Date;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.category = props.category;
    this.latitude = props.latitude;
    this.longitude = props.longitude;
    this.createdAt = props.createdAt;
  }
}
