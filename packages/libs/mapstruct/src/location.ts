import { reality_check, I_Implementation } from "./util"
import { Layout, ILayout } from "./layout"

interface ILocation {
    // 4 digit number describing the location (e.g. 3008)
    id: string;
    // More human-friendly identifier of the location (e.g. "Wier")
    name: string;
    // Location's display name
    display_name?: string;
    // Location's description
    description?: string;
    // Internal layout(s) of the warehouse
    // Allows multiple just for separation purposes
    // e.g. one layout for the main warehouse, another for the outside, etc.
    layouts: ILayout[] | ILayout;
}

class Location implements ILocation, I_Implementation.Instance<ILocation> {
    id: string;
    name: string;
    display_name?: string | undefined;
    description?: string | undefined;
    layouts: Layout[];
    /**
     * Asserts that the given dictionary can be converted to a Location.
     * @param dict 
     */
    static test_compatible(dict: any): asserts dict is Location {
        if (!reality_check<any>(dict)) {
            throw new Error("Object is not a Location: it is null or undefined.");
            /* UNREACHED */
        }
        let required_keys = ["id", "name", "layouts"];
        for (let key of required_keys) {
            if (!(key in dict)) {
                throw new Error(`Object is not a Location: missing '${key}' property.`);
                /* UNREACHED */
            }
        }
        if (typeof dict.id !== "string") {
            throw new Error("Object is not a Location: 'id' must be a string.");
            /* UNREACHED */
        }
        if (typeof dict.name !== "string") {
            throw new Error("Object is not a Location: 'name' must be a string.");
            /* UNREACHED */
        }
        if (Array.isArray(dict.layouts)) {
            for (let i = 0; i < dict.layouts.length; i++) {
                Layout.test_compatible(dict.layouts[i]);
            }
        } else {
            Layout.test_compatible(dict.layouts);
        }
    }
    /**
     * Converts to a location dictionary. No references left over.
     * @returns 
     */
    to_dict(): ILocation {
        let self = this;
        let id = self.id;
        let name = self.name;
        let display_name = self.display_name;
        let description = self.description;
        let layouts: ILayout[] = [];
        for (let i = 0; i < self.layouts.length; i++) {
            let l = self.layouts[i];
            layouts.push(l.to_dict());
        }
        return {
            id,
            name,
            display_name,
            description,
            layouts
        }
    }
    /**
     * Creates a Location instance from a given dictionary.
     */
    static from_dict(dict: any): Location {
        Location.test_compatible(dict);
        return new Location(dict);
    }
    constructor (options: ILocation) {
        this.id = options.id;
        this.name = options.name;
        this.display_name = options.display_name;
        this.description = options.description;
        this.layouts = [];
        if (Array.isArray(options.layouts)) {
            for (let i = 0; i < options.layouts.length; i++) {
                this.layouts.push(Layout.from_dict(options.layouts[i]));
            }
        }
        else {
            this.layouts.push(Layout.from_dict(options.layouts));
        }
    }
}

export const LocationCtor: I_Implementation.Constructor<Location, ILocation> = Location;

export {
    Location,
}
export type {
    ILocation,
}