import { ILayer, Layer } from "./layer";
import { I_Implementation, reality_check } from "./util";

/**
 * Dictionary representing the layout of a space in the Location.
 * Contains multiple ILayer dictionaries to represent geometry.
 */
interface ILayout {
    // Unique identifier for the layout
    id: string;
    // Name of the layout
    name: string;
    // Display name of the layout
    display_name?: string;
    // Description of the layout
    description?: string;
    // Layers in this specific layout.
    // Holds geometry. Splits it into groups like zones and actual irl structures.
    layers: ILayer[];
    // List of objects in the layout
    //objects: LayoutGeometry.LayoutObject[];
}

/**
 * Object representing the layout of a space in the Location.
 * Contains multiple layer objects to represent geometry.
 */
class Layout implements ILayout, I_Implementation.Instance<ILayout> {
    id: string;
    name: string;
    display_name?: string | undefined;
    description?: string | undefined;
    layers: Layer[];
    static test_compatible(dict: any): asserts dict is ILayout {
        if (!reality_check<any>(dict)) {
            throw new Error("Object is not a Layout: it is null or undefined.");
            /* UNREACHED */
        }
        let required_keys = ["id", "name", "layers"];
        for (let key of required_keys) {
            if (!(key in dict)) {
                throw new Error(`Object is not a Layout: missing '${key}' property.`);
                /* UNREACHED */
            }
        }
        if (typeof dict.id !== "string") {
            throw new Error("Object is not a Layout: 'id' must be a string.");
            /* UNREACHED */
        }
        if (typeof dict.name !== "string") {
            throw new Error("Object is not a Layout: 'name' must be a string.");
            /* UNREACHED */
        }
        if (!Array.isArray(dict.layers)) {
            throw new Error("Object is not a Layout: 'layers' must be an array.");
            /* UNREACHED */
        }
        else {
            if (dict.layers.length > 0) {
                for (let i = 0; i < dict.layers.length; i++) {
                    let o = dict.layers[i];
                    try {
                        Layer.test_compatible(o);
                    } catch (e) {
                        throw new Error(`Object is not a valid Layout: found invalid Layer at index ${i}: "${e}".`);
                        /* UNREACHED */
                    }
                }
            }
        }
    }
    static from_dict(dict: any): Layout {
        Layout.test_compatible(dict);
        return new Layout(dict);
    }
    to_dict(): ILayout {
        let self = this;
        let result: ILayout = {
            id: self.id,
            name: self.name,
            layers: []
        };
        for (let i = 0; i < self.layers.length; i++) {
            result.layers.push(self.layers[i].to_dict())
        }
        return result;
    }
    constructor(options: ILayout) {
        this.id = options.id;
        this.name = options.name;
        this.display_name = options.display_name;
        this.description = options.description;
        this.layers = [];
        for (let i = 0; i < options.layers.length; i++) {
            let layer = this.layers[i];
            this.layers.push(
                Layer.from_dict(layer)
            )
        }
    }
}

export const LayoutCtor: I_Implementation.Constructor<Layout, ILayout> = Layout;

export {
    Layout
}
export type {
    ILayout
}