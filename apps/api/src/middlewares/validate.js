import Ajv from "ajv";
import addFormats from "ajv-formats";

const AjvClass = Ajv.default || Ajv;
const addFormatsFn = addFormats.default || addFormats;

const ajv = new AjvClass({ allErrors: true, removeAdditional: true });
addFormatsFn(ajv);

export function validateMiddleware(schema) {
    const validate = ajv.compile(schema);

    return (req, res, next) => {
        const isValid = validate(req.body);

        if (!isValid) {
            return res.status(400).json({
                error: "Validation Failed",
                details: validate.errors.map((err) => ({
                    path: err.instancePath,
                    message: err.message,
                })),
            });
        }

        next();
    };
}
