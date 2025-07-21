import { reality_check, Vec2D } from "./util"

namespace Geometry {

    // A 2D point in 2D space.
    export type Coordinate = Vec2D;

    // A 2D point in 2D space. But on the corner of a shape.
    export type Vertex = Vec2D;

    // Kinds of geometry used in the layout.
    export enum Kind {
        // Explicitly no geometry
        NONE,
        // Marker
        MARKER,
        // Just a point
        POINT,
        // Generic rectangle
        RECTANGLE,
        // Custom layout with vertices
        CUSTOM,
        // Polygon
        POLYGON,
    }

    // Any kind of geometry.
    export type AnyKind = Kind.NONE | Kind.MARKER | Kind.POINT | Kind.RECTANGLE | Kind.CUSTOM | Kind.POLYGON;

    // Most primitive, basic object in the layout.
    // Can have a type, metadata, and MUST have a position.
    export interface Element {
        // Unique identifier for the element so functions can find it. Just use a random number if you don't really care. Otherwise give it a name!~
        id: string;
        position: Coordinate;
        meta?: any;
        kind: Kind;
    }

    /**
     * Tests if an object is a Geometry::Coordinate.
     * @param arr 
     */
    export function test_coordinate (arr: any): asserts arr is Coordinate {
        let emsg_start =  "Object is not a Coordinate: "
        if (!Array.isArray(arr)) {
            throw new Error(emsg_start + "Object must be an array.");
        }
        // Ensure only 2 numbers are specified
        if (arr.length !== 2) {
            throw new Error(emsg_start + "Coordinate must contain exactly 2 numbers.");
        }
        // Ensure sure both elements are numeric.
        if (typeof arr[0] !== "number" || typeof arr[1] !== "number") {
            throw new Error(emsg_start + `One or both of the items contained in the Coordinate is not a number [${arr[0]}, ${arr[1]}].`);
        }
    }

    // Tests if a given <thing> has properties to treat it as an element.
    export function test_element (dict: any) {
        let required_keys = ["id", "position", "kind"];
        let emsg_start = "Object is not a Geometry::Element: "
        for (let ki = 0; ki < required_keys.length; ki++) {
            let k = required_keys[ki];
            if (!(k in dict) || !reality_check(dict[k])) {
                throw new Error(emsg_start + "Missing required key: " + k);
            }
        }
        if (typeof dict.id !== "string") {
            throw new Error(emsg_start + "Property \"id\" is not a string.")
        }
        try {
            test_coordinate(dict.position)
        } catch (e) {
            throw new TypeError("Object is not a Geometry::Element" + "Property \"position\" is not a Geometry::Coordinate: " + e);
        }
    }

    // No geometry.
    export interface None extends Element {
        kind: Kind.NONE;
    }

    // Marker. No geometry.
    export interface Marker extends Element {
        kind: Kind.MARKER
    }

    // Generic rectangle.
    export interface Rectangle extends Element {
        kind: Kind.RECTANGLE;
        width: number;
        height: number;
    }

    // Custom layout with vertices.
    export interface Custom extends Element {
        kind: Kind.CUSTOM;
        vertices: Vertex[];
    }

    // Polygon with a center and radius.
    export interface Polygon extends Element {
        kind: Kind.POLYGON;
        sides: number;
        radius: number;
    }

}

export {
    Geometry
}