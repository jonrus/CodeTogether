import {app} from "./app";
import {PORT} from "./config";

app.listen(PORT, () => {
    console.log(`Server started: http://127.0.0.1:${PORT}`);
});
