import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

export function loadExpress(app, { corsOrigins }) {
    app.use(helmet());

    app.use(
        cors({
            origin: corsOrigins,
            credentials: true,
        })
    );

    app.use(morgan("dev"));
}
