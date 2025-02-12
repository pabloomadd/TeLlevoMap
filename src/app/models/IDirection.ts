export interface RouteGeometry {
  coordinates: [number, number][];
  type: string;
}

export interface Route {
  geometry: RouteGeometry;
  distance: number;
  duration: number;
}

export interface MapboxDirectionsResponse {
  routes: Route[];
}
