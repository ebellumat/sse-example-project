export class CarRoute {
  private centerLatitude: number;
  private centerLongitude: number;
  private radius: number;
  private angle: number;
  private latitude: number;
  private longitude: number;

  constructor() {
    this.centerLatitude = -20.3518; // Vila Velha latitude
    this.centerLongitude = -40.308; // Vila Velha longitude
    this.radius = 0.01; // Adjust the radius as needed
    this.angle = 0;
    this.latitude = 0;
    this.longitude = 0;
  }

  public updateRoute(): void {
    // Update route logic (car doing circles)
    const radians = (this.angle * Math.PI) / 180;
    this.latitude = this.centerLatitude + this.radius * Math.sin(radians);
    this.longitude = this.centerLongitude + this.radius * Math.cos(radians);
    this.angle += 5; // Increase the angle for the next iteration
  }

  public getCoordinates(): { latitude: number; longitude: number } {
    return { latitude: this.latitude, longitude: this.longitude };
  }
}
