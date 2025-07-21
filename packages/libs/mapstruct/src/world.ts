import { I_Implementation, reality_check, parse_json } from "./util";
import { Location, ILocation } from "./location"

// Compat:
declare const window: never;

interface IWorld {
    // Array of locations in the world
    locations: ILocation[];
}

/**
 * World is a collection of locations.
 * Each location has a unique identifier and a layout.
 * Basically just serves as a root object for the locations.
 */
class World implements IWorld, I_Implementation.Instance<IWorld> {
    locations: Location[];
    /**
     * Returns the World as a copied dictionary. No weird references attached.
     */
    to_dict (): IWorld {
        let self = this;
        let result: IWorld = {
            locations: []
        };
        for (let location of self.locations) {
            result.locations.push(location.to_dict());
        }
        return result;
    }
    /**
     * Throws if given dictionary cannot be converted to a World.
     * @param obj 
     * @returns 
     */
    static test_compatible (obj: any): asserts obj is IWorld  {
        if (!reality_check<any>(obj)) {
            throw new Error("Object is not a World: it is null or undefined.");
            /* UNREACHED */
        }
        if (typeof obj !== "object") {
            throw new Error("Object is not a World: not an object. Got type '" + typeof obj + "'.");
            /* UNREACHED */
        }
        if (!("locations" in obj)) {
            throw new Error("Object is not a World: missing 'locations' property.");
            /* UNREACHED */
        }
        for (let i = 0; i < obj.locations.length; i++) {
            let loc = obj.locations[i];
            Location.test_compatible(loc);
        }
        return;
        /* UNREACHED */
    }
    /**
     * Builds a World object from a dictionary.
     * @param obj 
     * @returns 
     */
    static from_dict(dict: any): World {
        try {
            World.test_compatible(dict);
        } catch (e) {
            throw new Error("Object cannot be converted to a World: " + e);
        }
        return new World({
            locations: dict.locations
        });
    }
    /**
     * Builds a World object from a JSON string.
     * @param str 
     * @returns 
     */
    static from_string(str: string): World {
        //@TODO: Allow streams and buffers as input. Process in chunks.
        let parsed: any;
        try {
            parsed = parse_json(str);
        } catch (e) {
            let e_msg = e instanceof Error ? e.message : String(e);
            e_msg = "Failed to parse world data from string: " + e_msg
            throw new Error(e_msg);
            /* UNREACHED */
        }
        if (reality_check<any>(parsed)) {
            try {
                World.test_compatible(parsed);
            } catch (e) {
                throw new Error("Parsed world data is not a valid World object: " + (e instanceof Error ? e.message : String(e)));
                /* UNREACHED */
            }
            return this.from_dict(parsed);
            /* UNREACHED */
        } else {
            throw new Error("Parsed world data is null or undefined");
            /* UNREACHED */
        }
        /* UNREACHED */
    }
    /**
     * Load world data from a file. Uses Node.js `fs` module to read the file.
     * @param file Path to the file containing world data **in JSON**.
     * @returns 
     */
    static async from_file(path: string): Promise<World> {
        // Sketchy browser compat code yayyy
        let fs: any;
        try {
            fs = await import("fs" as any) as any;
            if (!reality_check(fs) || fs.constructor.name !== "Object") {
                throw new Error("Failed to import 'fs' module: it is null or undefined.");
                /* UNREACHED */
            }
        }
        catch (e) {
            let e_msg = e instanceof Error ? e.message : String(e);
            throw new Error("Failed to import 'fs' module: " + e_msg);
            /* UNREACHED */
        }
        return new Promise<World>((resolve, reject) => {
            // yayy more sketchy code
            const readStream = ((fs as any).createReadStream as any)(path, { encoding: "utf-8" });
            let chunklist: (string | ArrayBufferLike)[] = [];
            readStream.on("data", (chunk: ArrayBufferLike) => chunklist.push(chunk));
            readStream.on("end", () => {
                let text = "";
                for (let chunk of chunklist) {
                    if (typeof chunk === "string") {
                        text += chunk;
                    }
                    else if (chunk instanceof ArrayBuffer || chunk instanceof SharedArrayBuffer) {
                        text += new ((window as any).TextDecoder as any)().decode(chunk);
                    }
                    else {
                        let e_msg = "Unexpected chunk type: " + (typeof chunk);
                        reject(e_msg);
                        return;
                        /* UNREACHED */
                    }
                }
                try {
                    const world = World.from_string(text);
                    resolve(world);
                    return;
                    /* UNREACHED */
                } catch (e) {
                    reject("Failed to parse world data from file: " + (e instanceof Error ? e.message : String(e)));
                    return;
                    /* UNREACHED */
                }
                /* UNREACHED */
            });
            readStream.on("error", (err: any) => {
                reject("Failed to read file: " + (err instanceof Error ? err.message : String(err)));
                return;
                /* UNREACHED */
            });
        });
        /* UNREACHED */
    }
    constructor(options: IWorld) {
        if (!reality_check(options)) {
            this.locations = [];
        }
        else {
            if (!reality_check(options.locations)) {
                this.locations = [];
            }
            else {
                this.locations = [];
                if (Array.isArray(options.locations)) {
                    for (let i = 0; i < options.locations.length; i++) {
                        let loc = options.locations[i];
                        Location.test_compatible(loc);
                        this.locations.push(loc);
                    }
                }
                else {
                    Location.test_compatible(options.locations);
                    this.locations.push(options.locations);
                }
            }
        }
    }
}

export const WorldCtor: I_Implementation.Constructor<World, IWorld> = World;

export {
    World
}
export type {
    IWorld
}