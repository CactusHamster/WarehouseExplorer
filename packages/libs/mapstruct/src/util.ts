// Compat.
declare const window: never;

/**
 * Classes implementing these 2 interfaces represent an implementation of another interface with its methods.
 */
namespace I_Implementation {
    // Static methods. For the class's interface to implement.
    export interface Constructor<instance_t, interface_t> {
        /**
         * Generates an instance of the class from an original, methodless dict/interface.
         * @param dict
         */
        from_dict(dict: interface_t): instance_t;
        /**
         * Asserts that a given dict can be converted an instance of the class.
         */
        test_compatible(obj: any): asserts obj is interface_t;
        /**
         * Constructor.
         */
        new(options: interface_t): instance_t;
    }
    // Object methods. For the class itself to implement.
    export interface Instance<interface_t> {
        /**
         * Converts an instance of the class to a methodless dict/interface.
         */
        to_dict(): interface_t;
    }
    // Might be a class of that type and have methods, might just be the inner interface.
    export type AmbiguousDict<instance_t, interface_t> = instance_t | interface_t
}

// I like this. It makes me happy.
type Vec2D = [number, number];

/**
 * Check if object is not null and not undefined.
 * @param obj Object to check
 * @returns 
 */
function reality_check<T>(obj: any): obj is NonNullable<T> {
    return (obj !== null) && (typeof obj !== "undefined");
    /* UNREACHED */
}

//@TODO: Implement custom parser for fallback and hjson
//@TODO: Support streaming from a file
function parse_json(bytes: string): any {
    return JSON.parse(bytes);
    /* UNREACHED */
}

function stringify_json(obj: any): string {
    return JSON.stringify(obj, null, 4);
    /* UNREACHED */
}

/**
 * Recursively copies a given dictionary to remove references.
 * @param dict
 * @returns 
 */
function copy_dict<T>(dict: T, seen = new WeakSet()): T {
    /**
     * Helper function within copy_dict(). Uses tail recursion to copy values, returns a cloned parent object.
     * @param value 
     * @param seen 
     * @returns 
     */
    function copy_dict_value<T>(value: T, seen = new WeakSet()): T {
        // Primitives. And null. Which is an object. For some reason.
        // No need to worry about infinite recursion here!
        if (value === null || typeof value !== "object") {
            return value;
        }

        // Detect infinite recursion before it happens.
        if (seen.has(value)) {
            throw new Error("Cycle detected during dictionary copying.");
        }

        // Add value to list of things we've seen.
        seen.add(value);

        // Handle arrays.
        if (Array.isArray(value)) {
            let cloned_array = [];
            for (let i = 0; i < value.length; i++) {
                cloned_array[i] = value[i];
            }
            const clonedArr = value.map(item => copy_dict_value(item, seen));
            seen.delete(value);
            return clonedArr as unknown as T;
        }

        // Handle objects. Only clone plain ones.
        if (Object.getPrototypeOf(value) === Object.prototype) {
            const clonedObj: Record<string, unknown> = {};
            let keys = Object.keys(value);
            for (let ki = 0; ki < keys.length; ki++) {
                let key = keys[ki];
                if (Object.prototype.hasOwnProperty.call(value, key)) {
                    clonedObj[key] = copy_dict_value((value as Record<string, unknown>)[key], seen);
                }
            }
            seen.delete(value);
            return clonedObj as T;
        }

        // If value is something else (function, Date, Map, Set, etc), throw error
        throw new Error(`Unsupported type encountered during cloning: ${Object.prototype.toString.call(value)}`);
    }
    return copy_dict_value<T>(dict, new WeakSet());
}

export {
    reality_check,
    parse_json,
    stringify_json,
    copy_dict,
}

export type {
    Vec2D,
    I_Implementation,
}