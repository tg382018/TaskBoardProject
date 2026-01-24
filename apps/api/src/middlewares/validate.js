import Ajv from "ajv";
import addFormats from "ajv-formats";

const AjvClass = Ajv.default || Ajv;
const addFormatsFn = addFormats.default || addFormats;

const ajv = new AjvClass({ allErrors: true, removeAdditional: true });
//nestte ki whitelist true =removeadditional true = gelen veride fazladan field varsa siler
addFormatsFn(ajv);
// ajv ye hazır kuralları ekler

export function validateMiddleware(schema) {
    const validate = ajv.compile(schema);
    //ajv yi json schemeya dönüştürürki gelen req.body ile karşılaştırsın
    return (req, res, next) => {
        const isValid = validate(req.body);
        //gelen veriyi şemaya göre kontrol eder
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
