import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

export function loadExpress(app, { corsOrigins }) {
    app.use(helmet()); //header güvenliği
    app.use(cookieParser());

    app.use(
        cors({
            origin: corsOrigins,
            credentials: true,
        })
    );

    app.use(morgan("dev")); //detaylı request logları
}
