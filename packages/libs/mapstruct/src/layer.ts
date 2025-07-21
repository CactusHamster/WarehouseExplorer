import { I_Implementation, copy_dict, reality_check } from "./util";
import { Geometry } from "./geometry";

// Layer in a map of geometries.
interface ILayer {
    id: string;
    name: string;
    display_name?: string;
    description?: string;
    geometry: Geometry.Element[];
}

class Layer implements ILayer, I_Implementation.Instance<ILayer> {
    id: string;
    name: string;
    display_name?: string | undefined;
    description?: string | undefined;
    geometry: Geometry.Element[];
    /**
     * Tests if an object can be turned to a Layer.
     * @param obj 
     */
    static test_compatible (dict: any): asserts dict is ILayer {
        //@TODO: Test optional properties if they exist.
        let required_keys = [ "id", "name", "geometry" ];
        let emsg_start = "Object not a Layer: ";
        for (let ki = 0; ki < required_keys.length; ki++) {
            let k = required_keys[ki];
            if (!(k in dict) || !reality_check(dict[k])) {
                throw new TypeError(emsg_start + "Missing required key: " + k);
                /* UNREACHED */
            }
        }
        if (typeof dict.id !== "string") {
            throw new TypeError(emsg_start + "Property \"id\" must be a string.");
        }
        if (typeof dict.name !== "string") {
            throw new TypeError(emsg_start + "Property \"name\" must be a string.");
        }
        if (!Array.isArray(dict.geometry)) {
            throw new TypeError(emsg_start + "Property \"geometry\" must be an array.");
        }
        for (let i = 0; i < dict.geometry.length; i++) {
            let shape = dict.geometry[i];
            try {
                Geometry.test_element(shape);
            } catch (e) {
                throw new TypeError(emsg_start + `Element ${i} of property "geometry" is not a valid Geometry::Element: ` + e);
            }
        }
    }
    /**
     * Creates a Layer object from a given dictionary.
     * @param obj 
     */
    static from_dict (dict: any): Layer {
        Layer.test_compatible(dict);
        return new Layer(dict);
    }
    /**
     * Converts the Layer to a referenceless dict.
     * @returns 
     */
    to_dict(): ILayer {
        let self = this;
        let result: ILayer = {
            id: self.id,
            name: self.name,
            display_name: self.name,
            description: self.description,
            geometry: []
        };
        for (let i = 0; i < self.geometry.length; i++) {
            // Remove any references for safety.
            let shape = copy_dict(self.geometry[i]);
            result.geometry.push( shape );
        }
        return result;
    }
    constructor (options: ILayer) {
        this.name = options.name;
        this.id = options.id;
        this.display_name = options.display_name;
        this.description = options.description;
        this.geometry = [];
        for (let i = 0; i < options.geometry.length; i++) {
            let shape = options.geometry[i];
            // Shapes are just dictionaries... so we use remove any references.
            let shape_copy = copy_dict(shape);
            this.geometry.push(shape_copy);
        }
    }
}

export const LayerCtor: I_Implementation.Constructor<Layer, ILayer> = Layer;

export {
    Layer,
}
export type {
    ILayer,
}